import React from 'react'
import Store from '../../store/store'
import { toDate } from '../../helpers/toDate'
import { summarize } from '../../helpers/summarize'
import JurorsActions from '../../actions/jurors'

export default class JurorStakingList extends React.Component {
  constructor(props){
    super(props)
    this.state = { address: this.props.match.params.address, staking: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(JurorsActions.findStaking(this.state.address))
  }

  render() {
    const { address, staking } = this.state
    return (
      <div ref="jurorStakingList">
        <h3>Staking of Juror {address}</h3>
        { (!staking) ? <em>Loading...</em> : staking.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Effective term ID</th>
              <th>When</th>
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
    return this.state.staking.map((movement, index) => {
      return (
        <tr key={index}>
          <td>{summarize(movement.id)}</td>
          <td>{movement.type}</td>
          <td>{movement.amount}</td>
          <td>{movement.effectiveTermId || 'immediate'}</td>
          <td>{toDate(movement.createdAt)}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.jurorStakingList) {
      const { jurorStaking } = Store.getState().jurors
      this.setState({ staking: jurorStaking })
    }
  }
}
