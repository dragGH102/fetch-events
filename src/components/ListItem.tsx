import React from 'react'
import styles from '../app-assets/ListItem.module.sass';
import '../app-assets/global.module.sass'
import { getBlockiesSeed, getListEventLabel } from "../lib/colonyHelpers"
import BlockiesIdenticon from "./BlockiesIdenticon"


const ListItem = ({ event }: { event: any }) => (
    <article>
        <li className={styles['event-list__item']}>
            {/* @ts-ignore */}
            <BlockiesIdenticon opts={{ seed: getBlockiesSeed(event) }} />
            <div dangerouslySetInnerHTML={{__html: getListEventLabel(event) }} />
        </li>
    </article>
)

export default ListItem
