const { bn } = require('./numbers')
const { soliditySha3 } = require('web3-utils')

const hashVote = (outcome, salt = SALT) => {
  return soliditySha3({ t: 'uint8', v: outcome }, { t: 'bytes32', v: salt })
}

const encodeVoteId = (disputeId, roundId) => {
  return bn(2).pow(bn(128)).mul(bn(disputeId)).add(bn(roundId))
}

const decodeVoteId = (voteId) => {
  const mask = bn(2).pow(bn(128))
  const disputeId = bn(voteId).div(mask)
  const roundId = bn(voteId).sub(disputeId.mul(mask))
  return { disputeId, roundId }
}

module.exports = {
  hashVote,
  encodeVoteId,
  decodeVoteId,
}
