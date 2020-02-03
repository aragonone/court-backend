import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Store from './store/store'
import Root from './components/core/Root.react'

ReactDOM.render(<Root store={Store} />, document.getElementById('root'))
