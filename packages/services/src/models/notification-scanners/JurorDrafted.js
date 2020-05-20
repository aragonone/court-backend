import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragonone/court-backend-server/build/web3/Network'

class JurorDrafted extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const query = `
    {
      adjudicationRounds(where: {state: Committing}, orderBy: createdAt) {
        jurors {
          id
          juror {id}
        } 
      }
    }
    `
    const { adjudicationRounds } = await Network.query(query)
    for (const adjudicationRound of adjudicationRounds) {
      const { jurors } = adjudicationRound
      for (const juror of jurors) {
        notifications.push({ 
          address: juror.juror.id,
          details: {
            emailTemplateModel: {
              disputeId: juror.id,
              disputeUrl: `${this._CLIENT_URL}`
            }
          }
        })
      }
    }
    return notifications
  }
  get emailTemplateAlias() { return 'drafted' }
  get scanPeriod() { return this._MINUTES }
}

export default new JurorDrafted()
