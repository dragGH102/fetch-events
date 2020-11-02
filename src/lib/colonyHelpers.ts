import colonyClient from './colonyClient'
import { ColonyRole, ColonyClient, getLogs, getBlockTime, Network } from '@colony/colony-js'
import { Log } from 'ethers/providers'
import { ethers, utils } from 'ethers'
import { contractMapping } from "./contract-map"

let client: ColonyClient

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

        // convert bignumber to string
        const humanReadableAmount = new utils.BigNumber(amount);
        // Get a base 10 value as a BigNumber instance
        const wei = new utils.BigNumber(10);
        const convertedAmount = humanReadableAmount.div(wei.pow(18));

        return `User <span style="${fontWeight}">${userAddress}</span> claimed <span style="${fontWeight}">${convertedAmount.toString()} ${getTokenNameByAddress(token)}</span> payout from pot <span style="${fontWeight}">${fundingPotId}</span>`
    }
    else if (name === 'DomainAdded') {
        const { domainId } = event.values
        return `Domain <span style="${fontWeight}">${domainId}</span> added`
    }

    return 'Invalid event'

}

export const timer = (ms: number) => new Promise(res => setTimeout(res, ms))

const getParsedArrayWithRecipient = async (parsedArray: Array<Log>) => {
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

export const getEventBlockTime = async (event: any) => {
    const blockTime = await getBlockTime(ethers.getDefaultProvider(Network.Mainnet), event.blockHash);
    // console.log(blockTime)

    return blockTime
}

export const getEventLog = async () => {
    client = await colonyClient

    const filters = ['ColonyInitialised', 'ColonyRoleSet', 'PayoutClaimed', 'DomainAdded']

    // for each filter, fetch event log
    const result: Array<Promise<Log[]>> = filters.map(async(filterId: any) => {
        return await getLogs(client, (client as any).filters[filterId]())
    })

    let resultSliced: Log[] = []

    // slice promises (pagination) and resolve ones we currently need
    // they are nested in 4 arrays (from filters)
    result.map(async (logPromise) => {
        // resolve set-filter
        const set = await logPromise

        // resolve single logs
        await set.map(async (log: any) => {
            // add parsed properties
            const parsedLog = await client.interface.parseLog(log)

            resultSliced.push(Object.assign({}, parsedLog, log))
        })
    })

    console.log('resultSliced', resultSliced)
/*
   // Store block time for each event
    // TODO: is this block preventing the array to fill in? ... could try to do in the loop above

    console.log('parsedArrayWithBlockTime', parsedArrayWithBlockTime)

    // sort by block time
    const sortedArray = await parsedArrayWithBlockTime.sort((a: any, b: any) => {
        // console.log(a.blockTime, b.blockTime);
        return b.blockTime - a.blockTime
    })
    // TODO: check order is correct
    // + must resort when new page comes in (@ react component via utility function)
    console.log('sortedArrayBN', sortedArray.map((a: any) => a.blockTime))

    // Store recipient ID for PayoutClaimed event
    // await timer(2000)
    const parsedArrayWithRecipient = await getParsedArrayWithRecipient(client, sortedArray)

    console.log('parsedArrayWithRecipient', parsedArrayWithRecipient)

    // return sortedArray
    return parsedArrayWithRecipient*/

    return resultSliced
}
