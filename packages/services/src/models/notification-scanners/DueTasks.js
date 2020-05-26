import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import Network from '@aragonone/court-backend-server/build/web3/Network'
import dateFormat from 'dateformat'

class DueTasks extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const oneDayBeforeNow = Math.floor((Date.now()-this._DAYS)/1000)
    const threeDaysBeforeNow = Math.floor((Date.now()-(3*this._DAYS))/1000)
    const query = `
    {
      committingRounds: adjudicationRounds(where: {state: Committing, createdAt_lt: ${oneDayBeforeNow}}, orderBy: createdAt) {
        createdAt
        dispute {
          id
        }
        jurors (where: {commitment: null}) {
          juror {id}
        } 
      }
     	revealingRounds: adjudicationRounds(where: {stateInt_in: [1,2], createdAt_lt: ${threeDaysBeforeNow}}, orderBy: createdAt) {
        createdAt
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
    this._getTasks(jurorTasks, committingRounds, 'commit')
    this._getTasks(jurorTasks, revealingRounds, 'reveal')
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

  _getTasks(jurorTasks, adjudicationRounds, type) {
    for (const adjudicationRound of adjudicationRounds) {
      const {
        createdAt,
        dispute: { id: disputeId },
        jurors
      } = adjudicationRound
      const dueDate = this._dueDateString(createdAt, type)
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
  _dueDateString(createdAt, type) {
    const daysFromCreated = type == 'commit' ? 2 : 4
    const date = new Date((createdAt*1000)+(daysFromCreated*this._DAYS))
    return dateFormat(date, 'dddd, mmmm d, yyyy, h:MMtt Z', true)
  }

  get emailTemplateAlias() { return 'due-tasks' }
  get scanPeriod() { return this._DAYS }
}

export default new DueTasks()
