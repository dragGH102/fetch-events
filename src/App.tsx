import React from 'react'
import styles from './app-assets/App.module.sass'
import Header from './components/Header'
import EventList from "./components/EventList";

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <main>
          <article>
              <EventList />
          </article>
      </main>
    </div>
  )
}

export default App
