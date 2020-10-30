import React, { useEffect, useState } from 'react'
import styles from '../app-assets/EventList.module.sass'
import {getEventLog} from "../lib/colonyHelpers"
import Label from "./Label";

const EventList: React.FC = () => {
    // todo: data loading logic here
    let [events, setEvents] = useState([])
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState(null)

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

    useEffect(() => {
        // catch global promises rejection
        const listener = (event: Event) => {
            const reason = (event as any).reason

            console.error(reason);
            setLoading(false)
            setError(reason)
        }

        window.addEventListener("unhandledrejection", listener);

        return (() => window.removeEventListener("unhandledrejection", listener ))
    })


    return (<ul className={styles['event-list']}>
        {/* @ts-ignore */}
        {loading && <Label labelText="Loading..." type="info"></Label>}
        {error && <Label labelText={`${error}`} type="error"></Label>}
        {events.map((event: any, i) => (
            <article key={i}><li className={styles['event-list__item']}>{event.name}</li></article>
        ))}
    </ul>)
}

export default EventList
