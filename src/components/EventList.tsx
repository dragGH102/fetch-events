import React, {Fragment, useEffect, useState, useReducer } from 'react'
import styles from '../app-assets/EventList.module.sass'
import {getEventLog} from "../lib/colonyHelpers"
import Label from "./Label";
import ListItem from "./ListItem";
import Button from "./Button";

const EventList: React.FC = () => {
    // todo: data loading logic here
    const [events, setEvents] = useState([])
    const [sortedEvents, setSortedEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(0)
    const [buttonEnabled, setButtonEnabled] = useState(true)
    const [_, forceUpdate] = useReducer(x => x + 1, 0)
    const eventsPerPage = 10

    const reloadTime = 20000

    useEffect(() => {
        (async () => {
            await setLoading(true)
            getEventLog().then((newEvents) => {
                setEvents(newEvents as any)
                setLoading(false)
            })
        })()
    }, [])

    const loadNextPage = () => {
        if (!buttonEnabled) return

        setButtonEnabled(false)
        setPage(page + 1)
        setTimeout(() => setButtonEnabled(true), reloadTime)
    }

    const setEventBlockTime = (logIndex: number, blockTime: number) => {
        const finalEvents: any = [].concat(events)
        finalEvents.find((e: any) => e.logIndex === logIndex).blockTime = blockTime

        setSortedEvents(finalEvents.sort((a: any, b: any) => {
            // console.log(a.blockTime, b.blockTime);
            return b.blockTime - a.blockTime
        }))
    }

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
            <Label labelText={`${error} <br> Click to reload`} type="error"></Label>
        </a>}

        {!loading && sortedEvents.map((event: any, i) => {
            return (i > (page - 1) * eventsPerPage + 10) ? null
                : <ListItem event={event} key={i} setEventBlockTime={(logIndex: number, blockTime: number) => setEventBlockTime(logIndex, blockTime)} />
        })}

    </ul>
    {(page === 0 || (page - 1) * eventsPerPage + 10 < events.length) && !error && !loading && <Button
        labelText={`Load ${page === 0 ? 'initial': `more (wait ${reloadTime/1000}s to avoid API 429)`}`}
        onClick={() => loadNextPage()}
        disabled={!buttonEnabled}
    />}
    </Fragment>)
}

export default EventList
