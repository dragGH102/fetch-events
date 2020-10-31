import React from 'react'
import styles from '../app-assets/ListItem.module.sass';
import '../app-assets/global.module.sass'
import {getBlockiesSeed, getListEventLabel, stripHtmlTags} from "../lib/colonyHelpers"
import BlockiesIdenticon from "./BlockiesIdenticon"

const ListItem = ({ event }: { event: any }) => {
    const description = getListEventLabel(event)

    const blockDate = new Date(event.blockTime)
    const day = blockDate.getDate()
    const month = blockDate.toLocaleString('default', { month: 'narrow' })

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
                <div className={styles['event__date']}>{day}&nbsp;{month}</div>
            </div>
        </li>
    </article>)
}

export default ListItem
