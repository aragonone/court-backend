import React from 'react'
import Store from '../../store/store'
import ErrorActions from "../../actions/errors"

export default class Error extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null }
    this._cleanError = this._cleanError.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
  }

  render() {
    const error = this.state.error
    return !error ? <div ref="error"/> :
      <div ref="error" className="error">
        <p>{error} <span className="close" onClick={this._cleanError}>x</span></p>
      </div>
  }

  _cleanError(e) {
    e.preventDefault()
    this.setState({ error: null })
    Store.dispatch(ErrorActions.reset())
  }

  _onChange() {
    if(this.refs.error) {
      const { error } = Store.getState()
      this.setState({ error })
    }
  }
}
