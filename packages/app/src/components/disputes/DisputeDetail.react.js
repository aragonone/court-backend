import React from 'react'
import Store from '../../store/store'
import DisputeActions from '../../actions/disputes'

export default class DisputeDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = { id: this.props.match.params.id, dispute: { } }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(DisputeActions.find(this.state.id))
  }

  render() {
    const { id, dispute } = this.state
    return (
      <div ref="disputeDetail">
        <h3>Dispute #{id}</h3>
      </div>
    )
  }

  _onChange() {
    if(this.refs.disputeDetail) {
      const { current } = Store.getState().disputes
      this.setState({ dispute: current })
    }
  }
}
