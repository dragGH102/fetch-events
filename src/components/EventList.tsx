import React from 'react'
import styles from '../app-assets/EventList.module.sass'

const EventList = () => {
    // todo: data loading logic here

    return (<ul className={styles['event-list']}>
        <article><li className={styles['event-list__item']}>Future event list item with a loop</li></article>
    </ul>)
}

export default EventList
