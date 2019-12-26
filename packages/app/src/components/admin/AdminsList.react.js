import React from 'react'
import Store from '../../store/store'
import AdminActions from '../../actions/admin'

export default class AdminsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { admins: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AdminActions.findAdmins())
  }

  render() {
    const { admins } = this.state
    return (
      <div ref="adminsList">
        <h3>Admins</h3>
        { (!admins) ? <em>Loading...</em> : admins.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
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
    return this.state.admins.map((admin, index) => {
      return (
        <tr key={index}>
          <td>{admin.id}</td>
          <td>{admin.email}</td>
          <td>{admin.createdAt}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.adminsList) {
      const { admin: { admins } } = Store.getState()
      this.setState({ admins })
    }
  }
}
