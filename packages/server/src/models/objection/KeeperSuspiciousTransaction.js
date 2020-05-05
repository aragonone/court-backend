import BaseModel from './BaseModel'

export default class KeeperSuspiciousTransactions extends BaseModel {
  static get tableName() {
    return 'KeeperSuspiciousTransactions'
  }

  static async last() {
    const txs = await this.query().limit(1).orderBy('createdAt', 'DESC')
    return txs[0]
  }

  static async lastInspectedBlockNumber() {
    const tx = await this.last()
    return tx ? tx.blockNumber : 0
  }

  static async create(params = {}) {
    return this.query().insert(params)
  }
}
