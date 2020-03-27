import { ServerClient } from 'postmark'
import Etherscan from '../models/Etherscan'
import Models from '@aragonone/court-backend-server/build/models'
import Network from '@aragonone/court-backend-server/build/web3/Network'

import { fromWei } from 'web3-utils'
import { bigExp } from '@aragonone/court-backend-shared/helpers/numbers'
import getWalletFromPk from '@aragonone/court-backend-shared/helpers/get-wallet-from-pk'

const FROM = 'noreply@aragon.one'
const BALANCE_THRESHOLD = bigExp(1, 17) // 0.1 ETH

const { Admin, KeeperSuspiciousTransaction } = Models

export default async function (logger) {
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
      logger.info(`Found transaction ${hash} on block ${blockNumber}`)
      if (value !== '0' || !courtAddresses.includes(to)) {
        await KeeperSuspiciousTransaction.create({ blockNumber, txHash: hash })
        logger.warn(`Found suspicious transaction ${hash} on block ${blockNumber}`)
        await sendNotification(logger, buildSuspiciousTransactionMessage(keeper, transaction, network))
      }
    }
  } catch (error) {
    logger.error('Failed to check transactions', error)
  }

  const { blockNumber } = transactions[0]
  const last = await KeeperSuspiciousTransaction.last()
  !last || !!last.txHash ? await KeeperSuspiciousTransaction.create({ blockNumber }) : await last.udpate({ blockNumber })
  logger.success(`Checked transactions until block ${lastInspectedBlockNumber} successfully`)
}

async function monitorEthBalance(logger, etherscan, keeper, network) {
  logger.info(`Checking Eth balance for keeper address ${keeper}`)
  const balance = await etherscan.getBalance(keeper)
  if (balance.gt(BALANCE_THRESHOLD)) return logger.success(`Keeper balance is ETH ${fromWei(balance.toString())}`)
  logger.warn(`Keeper balance low ETH ${fromWei(balance.toString())}`)
  await sendNotification(logger, buildLowKeeperBalanceMessage(keeper, balance, network))
}

async function sendNotification(logger, message) {
  logger.info(`Sending email notifications for '${message.Subject}'`)
  message.From = FROM
  message.To = (await Admin.allEmails()).join(', ')
  const client = new ServerClient(process.env.POSTMARK_TOKEN)
  const response = await client.sendEmail(message)
  if (!response || response.ErrorCode != 0) logger.error(`Failed to send notification, received response: ${JSON.stringify(response)}`)
}

function buildSuspiciousTransactionMessage(keeper, { to, value, blockNumber, hash }, network) {
  const message = {
    Subject: `[${network}] Suspicious transaction from keeper address ${keeper}`,
    TextBody: `
      A transaction from keeper address ${keeper} has been found in block #${blockNumber}.
      Recipient: ${to}
      Eth value: ${fromWei(value)}
      You can check it here: https://etherscan.io/tx/${hash}`
  }

  if (value != '0') message.Subject = `(⚠️ ETH!) ${message.Subject}`
  return message
}

function buildLowKeeperBalanceMessage(keeper, balance, network) {
  return {
    Subject: `[${network}] Low Eth balance in keeper address ${keeper}`,
    TextBody: `Keeper address ${keeper} has Eth ${fromWei(balance.toString())} balance below ${fromWei(BALANCE_THRESHOLD.toString())} threshold.`
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
