import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragonone/celeste-backend-server/build/web3/Network'
import { draftTermIdFor } from '../../helpers/term-id-getter'

class MissedReveal extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const termId = await draftTermIdFor('appealing')
    const query = `
    {
      adjudicationRounds(where: {stateInt_in: [1,2,3], draftedTermId_lte: ${termId}}, orderBy: createdAt) {
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
              disputeId,
              disputeUrl: this.disputeUrl(disputeId),
              lockedAnjBalanceUrl: this.dashboardUrl
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
