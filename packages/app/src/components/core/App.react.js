import React from 'react'
import Home from '../home/Home'
import Store from '../../store/store'
import Modal from '../common/Modal.react'
import Error from '../common/Error.react'
import Navbar from './Navbar.react'
import Login from '../admin/Login.react'
import Logout from '../admin/Logout.react'
import PrivateRoute from './PrivateRoute.react'
import AdminsList from '../admin/AdminsList.react'
import UsersList from '../admin/UsersList.react'
import RevealsList from '../admin/RevealsList.react'
import EmailsForm from '../admin/EmailsForm.react'
import PeriodsList from '../subscriptions/PeriodsList.react'
import PeriodDetail from '../subscriptions/PeriodDetail.react'
import JurorsList from '../jurors/JurorsList.react'
import JurorDetail from '../jurors/JurorDetail.react'
import JurorDraftsList from '../jurors/JurorDraftsList.react'
import JurorStakingList from '../jurors/JurorStakingList.react'
import JurorAccountingList from '../jurors/JurorAccountingList.react'
import DraftsList from '../drafts/DraftsList.react'
import DisputesList from '../disputes/DisputesList.react'
import DisputeDetail from '../disputes/DisputeDetail.react'
import ANJBalancesList from '../anj/ANJBalancesList.react'
import ANJTransfersList from '../anj/ANJTransfersList.react'
import AdminActions from '../../actions/admin'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { fetching: false, admin: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AdminActions.getCurrentAdmin())
  }

  render() {
    const { fetching, admin } = this.state
    return (
      <div ref="app">
        <Navbar admin={admin}/>
        <div className="main-container">
          <Error/>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/disputes/" exact component={DisputesList}/>
            <Route path="/dispute/:id" component={DisputeDetail}/>
            <Route path="/jurors/" exact component={JurorsList}/>
            <Route path="/jurors/:address/detail" component={JurorDetail}/>
            <Route path="/jurors/:address/drafts" component={JurorDraftsList}/>
            <Route path="/jurors/:address/staking" component={JurorStakingList}/>
            <Route path="/jurors/:address/accounting" component={JurorAccountingList}/>
            <Route path="/drafts/" component={DraftsList}/>
            <Route path="/periods/" component={PeriodsList}/>
            <Route path="/period/:id" component={PeriodDetail}/>
            <Route path="/anj-balances/" exact component={ANJBalancesList}/>
            <Route path="/anj-transfers/:address" component={ANJTransfersList}/>

            <Route path="/admin" exact render={
              props => admin.id
                ? <Redirect to={{ pathname: '/', state: { from: props.location } }}/>
                : React.createElement(Login, props)
              }
            />

            <PrivateRoute path="/logout" exact admin component={() => <Logout admin={admin}/>}/>
            <PrivateRoute path="/admins" exact admin component={AdminsList}/>
            <PrivateRoute path="/users" exact admin component={UsersList}/>
            <PrivateRoute path="/reveals" exact admin component={RevealsList}/>
            <PrivateRoute path="/emails" exact admin component={EmailsForm}/>
          </Switch>
        </div>
        <Modal open={fetching} progressBar message={fetching}/>
      </div>
    )
  }

  _onChange() {
    if(this.refs.app) {
      const { fetching, admin } = Store.getState()
      this.setState({ fetching, admin })
    }
  }
}

export default withRouter(App)
