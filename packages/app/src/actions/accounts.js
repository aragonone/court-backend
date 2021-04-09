import Network from '../web3/Network'
import ErrorActions from './errors'
import CourtActions from './court'
import * as ActionTypes from '../actions/types'
import { fromWei } from 'web3-utils'

const AccountActions = {
  findCurrent() {
    return async function(dispatch) {
      try {
        const enabled = await Network.isEnabled()
        dispatch(AccountActions.receiveEnabled(enabled))

        if (enabled) {
          const account = await Network.getAccount()
          const courtAddress = await CourtActions.findCourt()
          dispatch(AccountActions.receive(account))
          dispatch(AccountActions.updateEthBalance(account))

          if (await Network.isCourtAt(courtAddress)) {
            dispatch(AccountActions.updateAntBalance(account))
            dispatch(AccountActions.updateAnjBalance(account, courtAddress))
            dispatch(AccountActions.updateFeeBalance(account, courtAddress))
          } else {
            dispatch(ErrorActions.show(new Error(`Could not find Court at ${courtAddress}, please make sure you're in the right network`)))
          }
        }
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateEthBalance(account) {
    return async function(dispatch) {
      try {
        const ethBalance = await Network.getBalance(account)
        const balance = fromWei(ethBalance.toString())
        dispatch(AccountActions.receiveEthBalance({ symbol: 'HNY', balance }))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateAntBalance(account) {
    return async function(dispatch) {
      try {
        const ant = await Network.getANT()
        if (!ant) console.error('Could not find an ANT instance for the current network')
        else {
          const symbol = await ant.symbol()
          const antBalance = await ant.balanceOf(account)
          const balance = fromWei(antBalance.toString())
          dispatch(AccountActions.receiveAntBalance({ symbol, balance, address: ant.address }))
        }
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateAnjBalance(account, courtAddress) {
    return async function(dispatch) {
      try {
        const court = await Network.getCourt(courtAddress)
        const anj = await court.anj()
        const symbol = await anj.symbol()
        const anjBalance = await anj.balanceOf(account)
        const balance = fromWei(anjBalance.toString())
        dispatch(AccountActions.receiveAnjBalance({ symbol, balance, address: anj.address }))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateFeeBalance(account, courtAddress) {
    return async function(dispatch) {
      try {
        const court = await Network.getCourt(courtAddress)
        const feeToken = await court.feeToken()
        const symbol = await feeToken.symbol()
        const feeBalance = await feeToken.balanceOf(account)
        const balance = fromWei(feeBalance.toString())
        dispatch(AccountActions.receiveFeeBalance({ symbol, balance, address: feeToken.address }))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receive(address) {
    return { type: ActionTypes.RECEIVE_ACCOUNT, address }
  },

  receiveEnabled(enabled) {
    return { type: ActionTypes.RECEIVE_WEB3_ENABLED, enabled }
  },

  receiveEthBalance({ symbol, balance }) {
    return { type: ActionTypes.RECEIVE_ETH_BALANCE, symbol, balance }
  },

  receiveAntBalance({ symbol, balance, address }) {
    return { type: ActionTypes.RECEIVE_ANT_BALANCE, symbol, balance, address }
  },

  receiveAnjBalance({ symbol, balance, address }) {
    return { type: ActionTypes.RECEIVE_ANJ_BALANCE, symbol, balance, address }
  },

  receiveFeeBalance({ symbol, balance, address }) {
    return { type: ActionTypes.RECEIVE_FEE_BALANCE, symbol, balance, address }
  },
}

export default AccountActions
