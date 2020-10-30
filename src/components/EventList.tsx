import React, { useEffect, useState } from 'react'
import styles from '../app-assets/EventList.module.sass'
import {getEventLog} from "../lib/colonyHelpers"
import Label from "./Label";
import ListItem from "./ListItem";

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
           // TODO: introduce pagination instead of timeout if possible @ getEventLog
            console.log(events)
                setEvents(events)
           }, 2000)

            await setLoading(false)
        })()
    }, [])

    useEffect(() => {
        // catch global promises rejection
        const listener = (event: Event) => {
            const reason = (event as any).reason

            // console.error(reason);
            setLoading(false)
            setError(reason)
        }

        window.addEventListener("unhandledrejection", listener);

        return (() => window.removeEventListener("unhandledrejection", listener ))
    })


    return (<ul className={styles['event-list']}>
        <Label labelText={`Number of events loaded: ${events.length}`} type="info"/>
        {loading && <Label labelText="Loading..." type="info"></Label>}

        {error && <a
            role="presentation"
            onClick={() => window.location.reload()}>
            <Label labelText={`${error}. Click to reload`} type="error"></Label>
        </a>}
        {events.map((event: any, i) => (<ListItem event={event} key={i} />))}
    </ul>)
}

export default EventList
