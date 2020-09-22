import React from 'react'
import { Link } from 'react-router-dom'
import Account from '../account/Account.react'

export default class Navbar extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return { admin: nextProps.admin }
  }

  constructor(props){
    super(props)
    this.state = { admin: this.props.admin }
  }

  render() {
    const { admin } = this.state
    return (
      <nav>
        <div className="logo">
          <Link to="/">Aragon Court</Link>
        </div>
        <div className="links">
          <Link to="/disputes">Disputes</Link>
          <Link to="/jurors">Jurors</Link>
          <Link to="/drafts">Drafts</Link>
          <Link to="/periods">Periods</Link>
          <Link to="/anj-balances">ANJ</Link>
          { admin.id && this._buildLoggedInItems() }
        </div>
        <div className="account">
          <Account admin={admin}/>
        </div>
      </nav>
    )
  }

  _buildLoggedInItems() {
    return [
      <Link to="/admins" key="admins">Admins</Link>,
      <Link to="/users" key="users">Users</Link>,
      <Link to="/reveals" key="reveals">Reveals</Link>,
      <Link to="/emails" key="emails">Emails</Link>,
      <Link to="/logout" key="logout">Logout</Link>,
    ]
  }
}
