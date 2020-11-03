Run: `yarn && yarn start`

Used:
- Typescript
- Sass
- ES6 semicolon-less syntax
- HTML semantic components for accessibility
- Immutable state update

Possible improvement: REDUX+sagas for clear state management & data fetching logic

Some other ideas for tests...
`EventList.tsx`

    test('should set the events if returned by getEventLog', () => {})
    test('should show the list items', () => {})
    test('should show the read more button if end of least is not reached', () => {})

`ListItem.tsx`

    test('setBlockTime should result into displaying human-readable dates, () => {})
    test('should look the same on every test (snapshot), () => {})

`colonyUtilities.ts`

    test('getEventsLog should returned the list of parsed events', () => {})

In practice whitebox testing can be unnecessary ( https://bambielli.com/til/2019-12-12-directly-testing-react-component-methods-considered-harmful/ ) therefore **similar tests can be done for integration (jest/cypress/selenium) to simply tests components are displayed correctly under real network conditions**
