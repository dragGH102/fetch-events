import colonyClient from './colonyClient'
import { ColonyRole, ColonyClient, getLogs } from '@colony/colony-js'
import { Log } from 'ethers/providers'
import { utils } from 'ethers'
import {contractMapping} from "./contract-map";

export const getColonyRoleString = (roleId: number) => ColonyRole[roleId]

export const getTokenNameByAddress = (tokenAddress: string): string => {
    const entry = (contractMapping as any)[tokenAddress]

    console.log(tokenAddress, entry?.symbol || 'Invalid token')

    return entry?.symbol || 'Invalid token'
}

export const stripHtmlTags = (str: string) => {
    if ((str===null) || (str===''))  return undefined;
    else {
        str = str.toString();
        return str.replace(/<[^>]*>/g, '');
    }
}

export const getBlockiesSeed = (event: any): string => {
    return event.userAddress || event.user
        // if no viable seed available, use random string
        || Math.random().toString(36).substring(5)
}

export const getListEventLabel = (event: any): string => {
    const name = event.name
    const fontWeight = "font-weight: 700"

    if (name === 'ColonyInitialised') {
        return 'Congratulations! It\'s a beautiful baby colony!'
    }
    else if (name === 'ColonyRoleSet') {
       const { role, domainId, user: userAddress } = event.values
       return `<span style="${fontWeight}">${getColonyRoleString(role)}</span> role assigned to user <span style="${fontWeight}">${userAddress}</span> in domain <span style="${fontWeight}">${domainId}</span>`
    }
    else if (name === 'PayoutClaimed') {
        const { userAddress, values } = event
        const { amount, token, fundingPotId } = values

        return `User <span style="${fontWeight}">${userAddress}</span> claimed <span style="${fontWeight}">${amount}&nbsp;${getTokenNameByAddress(token)}</span> payout from pot <span style="${fontWeight}">${fundingPotId}</span>`
    }
    else if (name === 'DomainAdded') {
        const { domainId } = event.values
        return `Domain <span style="${fontWeight}">${domainId}</span> added`
    }

    return 'Invalid event'

}

export const timer = (ms: number) => new Promise(res => setTimeout(res, ms))

const getParsedArrayWithRecipient = async (client: ColonyClient, parsedArray: Array<Log>) => {
    let parsedArrayWithRecipient: any = []

    await parsedArray.map(async (event: any, i) => {
        // delay execution to prevent reaching API rate limit
        if (i % 5 === 0) await timer(1000)

        if (event.name !== "PayoutClaimed") return parsedArrayWithRecipient.push(event)

        const humanReadableFundingPotId = new utils.BigNumber(
            event.values.fundingPotId
        ).toString()

        const {
            associatedTypeId,
        } = await client.getFundingPot(humanReadableFundingPotId)

        const {recipient: userAddress} = await client.getPayment(associatedTypeId)

        return parsedArrayWithRecipient.push(Object.assign({}, event, {userAddress}))
    })

    return parsedArrayWithRecipient
}

export const getEventLog = async () => {
    const client: ColonyClient = await colonyClient

    const filters = ['ColonyInitialised', 'ColonyRoleSet', 'PayoutClaimed', 'DomainAdded']

    // for each filter, fetch event log
    const result: Array<Promise<Log[]>> = filters.map((filterId: any) => {
        return getLogs(client, (client as any).filters[filterId]())
        // return acc.then((accValue) => accValue.concat(filterLogs))
    })

    // resolve promised returned
    const resolvedPromises: Array<Log[]> = await Promise.all(result)

    // flatten array of arrays
    const flatArray = resolvedPromises.flat(1)

    // Sort by blockId and logId
    // TODO: get date instead https://github.com/JoinColony/coding-challenge-events-list#getting-the-date
    const sortedArray = flatArray.sort((a: any, b: any) => {
        if (a.blockNumber < b.blockNumber) return +1
        else if (a.blockNumber > b.blockNumber) return - 1
        else return (a.logIndex < b.logIndex ? +1 : -1)
    })

    // Parse log items
    const parsedArray = sortedArray.map((event: Log) => Object.assign({}, client.interface.parseLog(event), event))

    // Store recipient ID for PayoutClaimed event
    const parsedArrayWithRecipient = await getParsedArrayWithRecipient(client, parsedArray)

    return parsedArrayWithRecipient
}
