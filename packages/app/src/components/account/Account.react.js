import React from 'react'
import Store from '../../store/store'
import AccountActions from '../../actions/accounts'

export default class Account extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return { admin: nextProps.admin }
  }

  constructor(props) {
    super(props)
    this.state = { address: '', admin: this.props.admin }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AccountActions.findCurrent())
  }

  render() {
    const { address, admin } = this.state
    return (
      <p ref="account">{address}<br/>{ admin.id ? admin.email : ''}</p>
    )
  }

  _onChange() {
    if(this.refs.account) {
      const { address } = Store.getState().account
      this.setState({ address })
    }
  }
}
