import React from 'react'
import Store from '../../store/store'
import { Link } from 'react-router-dom'
import { toDate } from '../../helpers/toDate'
import { fromWei } from 'web3-utils'
import JurorsActions from '../../actions/jurors'

export default class JurorDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = { address: this.props.match.params.address, juror: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(JurorsActions.find(this.state.address))
  }

  render() {
    const { address, juror } = this.state
    return (
      <div ref="jurorDetail">
        <h3>Juror #{address}</h3>
          { !juror.id ? 'Loading...' :
            <div>
              <p>Id: {juror.treeId}</p>
              <p>Active HNY: {fromWei(juror.activeBalance)}</p>
              <p>Locked HNY: {fromWei(juror.lockedBalance)}</p>
              <p>Staked HNY: {fromWei(juror.availableBalance)}</p>
              <p>Deactivating HNY: {fromWei(juror.deactivationBalance)}</p>
              <p>Withdrawals lock term ID: {juror.withdrawalsLockTermId}</p>
              <p>Created at: {toDate(juror.createdAt)}</p>
              <p>See <Link to={`/jurors/${address}/drafts`}>drafts</Link></p>
              <p>See <Link to={`/jurors/${address}/staking`}>staking</Link></p>
              <p>See <Link to={`/jurors/${address}/accounting`}>accounting</Link></p>
            </div>
          }
      </div>
    )
  }

  _onChange() {
    if(this.refs.jurorDetail) {
      const { current } = Store.getState().jurors
      this.setState({ juror: current })
    }
  }
}
