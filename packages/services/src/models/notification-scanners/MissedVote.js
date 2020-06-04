import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragonone/court-backend-server/build/web3/Network'
import { draftTermIdFor } from '../../helpers/term-id-getter'

class MissedVote extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const termId = await draftTermIdFor('revealing')
    const query = `
    {
      adjudicationRounds(where: {stateInt_in: [1,2], draftTermId_lte: ${termId}}, orderBy: createdAt) {
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
              disputeId,
              disputeUrl: `${this._CLIENT_URL}disputes/${disputeId}`,
              lockedAnjBalanceUrl: `${this._CLIENT_URL}dashboard`
            },
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
