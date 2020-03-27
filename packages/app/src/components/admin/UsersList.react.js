import React from 'react'
import Store from '../../store/store'
import AdminActions from '../../actions/admin'

export default class UsersList extends React.Component {
  constructor(props){
    super(props)
    this.state = { users: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AdminActions.findUsers())
  }

  render() {
    const { users } = this.state
    return (
      <div ref="usersList">
        <h3>Users</h3>
        { (!users) ? <em>Loading...</em> : users.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Addresses</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {this._buildList()}
            </tbody>
          </table>
        }
      </div>
    )
  }

  _buildList() {
    return this.state.users.map((user, index) => {
      return (
        <tr key={index}>
          <td>{user.id}</td>
          <td>{user.email}</td>
          <td>{user.addresses.map(userAddress => userAddress.address).join(', ')}</td>
          <td>{user.createdAt}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.usersList) {
      const { admin: { users } } = Store.getState()
      this.setState({ users })
    }
  }
}
