import React from 'react'
import token from '../../store/token'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component, path, exact = false, ...rest }) => {
  const authenticated = token.exists()
  const renderMergingProps = props => React.createElement(component, Object.assign({}, props, rest))

  return (
    <Route exact={exact} path={path} {...rest} render={
      props => authenticated
        ? renderMergingProps(props)
        : <Redirect to={{ pathname: '/', state: { from: props.location } }}/>
      }
    />
  )
}

PrivateRoute.propTypes = {
  exact: PropTypes.bool,
  location: PropTypes.object,
  path: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,
}

export default PrivateRoute
