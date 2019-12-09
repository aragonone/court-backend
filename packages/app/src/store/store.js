import thunkMiddleware from 'redux-thunk'
import error from '../reducers/errors'
import account from '../reducers/accounts'
import fetching from '../reducers/fetching'
import anj from '../reducers/anj'
import court from '../reducers/court'
import jurors from '../reducers/jurors'
import drafts from '../reducers/drafts'
import disputes from '../reducers/disputes'
import { createStore, combineReducers, applyMiddleware } from 'redux'

const mainReducer = combineReducers({
  error,
  account,
  fetching,
  anj,
  court,
  jurors,
  drafts,
  disputes,
})

const Store = createStore(
  mainReducer,
  applyMiddleware(thunkMiddleware)
)

export default Store
