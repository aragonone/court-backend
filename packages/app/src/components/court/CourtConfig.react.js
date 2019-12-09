import React from 'react'
import Store from '../../store/store'
import CourtActions from '../../actions/court'
import { fromWei } from 'web3-utils'
import { bn } from '@aragon/court-backend-shared/helpers/numbers'

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
        { (!this.state.termDuration) ? 'Loading...' : this._renderConfig() }
      </div>
    )
  }

  _renderConfig() {
    const {
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
      modules
    } = this.state

    return (
      <div>
        <p>Term duration: {bn(termDuration).div(bn(60)).toString()} minutes</p>
        <p>Current term: #{currentTerm}</p>
        <p>Needed transitions: {neededTransitions.toString()}</p>
        <p>ANJ token: {anjToken.id}</p>
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
        <p>Min active balance: {fromWei(minActiveBalance.toString())}</p>
        <p>Funds governor: {fundsGovernor}</p>
        <p>Config governor: {configGovernor}</p>
        <p>Modules governor: {modulesGovernor}</p>
        <p>Modules: </p>
        <ul>
          {modules.map((module, index) => <li key={index}>{module.id}: {module.address}</li>)}
        </ul>
      </div>
    )
  }

  _onChange() {
    if(this.refs.courtConfig) {
      const { config } = Store.getState().court
      this.setState({ ...config })
    }
  }
}
