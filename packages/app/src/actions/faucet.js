import Network from '../web3/Network'
import ErrorActions from './errors'
import CourtActions from './court'
import AccountActions from './accounts'
import * as ActionTypes from '../actions/types'
import { fromWei } from 'web3-utils'

const FaucetActions = {
  find() {
    return async function(dispatch) {
      try {
        const courtAddress = await CourtActions.findCourt()
        if (await Network.isCourtAt(courtAddress)) {
          if (await Network.isFaucetAvailable()) {
            const faucet = await Network.getFaucet()
            if (faucet) {
              dispatch(FaucetActions.receiveFaucet(faucet.address))
              dispatch(FaucetActions.updateAntBalance(faucet))
              dispatch(FaucetActions.updateAnjBalance(faucet, courtAddress))
              dispatch(FaucetActions.updateFeeBalance(faucet, courtAddress))
            }
          }
        }
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateAntBalance(faucet) {
    return async function(dispatch) {
      try {
        const ant = await Network.getANT()
        const symbol = await ant.symbol()
        const antBalance = await ant.balanceOf(faucet.address)
        const balance = fromWei(antBalance.toString()) // TODO: assuming 18 decimals
        dispatch(FaucetActions.receiveAntBalance({ symbol, balance, address: ant.address }))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateAnjBalance(faucet, courtAddress) {
    return async function(dispatch) {
      try {
        const court = await Network.getCourt(courtAddress)
        const anj = await court.anj()
        const symbol = await anj.symbol()
        const anjBalance = await anj.balanceOf(faucet.address)
        const balance = fromWei(anjBalance.toString()) // TODO: assuming 18 decimals
        dispatch(FaucetActions.receiveAnjBalance({ symbol, balance, address: anj.address }))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateFeeBalance(faucet, courtAddress) {
    return async function(dispatch) {
      try {
        const court = await Network.getCourt(courtAddress)
        const feeToken = await court.feeToken()
        const symbol = await feeToken.symbol()
        const feeBalance = await feeToken.balanceOf(faucet.address)
        const balance = fromWei(feeBalance.toString()) // TODO: assuming 18 decimals
        dispatch(FaucetActions.receiveFeeBalance({ symbol, balance, address: feeToken.address }))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  claim(token) {
    return async function(dispatch) {
      try {
        const faucet = await Network.getFaucet()
        const { amount } = await faucet.getQuota(token)
        await faucet.withdraw(token, amount)
        dispatch(FaucetActions.find())
        dispatch(AccountActions.findCurrent())
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveFaucet(address) {
    return { type: ActionTypes.RECEIVE_FAUCET, address }
  },

  receiveAntBalance({ symbol, balance, address }) {
    return { type: ActionTypes.RECEIVE_FAUCET_ANT_BALANCE, symbol, balance, address }
  },

  receiveAnjBalance({ symbol, balance, address }) {
    return { type: ActionTypes.RECEIVE_FAUCET_ANJ_BALANCE, symbol, balance, address }
  },

  receiveFeeBalance({ symbol, balance, address }) {
    return { type: ActionTypes.RECEIVE_FAUCET_FEE_BALANCE, symbol, balance, address }
  },
}

export default FaucetActions
