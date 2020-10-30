import React from 'react'
import styles from '../app-assets/ListItem.module.sass';
import '../app-assets/global.module.sass'

import { getListEventLabel } from "../lib/colonyHelpers";


const ListItem = ({ event }: { event: any }) => (
    <article>
        <li className={styles['event-list__item']}>
            <div dangerouslySetInnerHTML={{__html: getListEventLabel(event) }} />
        </li>
    </article>
)

export default ListItem
