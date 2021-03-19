import Etherscan from '../models/Etherscan'
import { DAYS } from '@1hive/celeste-backend-shared/helpers/times'
import getWalletFromPk from '@1hive/celeste-backend-shared/helpers/get-wallet-from-pk'
import abi from 'web3-eth-abi'

const TRANSACTION_TYPES = [
  {
    type: 'reveal',
    signature: 'reveal(uint256,address,uint8,bytes32)',
  },
  {
    type: 'settleReward',
    signature: 'settleReward(uint256,uint256,address)',
  },
  {
    type: 'settlePenalties',
    signature: 'settlePenalties(uint256,uint256,uint256)',
  },
  {
    type: 'rule',
    signature: 'rule(uint256)',
  },
  {
    type: 'heartbeat',
    signature: 'heartbeat(uint64)',
  }
]
const COUNT_PERIOD = 1 * DAYS
const etherscan = new Etherscan()
const KEEPER_ADDRESS = getWalletFromPk(process.env.PRIVATE_KEY).getAddressString()

export default async function (ctx) {
  const { logger, metrics } = ctx
  const transactions = await etherscan.getTransactionsFrom(KEEPER_ADDRESS)
  const transactionsRecent = transactions.filter(({ timeStamp }) => Number(timeStamp)*1000 > Date.now() - COUNT_PERIOD)
  const errorCounts = getErrorCounts(transactionsRecent)
  showMetrics(metrics, errorCounts)
  logger.success(`Contract metrics updated.`)
}

function getErrorCounts(transactions) {
  let errorCountsZero = {} // set initial metric to 0
  TRANSACTION_TYPES.forEach(({ type }) => errorCountsZero[type] = 0)
  return transactions.reduce((errorCounts, tx) => {
    const { isError, input } = tx
    if (Number(isError)) {
      TRANSACTION_TYPES.forEach(({ type, signature }) => {
        if (input.includes(abi.encodeFunctionSignature(signature))) {
          errorCounts[type] ++
        }
      })
    }
    return errorCounts
  }, errorCountsZero)
}

function showMetrics(metrics, errorCounts) {
  Object.entries(errorCounts).forEach(([type, count]) => {
    metrics.transactionErrors(type, count)
  })
}
