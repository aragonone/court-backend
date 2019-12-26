import React from 'react'
import Store from '../../store/store'
import AdminActions from '../../actions/admin'
import { withRouter } from 'react-router-dom'

class Logout extends React.Component {
  componentDidMount() {
    Store.dispatch(AdminActions.logout())
    this.props.history.push('/')
  }

  render() {
    return ''
  }
}

export default withRouter(Logout)
