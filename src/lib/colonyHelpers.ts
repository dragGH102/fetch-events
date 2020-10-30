import colonyClient from './colonyClient'
import { ColonyClient, getLogs } from '@colony/colony-js'
import { Log } from 'ethers/providers'
import { utils } from 'ethers'

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
    // TODO: this is even better if we use paginated result (e.g. parsing events in batch of 20)
    // maybe via Observables?
    const parsedArrayWithRecipient = await getParsedArrayWithRecipient(client, parsedArray)

    return parsedArrayWithRecipient
}
