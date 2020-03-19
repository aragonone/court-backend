import postmark from 'postmark'
import Models from '@aragonone/court-backend-server/build/models'
import Network from '@aragonone/court-backend-server/build/web3/Network'

// notifications settings
const FROM = 'noreply@aragon.one'

// number of blocks checked backwards first time
const BLOCKS_BACKWARDS_INITIAL_THRESHOLD = 10

let lastCheckedBlockNumber = 0

export default async function (worker, job, logger) {
  try {
    const court = await Network.getCourt()
    const { environment } = court
    const keeper = await getKeeperAddress(environment)
    const courtAddresses = await getWhitelistedAddresses(court)

    if (lastCheckedBlockNumber === 0) {
      lastCheckedBlockNumber = await environment.getLastBlockNumber() - BLOCKS_BACKWARDS_INITIAL_THRESHOLD
    }
    lastCheckedBlockNumber = await monitor(logger, environment, courtAddresses, keeper, lastCheckedBlockNumber)

  } catch (error) {
    console.error({ context: `Worker '${worker}' job #${job}`, message: error.message, stack: error.stack })
    throw error
  }
}

async function monitor(logger, environment, courtAddresses, keeper, lastCheckedBlockNumber) {
  try {
    const currentBlockNumber = await environment.getLastBlockNumber()
    logger.info(`Checking transactions for keeper address ${keeper} from block ${lastCheckedBlockNumber + 1} to ${currentBlockNumber}`)

    for (let blockNumber = lastCheckedBlockNumber + 1; blockNumber <= currentBlockNumber; blockNumber++) {
      await checkTransactions(logger, environment, courtAddresses, blockNumber, keeper)
    }

    logger.success(`Checked ${currentBlockNumber - lastCheckedBlockNumber} blocks`)
    return currentBlockNumber
  } catch (error) {
    logger.error('Failed to check transactions')
    console.error(error)
  }
}

async function checkTransactions(logger, environment, courtAddresses, blockNumber, address) {
  logger.info(`Checking transactions of block ${blockNumber}`)
  const block = await environment.getBlock(blockNumber)

  if (block && block.transactions) {
    for (let transactionHash of block.transactions) {
      const transaction = await environment.getTransaction(transactionHash)
      if (address.toLowerCase() === transaction.from.toLowerCase()) {
        logger.info(`Found transaction ${transactionHash} on block ${blockNumber}`)
        if (transaction.value != '0' || !courtAddresses.includes(transaction.to.toLowerCase())) {
          const message = buildSuspiciousTransactionMessage(transaction)
          await sendNotification(logger, message)
        }
      }
    }
  }
}

async function sendNotification(logger, message) {
  logger.info(`Sending email notifications for '${message.Subject}'`)

  message.From = FROM
  message.To = (await Models.Admin.allEmails()).join(', ')

  const client = new postmark.Client(process.env.POSTMARK_TOKEN)
  const response = await client.sendEmail(message)

  if(!response || response.ErrorCode != 0) {
    logger.error('Failed to send notification')
    logger.error(response)
  }
}

function buildSuspiciousTransactionMessage(transaction) {
  const message = {
    Subject: `Suspicious transaction from keeper address ${transaction.from}`,
    TextBody: `
      A transaction from keeper address ${transaction.from} has been found in block #${transaction.blockNumber}.
      Eth value: ${transaction.value}
      Recipient: ${transaction.to}
      You can check it here: https://etherscan.io/tx/${transaction.hash}`
  }

  if (transaction.value != '0') message.Subject = `(⚠️ ETH!) ${message.Subject}`
  return message
}

async function getKeeperAddress(environment) {
  const web3 = await environment.getWeb3()
  const rawPrivateKey = process.env.PRIVATE_KEY
  const parsedPrivateKey = rawPrivateKey.slice(0, 2) === '0x' ? rawPrivateKey : `0x${rawPrivateKey}`
  const { address } = await web3.eth.accounts.privateKeyToAccount(parsedPrivateKey)
  return address
}

async function getWhitelistedAddresses(court) {
  const addresses = []
  addresses.push(court.instance.address)                  // Controller
  addresses.push((await court.disputeManager()).address)  // Dispute Manager
  addresses.push((await court.voting()).address)          // Voting
  addresses.push((await court.subscriptions()).address)   // Subscriptions
  return addresses.map(a => a.toLowerCase())
}
