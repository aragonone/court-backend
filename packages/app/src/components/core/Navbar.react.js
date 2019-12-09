import React from 'react'
import { Link } from 'react-router-dom'
import Account from '../account/Account.react'

const Navbar = () => (
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
    <div className="account">
      <Account/>
    </div>
  </nav>
)

export default Navbar
