import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Store from './store/store'
import Root from './components/core/Root.react'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<Root store={Store} />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
