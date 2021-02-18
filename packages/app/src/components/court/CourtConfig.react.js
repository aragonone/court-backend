import React from 'react'
import Store from '../../store/store'
import Network from '../../web3/Network'
import CourtActions from '../../actions/court'
import { fromWei } from 'web3-utils'
import { bn } from '@aragonone/celeste-backend-shared/helpers/numbers'

export default class CourtConfig extends React.Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(CourtActions.findConfig())
  }

  render() {

    return (
      <div ref="courtConfig" className="config">
        <h3>Config</h3>
        <p>Network: {Network.getNetworkName()}</p>
        { (!this.state.termDuration) ? 'Loading...' : this._renderConfig() }
      </div>
    )
  }

  _renderConfig() {
    const {
      address,
      currentTerm,
      termDuration,
      neededTransitions,
      anjToken,
      feeToken,
      jurorFee,
      draftFee,
      settleFee,
      evidenceTerms,
      commitTerms,
      revealTerms,
      appealTerms,
      appealConfirmationTerms,
      penaltyPct,
      finalRoundReduction,
      firstRoundJurorsNumber,
      appealStepFactor,
      maxRegularAppealRounds,
      finalRoundLockTerms,
      appealCollateralFactor,
      appealConfirmCollateralFactor,
      minActiveBalance,
      fundsGovernor,
      configGovernor,
      modulesGovernor,
      modules,
      subscriptions
    } = this.state

    return (
      <div>
        <p>Court: {address}</p>
        <p>Term duration: {bn(termDuration).div(bn(60)).toString()} minutes</p>
        <p>Current term: #{currentTerm}</p>
        <p>Needed transitions: {neededTransitions.toString()} (<a onClick={() => this._heartbeat()} href="#">heartbeat</a>)</p>

        <h3>Governor</h3>
        <p>Funds governor: {fundsGovernor}</p>
        <p>Config governor: {configGovernor}</p>
        <p>Modules governor: {modulesGovernor}</p>

        <h3>Registry</h3>
        <p>ANJ token: {anjToken.id}</p>
        <p>Min active balance: {fromWei(minActiveBalance.toString())}</p>

        <h3>Disputes</h3>
        <p>Fee token: {feeToken.id}</p>
        <p>Juror fee: {fromWei(jurorFee.toString())}</p>
        <p>Draft fee: {fromWei(draftFee.toString())}</p>
        <p>Settle fee: {fromWei(settleFee.toString())}</p>
        <p>Evidence terms: {evidenceTerms}</p>
        <p>Commit terms: {commitTerms}</p>
        <p>Reveal terms: {revealTerms}</p>
        <p>Appeal terms: {appealTerms}</p>
        <p>Appeal confirmation terms: {appealConfirmationTerms}</p>
        <p>Penalty permyriad: ‱ {penaltyPct} (1/10,000)</p>
        <p>Final round reduction: ‱ {finalRoundReduction} (1/10,000)</p>
        <p>First round jurors number: {firstRoundJurorsNumber}</p>
        <p>Appeal step factor: {appealStepFactor}</p>
        <p>Max regular appeal rounds: {maxRegularAppealRounds}</p>
        <p>Final round lock terms: {finalRoundLockTerms}</p>
        <p>Appeal collateral factor: ‱ {appealCollateralFactor} (1/10,000)</p>
        <p>Appeal confirmation collateral factor: ‱ {appealConfirmCollateralFactor} (1/10,000)</p>

        <h3>Subscriptions</h3>
        <p>Current period: {subscriptions.currentPeriod}</p>
        <p>Period duration: {subscriptions.periodDuration} court terms</p>
        <p>Fee token: {subscriptions.feeToken}</p>

        <h3>Modules</h3>
          {modules.map((module, index) => {
            let subdomain = Network.getNetworkName()
            if (subdomain === 'mainnet') subdomain = 'www'
            if (subdomain === 'staging') subdomain = 'rinkeby'
            const url = `https://${subdomain}.etherscan.io/address/`
            return <p key={index}>{module.type}: <a href={`${url}${module.address}`} target="blank">{module.address}</a> <br/>ID {module.id}</p>
          })}
      </div>
    )
  }

  _heartbeat() {
    Store.dispatch(CourtActions.heartbeat())
  }

  _onChange() {
    if(this.refs.courtConfig) {
      const { config } = Store.getState().court
      this.setState({ ...config })
    }
  }
}
