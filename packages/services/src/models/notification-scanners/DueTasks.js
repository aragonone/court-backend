import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragonone/court-backend-server/build/web3/Network'
import { draftTermIdFor, dueDateFor } from '../../helpers/term-id-getter'
import dateFormat from 'dateformat'

class DueTasks extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const committingTermId = await draftTermIdFor('commit-reminder')
    const revealingTermId = await draftTermIdFor('reveal-reminder')
    const query = `
    {
      committingRounds: adjudicationRounds(where: {state: Committing, draftedTermId_lte: ${committingTermId}}, orderBy: createdAt) {
        draftedTermId
        dispute {
          id
        }
        jurors (where: {commitment: null}) {
          juror {id}
        } 
      }
     	revealingRounds: adjudicationRounds(where: {stateInt_in: [1,2], draftedTermId_lte: ${revealingTermId}}, orderBy: createdAt) {
        draftedTermId
        dispute {
          id
        }
        jurors (where: {commitment_not: null, revealDate: null}) {
          juror {id}
        } 
      }
    }
    `
    const { committingRounds, revealingRounds } = await Network.query(query)
    let jurorTasks = {}
    await this._getTasks(jurorTasks, committingRounds, 'commit')
    await this._getTasks(jurorTasks, revealingRounds, 'reveal')
    for (const [address, tasks] of Object.entries(jurorTasks)) {
      notifications.push({
        address,
        details: {
          emailTemplateModel: {tasks}
        }
      })
    }
    return notifications
  }

  async _getTasks(jurorTasks, adjudicationRounds, type) {
    for (const adjudicationRound of adjudicationRounds) {
      const {
        draftedTermId,
        dispute: { id: disputeId },
        jurors
      } = adjudicationRound
      const dueDate = await this._dueDateString(draftedTermId, type)
      for (const juror of jurors) {
        const address = juror.juror.id
        if (!jurorTasks[address]) jurorTasks[address] = []
        jurorTasks[address].push({
          name: type == 'commit' ? 'Commit vote' : 'Reveal vote',
          disputeId,
          disputeUrl: `${this._CLIENT_URL}disputes/${disputeId}`,
          dueDate
        })
      }
    }
  }

  // Format: Monday, May 25, 2020, 7:36 PM UTC
  async _dueDateString(draftTermId, type) {
    const dueDateSeconds = await dueDateFor(draftTermId, type)
    const date = new Date(dueDateSeconds*1000)
    return dateFormat(date, 'dddd, mmmm d, yyyy, h:MMtt Z', true)
  }

  get emailTemplateAlias() { return 'due-tasks' }
  get scanPeriod() { return this._MINUTES }
}

export default new DueTasks()
