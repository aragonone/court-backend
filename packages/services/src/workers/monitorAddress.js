const utils = require('ethereumjs-util')
const postmark = require('postmark')

import Environment from '@aragon/court-backend-shared/models/evironments/LocalEnvironment'

// Postmark API endpoint
const POSTMARK_URL = 'https://api.postmarkapp.com/email'
const FROM = 'noreply@aragon.one'
const SUBJECT = `Found transaction from address `

// number of blocks checked backwards first time
const BLOCKS_BACKWARDS_INITIAL_THRESHOLD = 10
let lastCheckedBlockNumber = 0

export default async function (worker, job, logger) {
  try {
    const web3 = await getWeb3()
    if (lastCheckedBlockNumber == 0) {
      lastCheckedBlockNumber = await getLastBlockNumber(web3) - BLOCKS_BACKWARDS_INITIAL_THRESHOLD
    }
    const address = getAddress()
    lastCheckedBlockNumber = await monitor(logger, web3, address, lastCheckedBlockNumber)
  } catch (error) {
    console.error({ context: `Worker '${worker}' job #${job}`, message: error.message, stack: error.stack })
    throw error
  }
}

async function monitor(logger, web3, address, lastCheckedBlockNumber) {
  const currentBlockNumber = await getLastBlockNumber(web3)

  try {
    logger.info(`Checking transactions for address ${address} from block ${lastCheckedBlockNumber + 1}  to ${currentBlockNumber}`)

    for (let i = lastCheckedBlockNumber + 1; i <= currentBlockNumber; i++) {
      await checkTransactions(logger, web3, i, address)
    }

    logger.success(`Checked ${currentBlockNumber - lastCheckedBlockNumber} blocks`)
  } catch (error) {
    logger.error('Failed to check transactions')
    console.error(error)
  }

  return currentBlockNumber
}

async function checkTransactions(logger, web3, blockNumber, address) {
  const block = await web3.eth.getBlock(blockNumber)
  logger.info(`Checking transactions of block ${blockNumber}`)
  if (block && block.transactions) {
    for (let transactionHash of block.transactions) {
      //logger.info(`Checking transaction ${transactionHash}`)
      const transaction = await web3.eth.getTransaction(transactionHash)
      if (address.toLowerCase() === transaction.from.toLowerCase()) {
        logger.info(`Found transaction ${transactionHash} on block ${blockNumber}`)
        await sendNotification(logger, transaction)
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
You can check it here: https://etherscan.io/tx/${transaction.hash}`

  return message
}

function getAddress() {
  return '0x' + utils.privateToAddress(process.env.PRIVATE_KEY).toString('hex')
}

async function getLastBlockNumber(web3) {
  return (await web3.eth.getBlock('latest')).number
}

async function getWeb3() {
  return await (new Environment()).getWeb3()
}
