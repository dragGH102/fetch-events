import React from 'react'
import styles from '../app-assets/EventList.module.sass'

const EventList = () => {
    // todo: data loading logic here

    return (<ul>
        <li className={styles['list-item']}>Future event list item with a loop</li>
    </ul>)
}

export default EventList
