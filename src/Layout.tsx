import React from 'react'
import styles from './app-assets/Layout.module.sass'
import Header from './components/Header'
import EventList from "./components/EventList";
import Footer from "./components/Footer";

function Layout() {
  return (
    <div className={styles.Layout}>
      <Header />
      <main>
          <article>
              <EventList />
          </article>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
