//@ts-ignore
import React, { Suspense } from 'react'
//@ts-ignore
import { Router } from '@reach/router'
import { database } from './Database'
import Loading from './Loading'
//@ts-ignore
const Retro = React.lazy(() => import('./Retro'))
//@ts-ignore
const Home = React.lazy(() => import('./Home'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Home path="/" />
        <Retro path="/r/:retroId" />
      </Router>
    </Suspense>
  )
}
export default App
