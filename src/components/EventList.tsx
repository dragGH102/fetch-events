import React, { useEffect, useState } from 'react'
import styles from '../app-assets/EventList.module.sass'
import {getEventLog} from "../lib/colonyHelpers"
import Label from "./Label";

const EventList: React.FC = () => {
    // todo: data loading logic here
    let [events, setEvents] = useState([])
    let [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            await setLoading(true)
            const events = await getEventLog()

            // Give enough time to the promises (returned by getEventLog) to fully resolve
            setTimeout(() => {
                setEvents(events)
            }, 1000)

            await setLoading(false)
        })()
    }, [])


    return (<ul className={styles['event-list']}>
        {/* @ts-ignore */}
        {loading && <Label labelText="Loading..."></Label>}
        {events.map((event: any, i) => (
            <article key={i}><li className={styles['event-list__item']}>{event.name}</li></article>
        ))}
    </ul>)
}

export default EventList
