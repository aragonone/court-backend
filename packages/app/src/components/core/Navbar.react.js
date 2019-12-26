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
          <Link to="/anj-balances">ANJ</Link>
        </div>
        { admin.id ? this._buildLoggedInItems() : '' }
        <div className="account">
          <Account admin={admin}/>
        </div>
      </nav>
    )
  }

  _buildLoggedInItems() {
    return (
      <div className="admin-links">
        <Link to="/admins">Admins</Link>
        <Link to="/reveals">Reveals</Link>
        <Link to="/settlements">Settlements</Link>
        <Link to="/errors">Errors</Link>
        <Link to="/logout">Logout</Link>
      </div>
    )
  }
}
