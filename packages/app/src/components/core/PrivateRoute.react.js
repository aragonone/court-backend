import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component, path, admin, exact = false, ...rest }) => {
  const renderMergingProps = props => React.createElement(component, Object.assign({}, props, rest))

  return (
    <Route exact={exact} path={path} {...rest} render={
      props => !!admin
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
