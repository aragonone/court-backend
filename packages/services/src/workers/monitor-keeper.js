import emailClient from '@1hive/celeste-backend-shared/helpers/email-client'
import Etherscan from '../models/Etherscan'
import Network from '@1hive/celeste-backend-server/build/web3/Network'
import { Admin, KeeperSuspiciousTransaction } from '@1hive/celeste-backend-server/build/models/objection'

import { fromWei } from 'web3-utils'
import { bigExp } from '@1hive/celeste-backend-shared/helpers/numbers'
import getWalletFromPk from '@1hive/celeste-backend-shared/helpers/get-wallet-from-pk'

const FROM = 'noreply@1hive.org'
const BALANCE_THRESHOLD = bigExp(1, 17) // 0.1 ETH

export default async function (ctx) {
  const { logger } = ctx
  const { environment: { network } } = Network
  const etherscan = new Etherscan(network, process.env.ETHERSCAN_API_KEY)
  const keeper = getWalletFromPk(process.env.PRIVATE_KEY).getAddressString()

  await monitorTransactions(logger, etherscan, keeper, network)
  await monitorEthBalance(logger, etherscan, keeper, network)
}

async function monitorTransactions(logger, etherscan, keeper, network) {
  const court = await Network.getCourt()
  const courtAddresses = await getWhitelistedAddresses(court)
  const lastInspectedBlockNumber = (await KeeperSuspiciousTransaction.lastInspectedBlockNumber()) + 1
  logger.info(`Checking transactions for keeper address ${keeper} from block ${lastInspectedBlockNumber}`)
  const transactions = await etherscan.getTransactionsFrom(keeper, lastInspectedBlockNumber)
  if (transactions.length === 0) return logger.info('No transactions found')

  try {
    for (const transaction of transactions) {
      const { hash, to, value, blockNumber } = transaction
      if (value !== '0' || !courtAddresses.includes(to)) {
        await KeeperSuspiciousTransaction.create({ blockNumber, txHash: hash })
        logger.warn(`Found suspicious transaction ${hash} on block ${blockNumber}`)
        await sendNotification(logger, buildSuspiciousTransactionMessage(keeper, transaction, network))
      } else {
        logger.info(`Found transaction ${hash} on block ${blockNumber}`)
      }
    }
  } catch (error) {
    logger.error('Failed to check transactions', error)
  }

  const { blockNumber } = transactions[0]
  const last = await KeeperSuspiciousTransaction.last()
  !last || !!last.txHash ? await KeeperSuspiciousTransaction.create({ blockNumber }) : await last.udpate({ blockNumber })
  logger.success(`Successfully checked transactions until block ${lastInspectedBlockNumber} successfully`)
}

async function monitorEthBalance(logger, etherscan, keeper, network) {
  logger.info(`Checking Hny balance for keeper address ${keeper}`)
  const balance = await etherscan.getBalance(keeper)
  if (balance.gt(BALANCE_THRESHOLD)) return logger.success(`Keeper balance is HNY ${fromWei(balance.toString())}`)
  logger.warn(`Keeper balance low HNY ${fromWei(balance.toString())}`)
  await sendNotification(logger, buildLowKeeperBalanceMessage(keeper, balance, network))
}

async function sendNotification(logger, message) {
  logger.info(`Sending email notifications for '${message.Subject}'`)
  message.From = FROM
  message.To = await Admin.findAllEmails()
  await emailClient.sendEmail(message)
}

function buildSuspiciousTransactionMessage(keeper, { to, value, blockNumber, hash }, network) {
  const message = {
    Subject: `[${network}] Suspicious transaction from keeper address ${keeper}`,
    TextBody: `
      A transaction from keeper address ${keeper} has been found in block #${blockNumber}.
      Recipient: ${to}
      HNY value: ${fromWei(value)}
      You can check it here: https://etherscan.io/tx/${hash}`
  }

  if (value != '0') message.Subject = `(⚠️ HNY!) ${message.Subject}`
  return message
}

function buildLowKeeperBalanceMessage(keeper, balance, network) {
  return {
    Subject: `[${network}] Low HNY balance in keeper address ${keeper}`,
    TextBody: `Keeper address ${keeper} has HNY ${fromWei(balance.toString())} balance below ${fromWei(BALANCE_THRESHOLD.toString())} threshold.`
  }
}

async function getWhitelistedAddresses(court) {
  const addresses = []
  addresses.push(court.instance.address)                  // Controller
  addresses.push((await court.disputeManager()).address)  // Dispute Manager
  addresses.push((await court.voting()).address)          // Voting
  addresses.push((await court.subscriptions()).address)   // Subscriptions
  return addresses.map(a => a.toLowerCase())
}
