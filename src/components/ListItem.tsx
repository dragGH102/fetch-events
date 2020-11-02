import React, { useState } from 'react'
import styles from '../app-assets/ListItem.module.sass';
import '../app-assets/global.module.sass'
import {getBlockiesSeed, getEventBlockTime, getListEventLabel, stripHtmlTags} from "../lib/colonyHelpers"
import BlockiesIdenticon from "./BlockiesIdenticon"
import { useEffect } from 'react';

const ListItem = ({ event }: { event: any }) => {

    const [displayDate, setDisplayDate] = useState('')
    const description = getListEventLabel(event)

    useEffect(() => {
        (async ()=> {
            const blockTime = await getEventBlockTime(event)

            const blockDate = new Date(blockTime)
            const day = blockDate.getDate()
            const month = blockDate.toLocaleString('default', { month: 'short' })

            setDisplayDate(`${day} ${month}`)
        })()
    })


    return (<article>
        <li className={styles['event-list__item']}>
            {/* @ts-ignore */}
            <BlockiesIdenticon opts={{seed: getBlockiesSeed(event)}}/>
            <div className={styles['event__description-container']}>
                <div
                    title={stripHtmlTags(description)}
                    className={styles['event__description']}
                    dangerouslySetInnerHTML={{__html: description}}
                />
                <div className={styles['event__date']}>{displayDate}</div>
            </div>
        </li>
    </article>)
}

export default ListItem
