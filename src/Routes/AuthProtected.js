import React, { useEffect } from "react";
import { Route, useNavigate } from "react-router-dom";

import { Outlet } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { isloggedout } from "../store/auth.js/Islogged";
import Login from '../pages/Authentication/Login'
import ST_Transactions from "../pro_pages/service-station/ST-Transactions";

const AuthProtected = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const CheckIfLogged = ([...useSelector(state => state.IsLoggedIn)].map((data) => data.status)[0])
  const IsServiceStation = ([...useSelector(state => state.IsServiceStation)].map((data) => data.status)[0])

  useEffect(() => {
    if (IsServiceStation === true) {
      navigate('/service-station/transactions')
    }
    if (CheckIfLogged === false) {
      navigate('/login')
      dispatch(isloggedout());
    }
  }, [CheckIfLogged, IsServiceStation])
  // navigate('/service-station/transactions')

  return <>{IsServiceStation ? <ST_Transactions /> : CheckIfLogged === true ? <Outlet /> : <Login />}</>;
};

const ServiceStationProtected = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const IsServiceStation = ([...useSelector(state => state.IsServiceStation)].map((data) => data.status)[0])

  useEffect(() => {
    if (IsServiceStation === false) {
      navigate('/login')
      dispatch(isloggedout());
    }
  }, [IsServiceStation])

  return <>{IsServiceStation === true ? <Outlet /> : <Login />}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute, ServiceStationProtected };