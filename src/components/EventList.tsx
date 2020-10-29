import React, {useEffect, useState} from 'react'
import styles from '../app-assets/EventList.module.sass'
import {ColonyClient, getLogs} from '@colony/colony-js'
import colonyClient from "../lib/colonyClient";
import {Log} from "ethers/providers";

const EventList: React.FC = () => {
    // todo: data loading logic here
    const [events, setEvents] = useState([])

    useEffect(() => {

        const getEventLog = async () => {
            colonyClient.then((client: ColonyClient) => {
                const filters = ['ColonyInitialised', 'ColonyRoleSet', 'PayoutClaimed', 'DomainAdded']

                // for each filter, fetch event log
                const result: Array<Promise<Log[]>> = filters.map((filterId: any) => {
                    return getLogs(client, (client as any).filters[filterId]())
                    // return acc.then((accValue) => accValue.concat(filterLogs))
                })

                // resolve promised returned
                Promise.all(result)
                    .then(((resolvedPromises: Array<Log[]>) => {
                        // flatten array
                        const flatArray = resolvedPromises.flat(1)
                        // sort by blockId and logId
                        const sortedArray = flatArray.sort((a: any, b: any) => {
                            if (a.blockNumber < b.blockNumber) return +1
                            else if (a.blockNumber > b.blockNumber) return - 1
                            else return (a.logIndex < b.logIndex ? +1 : -1)
                        })

                        console.log(sortedArray);
                    }))

                // logs.map(event => client.interface.parseLog(event))
            })
        }

        getEventLog()
        }, [])

    return (<ul className={styles['event-list']}>
        <article><li className={styles['event-list__item']}>Future event list item with a loop</li></article>
    </ul>)
}

export default EventList
