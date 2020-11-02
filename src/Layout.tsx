import React from 'react'
import styles from './app-assets/Layout.module.sass'
import Header from './components/Header'
import EventList from "./components/EventList";

function Layout() {
  return (
    <div className={styles.Layout}>
      <Header />
      <main>
          <article>
              <EventList />
          </article>
      </main>
    </div>
  )
}

export default Layout
