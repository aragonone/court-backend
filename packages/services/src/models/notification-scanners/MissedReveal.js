import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragonone/court-backend-server/build/web3/Network'

class MissedReveal extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const fourDaysBeforeNow = Math.floor((Date.now()-(4*this._DAYS))/1000)
    const query = `
    {
      adjudicationRounds(where: {stateInt_in: [1,2,3,4], createdAt_gt: ${fourDaysBeforeNow}}, orderBy: createdAt) {
        id
        dispute {
          id
        }
        jurors (where: {commitment_not: null, revealDate: null}) {
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
              lockedAnjBalanceUrl: 'test',
              learnMoreUrl: 'test',
            },
            adjudicationRoundId
          }
        })
      }
    }
    return notifications
  }
  get emailTemplateAlias() { return 'missed-reveal' }
  get scanPeriod() { return this._MINUTES }
}

export default new MissedReveal()
