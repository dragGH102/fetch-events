import React, { useState } from 'react'
import styles from '../app-assets/ListItem.module.sass';
import '../app-assets/global.module.sass'
import {getBlockiesSeed, getEventBlockTime, getListEventLabel, stripHtmlTags, timer} from "../lib/colonyHelpers"
import BlockiesIdenticon from "./BlockiesIdenticon"
import { useEffect } from 'react';

const ListItem = React.memo(({ event, setEventBlockTime, index }: { event: any, setEventBlockTime: Function, index: number }) => {

    const [description, setDescription] = useState('')
    const [displayDate, setDisplayDate] = useState('')
    const [loading, setLoading] = useState(true)

    const setBlockTime = async() => {
        // @ts-ignore

        setLoading(true)
        try {
            const blockTime = await getEventBlockTime(event)

            // @ts-ignore
            const blockDate = new Date(blockTime)
            const day = blockDate.getDate()
            const month = blockDate.toLocaleString('default', {month: 'short'})

            setDisplayDate(`${day} ${month}`)

            setEventBlockTime(event.logIndex, blockTime)
            setLoading(false)

        }
        catch (e) {
            // wait a bit to to retry avoid 429 backend error
            setTimeout (async() => {
                console.log(`[${index}] retrying for ${event.logIndex}`)
                await setBlockTime()
            }, index * 1000)
        }
    }

    useEffect(() => {
        (async() => {
            setDescription(await getListEventLabel(event))
            setBlockTime()
        })()
    },[])

    return (<article>
        <li className={styles['event-list__item']}>
            {/* @ts-ignore */}
            <BlockiesIdenticon opts={{seed: getBlockiesSeed(event)}}/>
            <div className={styles['event__description-container']}>
                {loading && "(Loading...)"}
                <div
                    title={stripHtmlTags(description)}
                    className={styles['event__description']}
                    dangerouslySetInnerHTML={{__html: description}}
                />
                <div className={styles['event__date']}>{displayDate}</div>
            </div>
        </li>
    </article>)
})

export default ListItem
