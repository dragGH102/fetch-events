import colonyClient from './colonyClient'
import { ColonyRole, ColonyClient, getLogs, getBlockTime, Network } from '@colony/colony-js'
import { Log } from 'ethers/providers'
import { ethers, utils } from 'ethers'
import { contractMapping } from "./contract-map"

let client: ColonyClient

type ParsedSet = {
    blockTime?: number
    values?: any
    userAddress?: string
    user?: any
    name: string
    blockHash: string
}

export const getColonyRoleString = (roleId: number) => ColonyRole[roleId]

export const getTokenNameByAddress = (tokenAddress: string): string => {
    const entry = (contractMapping as any)[tokenAddress]

    return entry?.symbol || 'Invalid token'
}

export const stripHtmlTags = (str: string) => {
    if ((str===null) || (str===''))  return undefined;
    else {
        str = str.toString();
        return str.replace(/<[^>]*>/g, '');
    }
}

export const getBlockiesSeed = (event: ParsedSet): string => {
    return event.userAddress || event.user
        // if no viable seed available, use random string
        || Math.random().toString(36).substring(5)
}

export const getListEventLabel = async (event: ParsedSet) => {
    const name = event.name
    const fontWeight = "font-weight: 700"

    if (name === 'ColonyInitialised') {
        return 'Congratulations! It\'s a beautiful baby colony!'
    } else if (name === 'ColonyRoleSet') {
        const {role, domainId, user: userAddress} = event.values
        return `<span style="${fontWeight}">${getColonyRoleString(role)}</span> role assigned to user <span style="${fontWeight}">${userAddress}</span> in domain <span style="${fontWeight}">${domainId}</span>`
    } else if (name === 'PayoutClaimed') {
        const {amount, token, fundingPotId} = event.values

        // convert bignumber to string
        const humanReadableAmount = new utils.BigNumber(amount);
        // Get a base 10 value as a BigNumber instance
        const wei = new utils.BigNumber(10);
        const convertedAmount = humanReadableAmount.div(wei.pow(18));

        const userAddress = await getEventRecipient(event)

        return `User <span style="${fontWeight}">${userAddress}</span> claimed <span style="${fontWeight}">${convertedAmount.toString()} ${getTokenNameByAddress(token)}</span> payout from pot <span style="${fontWeight}">${fundingPotId}</span>`
    } else if (name === 'DomainAdded') {
        const {domainId} = event.values
        return `Domain <span style="${fontWeight}">${domainId}</span> added`
    }

    return 'Invalid event'
}

const getEventRecipient = async (event: ParsedSet): Promise<undefined | string> => {
    if (event.name !== "PayoutClaimed") return undefined

    const humanReadableFundingPotId = new utils.BigNumber(
        event.values.fundingPotId
    ).toString()

    const {
        associatedTypeId,
    } = await client.getFundingPot(humanReadableFundingPotId)

    const {recipient: userAddress} = await client.getPayment(associatedTypeId)

    return userAddress
}

export const getEventBlockTime = async (event: ParsedSet): Promise<number> => {
    try {
        const blockTime = await getBlockTime(ethers.getDefaultProvider(Network.Mainnet), event.blockHash);

        return blockTime
    }
    catch(e) {
        return Promise.reject(new Error(e.reason))
    }
}

export const getEventLog = async (): Promise<ParsedSet[]> => {
    client = await colonyClient

    const filters = ['ColonyInitialised', 'ColonyRoleSet', 'PayoutClaimed', 'DomainAdded']

    // for each filter, fetch event log
    const result: Array<Promise<Log[]>> = filters.map(async(filterId: any) => {
        return await getLogs(client, (client as any).filters[filterId]())
    })

    const results = await result.map(async (logPromise) => {
        // fulfill set-filter
        return await logPromise
    })

    // Resolve the promises returned my map
    const events: Log[][] = await Promise.all(results)

    // Flatten result array-of-array
    const flatEvents: Log[] = events.flat(1)

    // add parsed properties
    const parsedEvents: any = flatEvents.map((log: Log) => {
        // add parsed properties
        const parsedLog = client.interface.parseLog(log)

        return Object.assign({}, parsedLog, log)
    })

    return parsedEvents
}
