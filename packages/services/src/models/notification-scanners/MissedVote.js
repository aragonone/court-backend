import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragonone/court-backend-server/build/web3/Network'

class MissedVote extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const twoDaysBeforeNow = Math.floor((Date.now()-(2*this._DAYS))/1000)
    const query = `
    {
      adjudicationRounds(where: {stateInt_in: [1,2], createdAt_lt: ${twoDaysBeforeNow}}, orderBy: createdAt) {
        id
        dispute {
          id
        }
        jurors (where: {commitment: null}) {
          juror {id}
        } 
      }
    }
    `
    const { adjudicationRounds } = await Network.query(query)
    for (const adjudicationRound of adjudicationRounds) {
      const { 
        id: adjudicationRoundId,
        dispute: { id: disputeId },
        jurors
      } = adjudicationRound
      for (const juror of jurors) {
        notifications.push({ 
          address: juror.juror.id,
          details: {
            emailTemplateModel: {
              lockedAnjBalanceUrl: `${this._CLIENT_URL}dashboard`
            },
            disputeId,
            adjudicationRoundId
          }
        })
      }
    }
    return notifications
  }
  get emailTemplateAlias() { return 'missed-vote' }
  get scanPeriod() { return this._MINUTES }
}

export default new MissedVote()
