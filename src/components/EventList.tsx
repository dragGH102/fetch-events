import React, {Fragment, useEffect, useState, useReducer } from 'react'
import styles from '../app-assets/EventList.module.sass'
import { getEventLog } from "../lib/colonyHelpers"
import Label from "./Label";
import ListItem from "./ListItem";
import Button from "./Button";

const EventList: React.FC = () => {
    // todo: data loading logic here
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const eventsPerPage = 10

    const reloadTime = 10000

    useEffect(() => {
        (async () => {
            await setLoading(true)
            const newEvents = await getEventLog()

            setEvents(newEvents as any)

            await setLoading(false)

            // Give enough time to the promises (returned by getEventLog) to fully resolve and store the updated state
            setTimeout(() => {
              forceUpdate()
            }, 2000)
        })()
    }, [])

    const loadNextPage = () => setPage(page + 1)

    useEffect(() => {
      if (error) {
          setTimeout(() => window.location.reload(), reloadTime)
      }

    }, [error])

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


    return (<Fragment><ul className={styles['event-list']}>
        {loading && <Label labelText="Loading..." type="info"></Label>}

        {error && <a
            href="javascript:void(0)"
            onClick={() => window.location.reload()}>
            <Label labelText={`${error} <br> Reloading in ${ reloadTime / 1000 } seconds... or click to reload`} type="error"></Label>
        </a>}

        {!loading && events.map((event: any, i) => {
            return (i > (page - 1) * eventsPerPage + 10) ? null : <ListItem event={event} key={i} />
        })}
        <Label labelText={`Number of events loaded: ${events.length} / Displayed: ${Math.min((page - 1) * eventsPerPage + 10, events.length)}`} type="info"/>

    </ul>
    {((page - 1) * eventsPerPage + 10 < events.length) && <Button labelText="Load more" onClick={() => loadNextPage()} />}
    </Fragment>)
}

export default EventList
