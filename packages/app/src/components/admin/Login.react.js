import React from 'react'
import Store from '../../store/store'
import AdminActions from '../../actions/admin'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { email: '', password: '' }
  }

  render() {
    return (
      <div ref="login">
        <form onSubmit={this._login} style={{width: '20%', marginLeft: '40%'}}>
          <h3>Admin</h3>
          <div style={{paddingTop: '10px'}}>
            <input id="email" onChange={this._updateEmail} type="email" placeholder="Email" required style={{width: '97%'}}/>
          </div>
          <div style={{paddingTop: '10px'}}>
            <input id="password" onChange={this._updatePassword} type="password" placeholder="Password" required style={{width: '97%'}}/>
          </div>
          <div style={{textAlign: 'right', paddingTop: '10px'}}>
            <button>Login</button>
          </div>
        </form>
      </div>
    )
  }

  _updateEmail = e => {
    e.preventDefault()
    this.setState({ email: e.target.value })
  }

  _updatePassword = e => {
    e.preventDefault()
    this.setState({ password: e.target.value })
  }

  _login = e => {
    e.preventDefault()
    Store.dispatch(AdminActions.login(this.state.email, this.state.password))
  }
}
