import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragonone/court-backend-server/build/web3/Network'
const OUTCOMES = {
  0: 'Missing',
  1: 'Leaked',
  2: 'Refused',
  3: 'Against',
  4: 'InFavor',
}

class DisputeRuled extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const twoDaysBeforeNow = Math.floor((Date.now()-(2*this._DAYS))/1000)
    const query = `
    {
      disputes(where: {ruledAt_gt: ${twoDaysBeforeNow}}, orderBy: createdAt) {
        id
        finalRuling
        jurors {
          juror {id}
        }
      }
    }
    `
    const { disputes } = await Network.query(query)
    for (const dispute of disputes) {
      const { 
        id: disputeId,
        finalRuling,
        jurors
      } = dispute
      for (const juror of jurors) {
        notifications.push({ 
          address: juror.juror.id,
          details: {
            emailTemplateModel: {
              disputeId,
              disputeUrl: `${this._CLIENT_URL}disputes/${disputeId}`,
              disputeResult: OUTCOMES[finalRuling]
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
