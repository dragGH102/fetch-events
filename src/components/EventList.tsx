import React, { Fragment, useEffect, useState } from 'react'
import styles from '../app-assets/EventList.module.sass'
import { getEventLog } from "../lib/colonyHelpers"
import Label from "./Label";
import ListItem from "./ListItem";
import Button from "./Button";

const EventList: React.FC = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const eventsPerPage = 10

    const loadData = () => {
        (async() => {
            if (events.length > 0) return

            await setLoading(true)
            const newEvents = await getEventLog()
            console.log(newEvents);

            // @ts-ignore
            setEvents([...newEvents as any])
            setLoading(false)
        })()
    }

    useEffect(() => {
        loadData()
    })

    const loadNextPage = () => {
        setPage(page + 1)
    }

    const setEventBlockTime = (logIndex: number, blockTime: number) => {
        const finalEvents: any = [].concat(events)
        finalEvents.find((e: any) => e.logIndex === logIndex).blockTime = blockTime

        // @ts-ignore
        setEvents([ ...finalEvents.sort((a: any, b: any) => {
            // console.log(a.blockTime, b.blockTime);
            return b.blockTime - a.blockTime
        })])
    }

   useEffect(() => {
        // catch global promises rejection
        const listener = (err: any) => {
            const reason = err.reason
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
            <Label labelText={`${error}. Click to reload`} type="error"></Label>
        </a>}
        {!loading && events.map((event: any, i) => {
            return (i > (page - 1) * eventsPerPage + 10) ? null
                : <ListItem event={event} key={i} index={i} setEventBlockTime={(logIndex: number, blockTime: number) => setEventBlockTime(logIndex, blockTime)} />
        })}

    </ul>
    {(page - 1) * eventsPerPage + 10 < events.length && <Button
        labelText={`Load more...`}
        onClick={() => loadNextPage()}
    />}
    </Fragment>)
}

export default EventList
