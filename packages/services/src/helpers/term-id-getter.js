import Network from '@aragonone/court-backend-server/build/web3/Network'
import { bn } from '@aragonone/court-backend-shared/helpers/numbers'

async function draftTermIdFor(state) {
  const court = await Network.getCourt()
  const currentTerm = await court.currentTermId()
  const { roundDurations: { commitTerms, revealTerms } } = await court.getConfigAt()
  if (state == 'revealing') {
    return currentTerm.sub(commitTerms)
  }
  if (state == 'appealing') {
    return currentTerm.sub(commitTerms).sub(revealTerms) 
  }
  if (state == 'commit-reminder') {
    return currentTerm.sub(commitTerms.add(bn(1)).div(bn(2)))
  }
  if (state == 'reveal-reminder') {
    return currentTerm.sub(commitTerms).sub(revealTerms.add(bn(1)).div(bn(2)))
  }
}

async function dueDateFor(draftTermId, type) {
  const court = await Network.getCourt()
  const { roundDurations: { commitTerms, revealTerms } } = await court.getConfigAt()
  draftTermId = bn(parseInt(draftTermId))
  let terms
  if (type == 'commit') {
    terms = commitTerms.add(draftTermId).sub(bn(1))
  }
  else if (type == 'reveal') {
    terms = commitTerms.add(revealTerms).add(draftTermId).sub(bn(1))
  }
  const startTime = await court.startTime()
  const termDuration = await court.termDuration()
  const dueDateSeconds = termDuration.mul(terms).add(startTime)
  return dueDateSeconds
}

export { draftTermIdFor, dueDateFor }
