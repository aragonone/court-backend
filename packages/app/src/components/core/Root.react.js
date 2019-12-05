import React from 'react'
import App from './App.react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'

const browserHistory = createBrowserHistory()

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <App/>
    </Router>
  </Provider>
)

export default Root
