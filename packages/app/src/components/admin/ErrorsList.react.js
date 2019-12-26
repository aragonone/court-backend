import React from 'react'
import Store from '../../store/store'
import AdminActions from '../../actions/admin'
import { Link } from 'react-router-dom'
import { summarize } from '../../helpers/summarize'

export default class ErrorsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { errors: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AdminActions.findErrors())
  }

  render() {
    const { errors } = this.state
    return (
      <div ref="errorsList">
        <h3>Errors</h3>
        { (!errors) ? <em>Loading...</em> : errors.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Context</th>
                <th>Message</th>
                <th>Stack</th>
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
    return this.state.errors.map((error, index) => {
      return (
        <tr key={index}>
          <td><Link to={`/errors/${error.id}`}><b>#{error.id}</b></Link></td>
          <td>{error.context}</td>
          <td>{summarize(error.message)}</td>
          <td>{summarize(error.stack)}</td>
          <td>{error.createdAt}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.errorsList) {
      const { admin: { errors } } = Store.getState()
      this.setState({ errors })
    }
  }
}
