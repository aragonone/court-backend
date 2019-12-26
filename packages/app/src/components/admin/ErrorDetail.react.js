import React from 'react'
import Store from '../../store/store'
import AdminActions from '../../actions/admin'

export default class ErrorDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = { id: this.props.match.params.id, error: { } }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AdminActions.findError(this.state.id))
  }

  render() {
    const { id, error } = this.state
    return (
      <div ref="errorDetail">
        <h3>Error #{id}</h3>
          { !error.context ? 'Loading...' :
            <div>
              <p><b>Created at:</b> {error.createdAt}</p>
              <p><b>Context:</b> {error.context}</p>
              <p><b>Message</b></p>
              <pre>{error.message}</pre>
              <p><b>Stack trace</b></p>
              <pre>{error.stack}</pre>
            </div>
          }
      </div>
    )
  }

  _onChange() {
    if(this.refs.errorDetail) {
      const { admin: { error } } = Store.getState()
      this.setState({ error })
    }
  }
}
