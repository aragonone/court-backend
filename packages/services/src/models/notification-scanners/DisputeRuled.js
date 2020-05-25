import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragonone/court-backend-server/build/web3/Network'

class DisputeRuled extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const nineDaysBeforeNow = Math.floor((Date.now()-(9*this._DAYS))/1000)
    const query = `
    {
      adjudicationRounds(where: {state: Ended, createdAt_gt: ${nineDaysBeforeNow}}, orderBy: createdAt) {
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
        dispute: { id: disputeId },
        jurors
      } = adjudicationRound
      for (const juror of jurors) {
        notifications.push({ 
          address: juror.juror.id,
          details: {
            emailTemplateModel: {
              disputeId,
              disputeUrl: `${this._CLIENT_URL}disputes/${disputeId}`,
              disputeResult: 'Allowed'      // how do I get this result? I only see finalRuling which is an integer
            },
          }
        })
      }
    }
    return notifications
  }
  get emailTemplateAlias() { return 'ruled' }
  get scanPeriod() { return this._MINUTES }
}

export default new DisputeRuled()
