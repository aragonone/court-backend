import React from 'react'
import Home from '../home/Home'
import Store from '../../store/store'
import Modal from '../common/Modal.react'
import Error from '../common/Error.react'
import Navbar from './Navbar.react'
import DisputesList from '../disputes/DisputesList.react'
import DisputeDetail from '../disputes/DisputeDetail.react'
import ANJBalancesList from '../anj/ANJBalancesList.react'
import ANJTransfersList from '../anj/ANJTransfersList.react'
import { Switch, Route } from 'react-router-dom'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { fetching: false }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
  }

  render() {
    const { fetching } = this.state
    return (
      <div ref="app">
        <Navbar/>
        <div className="main-container">
          <Error/>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/anj-balances/" exact component={ANJBalancesList}/>
            <Route path="/anj-transfers/:address" component={ANJTransfersList}/>
            <Route path="/disputes/" exact component={DisputesList}/>
            <Route path="/dispute/:id" component={DisputeDetail}/>
          </Switch>
        </div>
        <Modal open={fetching} progressBar message={fetching}/>
      </div>
    )
  }

  _onChange() {
    if(this.refs.app) {
      const { fetching } = Store.getState()
      this.setState({ fetching })
    }
  }
}
