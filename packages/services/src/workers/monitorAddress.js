const utils = require('ethereumjs-util')
const postmark = require('postmark')

import Network from '@aragon/court-backend-server/build/web3/Network'

// Postmark API endpoint
const POSTMARK_URL = 'https://api.postmarkapp.com/email'
const FROM = 'noreply@aragon.one'
const SUBJECT = `Found transaction from address `

// number of blocks checked backwards first time
const BLOCKS_BACKWARDS_INITIAL_THRESHOLD = 10
let lastCheckedBlockNumber = 0

export default async function (worker, job, logger) {
  try {
    const court = await Network.getCourt()
    const web3 = await court.environment.getWeb3()

    if (lastCheckedBlockNumber == 0) {
      lastCheckedBlockNumber = await getLastBlockNumber(web3) - BLOCKS_BACKWARDS_INITIAL_THRESHOLD
    }
    const address = getAddress()
    lastCheckedBlockNumber = await monitor(logger, web3, court, address, lastCheckedBlockNumber)
  } catch (error) {
    console.error({ context: `Worker '${worker}' job #${job}`, message: error.message, stack: error.stack })
    throw error
  }
}

async function monitor(logger, web3, court, address, lastCheckedBlockNumber) {
  const currentBlockNumber = await getLastBlockNumber(web3)

  try {
    logger.info(`Checking transactions for address ${address} from block ${lastCheckedBlockNumber + 1}  to ${currentBlockNumber}`)

    const courtAddresses = await getWhitelistedAddresses(court)

    for (let i = lastCheckedBlockNumber + 1; i <= currentBlockNumber; i++) {
      await checkTransactions(logger, web3, courtAddresses, i, address)
    }

    logger.success(`Checked ${currentBlockNumber - lastCheckedBlockNumber} blocks`)
  } catch (error) {
    logger.error('Failed to check transactions')
    console.error(error)
  }

  return currentBlockNumber
}

async function checkTransactions(logger, web3, courtAddresses, blockNumber, address) {
  const block = await web3.eth.getBlock(blockNumber)
  logger.info(`Checking transactions of block ${blockNumber}`)
  if (block && block.transactions) {
    for (let transactionHash of block.transactions) {
      //logger.info(`Checking transaction ${transactionHash}`)
      const transaction = await web3.eth.getTransaction(transactionHash)
      if (address.toLowerCase() === transaction.from.toLowerCase()) {
        logger.info(`Found transaction ${transactionHash} on block ${blockNumber}`)
        if (transaction.value != '0' || !courtAddresses.includes(transaction.to.toLowerCase())) {
          await sendNotification(logger, transaction)
        }
      }
    }
  }
}

async function sendNotification(logger, transaction) {
  const addresses = process.env.NOTIFICATION_ADDRESSES.split(',')
  const client = new postmark.Client(process.env.POSTMARK_TOKEN)

  for (let address of addresses) {
    logger.info(`Sending e-mail notification to ${address}`)
    const message = getMessage(transaction, address)
    const response = await client.sendEmail(message)
    if(!response || response.ErrorCode != 0) {
      logger.error('Failed to send notification')
      logger.error(response)
    }
  }
}

function getMessage(transaction, to) {
  const message = {}
  message.From = FROM
  message.To = to
  message.Subject = SUBJECT + transaction.from
  message.TextBody = `A transaction from ${transaction.from} has been found in block #${transaction.blockNumber}.
Eth value: ${transaction.value}
Recipient: ${transaction.to}
You can check it here: https://etherscan.io/tx/${transaction.hash}`

  if (transaction.value != '0') {
    message.Subject = 'WARNING: ETH value!! ' + message.Subject
  }

  return message
}

function getAddress() {
  const privateKey = process.env.PRIVATE_KEY.slice(0,2) == '0x' ? process.env.PRIVATE_KEY : '0x' + process.env.PRIVATE_KEY
  return '0x' + utils.privateToAddress(privateKey).toString('hex')
}

async function getWhitelistedAddresses(court) {
  const addresses = []
  // Court
  addresses.push(await court.instance.address)
  // Dispute Manager
  addresses.push((await court.disputeManager()).address)
  // Voting
  addresses.push((await court.voting()).address)
  // Subscriptions
  addresses.push((await court.subscriptions()).address)

  return addresses.map(a => a.toLowerCase())
}
async function getLastBlockNumber(web3) {
  return (await web3.eth.getBlock('latest')).number
}
