import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragonone/court-backend-server/build/web3/Network'

class AppealsOpened extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const fourDaysBeforeNow = Math.floor((Date.now()-(4*this._DAYS))/1000)
    const query = `
    {
      adjudicationRounds(where: {stateInt_in: [1,2,3], createdAt_lt: ${fourDaysBeforeNow}}, orderBy: createdAt) {
        id
        dispute {
          id
        }
        jurors {
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
              disputeId,
              disputeUrl: `${this._CLIENT_URL}disputes/${disputeId}`
            },
            adjudicationRoundId
          }
        })
      }
    }
    return notifications
  }
  get emailTemplateAlias() { return 'appeals-opened' }
  get scanPeriod() { return this._MINUTES }
}

export default new AppealsOpened()
