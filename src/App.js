import React, { useEffect, useState } from 'react';
import './App.css'
import './assets/scss/themes.scss';
import './assets/scss/custom.css'
import { Spinner, Modal, ModalBody } from 'reactstrap';
import Route from './Routes';
import { useSelector, useDispatch } from "react-redux";
import { RerunFetchFunction, UndoRerunFetchFunction } from './store/auth.js/StoredRerunFunction'
import Apis from './Apis/Apis';
import { IsTableNotLoading } from './store/auth.js/tableloadingStore';

function App() {

    const dispatch = useDispatch()
    const CHECKLOADERSTATUS = ([...useSelector(state => state.TOGGLELOADER)].map((data) => data.status))[0]
    const CHECKRERUNFUNCTIONSTATUS = ([...useSelector(state => state.StoredRerunFunction)].map((data) => data.status))[0]

    const checkifflogged = ([...useSelector(state => state.IsLoggedIn)].map((data) => data.status)[0])

    const CurrentServiceStationId = ([...useSelector(state => state.CurrentServiceStationId)].map((data) => data.status)[0])

    const userStoredToken = ([...useSelector(state => state.UserToken)].map((data) => data.status)[0][0])
    const CompanyStoredID = ([...useSelector(state => state.CompanyID)].map((data) => data.status)[0][0])
    const CardInStoredID = ([...useSelector(state => state.CompanyID)].map((data) => data.status)[0][0])
    const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])
    const TransactionsStoredIn = ([...useSelector(state => state.TransactionsStoredRedux)].map((data) => data.status)[0])
    const MoreTransactionsStoredIn = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])
    const storedIsCompanyLoggedIn = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const UserCredidentialsLocally = ([...useSelector(state => state.UserCredidentials)].map((data) => data.status)[0])
    const CurrentTransaStoredRedux = ([...useSelector(state => state.CurrentTransaStoredRedux)].map((data) => data.status)[0])
    const storedIsServiceStation = ([...useSelector(state => state.IsServiceStation)].map((data) => data.status)[0])
    const storedTableloadingStatus = ([...useSelector(state => state.IsTableLoadingStore)].map((data) => data.status)[0])
    const ServiceStationUserInfoIn = ([...useSelector(state => state.ServiceStationUserInfoRedux)].map((data) => data.status)[0])


    const [PaginatorData, setPaginatorData] = useState("")
    const [CompanyIDFetch, setCompanyIDFetch] = useState("")
    const userToken = ([...useSelector(state => state.UserToken)].map((data) => data.status)[0][0])
    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const [Rerunfertchtrans, setRerunfertchtrans] = useState(false)

    const IsServiceStation = ([...useSelector(state => state.IsServiceStation)].map((data) => data.status)[0])

    useEffect(() => {
        setRerunfertchtrans(false)
        if (Rerunfertchtrans === true) {
            if (IsServiceStation === true) {
                const ServiceStationPayload = { username: ServiceStationUserInfoIn.user_name }
                Apis.post("/service-station/userid", ServiceStationPayload)
                    .then(function (response) {
                        if (response.data.code === 200) {
                            dispatch({ type: "SERVICE_STATION_ID", payload: [response.data.data[0].service_station_id] })
                            Apis({
                                method: 'get',
                                url: `/service-stations/transactions/${response.data.data[0].service_station_id}?page=0&size=100&sort=id,desc`,
                                headers: {
                                    'Authorization': `Bearer ${userToken}`,
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(function (response) {
                                    if (response.data.pageable.content !== undefined) {
                                        dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                                        dispatch({
                                            type: "CURRENT_TRANSA_STORED", payload: response.data.pageable.content
                                        })
                                    }
                                })
                                .catch((error) => { })
                            // ##################################################
                            Apis({
                                method: 'get',
                                url: `/service-stations/${response.data.data[0].service_station_id}`,
                                headers: {
                                    'Authorization': `Bearer ${userToken}`,
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(function (response) {
                                    if (response.data.code === 200) {
                                        dispatch({ type: "SET_USER_INFO_DATA", payload: response.data })
                                    }
                                })
                                .catch((error) => { })
                        }
                    })
                    .catch((error) => { })
            }
            if (CheckIfCompany === true) {
                Apis({
                    method: 'get',
                    url: `/companies/transactions/${CompanyIDFetch}?page=0&size=100&sort=id,desc`,
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        dispatch(IsTableNotLoading())
                        dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                        dispatch({ type: "CURRENT_TRANSA_STORED", payload: response.data.pageable.content })
                    })
                    .catch(function (error) { })
            }
            else if (CheckIfCompany === false) {
                Apis({
                    method: 'get',
                    url: `/customers/transactions/${CompanyIDFetch}?page=0&size=100&sort=id,desc`,
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        dispatch(IsTableNotLoading())
                        dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                        dispatch({ type: "MORE_TRANSACTIONS_STORED", payload: response.data })
                        dispatch({ type: "CURRENT_TRANSA_STORED", payload: response.data.pageable.content })
                    })
                    .catch(function (error) { })
            }
        }
    }, [Rerunfertchtrans, IsServiceStation])

    useEffect(() => {
        if (IsServiceStation === true) {
            const ServiceStationPayload = { username: ServiceStationUserInfoIn.user_name }
            setRerunfertchtrans(false)
            dispatch(IsTableNotLoading())
            Apis.post("/service-station/userid", ServiceStationPayload)
                .then(function (response) {
                    if (response.data.code === 200) {
                        dispatch({ type: "SERVICE_STATION_ID", payload: [response.data.data[0].service_station_id] })
                        Apis({
                            method: 'get',
                            url: `/service-stations/transactions/${response.data.data[0].service_station_id}?page=0&size=100&sort=id,desc`,
                            headers: {
                                'Authorization': `Bearer ${userToken}`,
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(function (response) {
                                if (response.data.pageable.content !== undefined) {
                                    dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                                    dispatch({
                                        type: "CURRENT_TRANSA_STORED", payload: response.data.pageable.content
                                    })
                                }
                            })
                            .catch((error) => { })
                        // ##################################################
                        Apis({
                            method: 'get',
                            url: `/service-stations/${response.data.data[0].service_station_id}`,
                            headers: {
                                'Authorization': `Bearer ${userToken}`,
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(function (response) {
                                if (response.data.code === 200) {
                                    dispatch({ type: "SET_USER_INFO_DATA", payload: response.data })
                                }
                            })
                            .catch((error) => { })
                    }
                })
                .catch((error) => { })
        }
        if (CompanyIDFetch !== "") {
            if (CheckIfCompany === true) {
                Apis({
                    method: 'get',
                    url: `/companies/transactions/${CompanyIDFetch}?page=0&size=100&sort=id,desc`,
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        dispatch(IsTableNotLoading())
                        dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                        dispatch({ type: "CURRENT_TRANSA_STORED", payload: response.data.pageable.content })
                    })
                    .catch(function (error) { })
            }
            else if (CheckIfCompany === false) {
                Apis({
                    method: 'get',
                    url: `/customers/transactions/${CompanyIDFetch}?page=0&size=100&sort=id,desc`,
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        dispatch(IsTableNotLoading())
                        dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                        dispatch({ type: "MORE_TRANSACTIONS_STORED", payload: response.data })
                        dispatch({ type: "CURRENT_TRANSA_STORED", payload: response.data.pageable.content })
                    })
                    .catch(function (error) { })
            }
            // }
        }
    }, [PaginatorData, CompanyIDFetch, CHECKRERUNFUNCTIONSTATUS, IsServiceStation]) 

    useEffect(() => {
        sessionStorage.setItem('checkifflogged', JSON.stringify(checkifflogged));
        sessionStorage.setItem('userStoredToken', JSON.stringify(userStoredToken))
        sessionStorage.setItem('CompanyStoredID', JSON.stringify(CompanyStoredID))
        sessionStorage.setItem('CardInStoredID', JSON.stringify(CardInStoredID !== undefined || null ? CardInStoredID : ""))
        sessionStorage.setItem('UserInfoStoredLocally', JSON.stringify(UserInfoStoredLocally))
        sessionStorage.setItem('TransactionsStoredIn', JSON.stringify(TransactionsStoredIn))
        sessionStorage.setItem('MoreTransactionsStoredIn', JSON.stringify(MoreTransactionsStoredIn))
        sessionStorage.setItem('storedIsCompanyLoggedIn', JSON.stringify(storedIsCompanyLoggedIn))
        sessionStorage.setItem('UserCredidentialsLocally', JSON.stringify(UserCredidentialsLocally))
        sessionStorage.setItem('CurrentTransaStoredIn', JSON.stringify(CurrentTransaStoredRedux))
        sessionStorage.setItem('storedTableloadingStatus', JSON.stringify(storedTableloadingStatus))
        sessionStorage.setItem('ServiceStationUserInfoIn', JSON.stringify(ServiceStationUserInfoIn))

        sessionStorage.setItem('CurrentServiceStationIdStored', JSON.stringify(CurrentServiceStationId))

        sessionStorage.setItem('PaginatorData', JSON.stringify(PaginatorData))
        sessionStorage.setItem('CompanyIDFetch', JSON.stringify(CompanyIDFetch))

        sessionStorage.setItem('storedIsServiceStation', JSON.stringify(storedIsServiceStation))

        if (checkifflogged === false) {
            sessionStorage.removeItem('PaginatorData')
            sessionStorage.removeItem('CompanyIDFetch')
            sessionStorage.removeItem('checkifflogged')
            sessionStorage.removeItem('userStoredToken')
            sessionStorage.removeItem('CompanyStoredID')
            sessionStorage.removeItem('CardInStoredID')
            sessionStorage.removeItem('UserInfoStoredLocally')
            sessionStorage.removeItem('TransactionsStoredIn')
            sessionStorage.removeItem('MoreTransactionsStoredIn')
            sessionStorage.removeItem('storedIsCompanyLoggedIn')
            sessionStorage.removeItem('UserCredidentialsLocally')
            sessionStorage.removeItem('CurrentTransaStoredIn')
            sessionStorage.removeItem('storedIsServiceStation')
            sessionStorage.removeItem('ServiceStationUserInfoIn')
            sessionStorage.removeItem('storedTableloadingStatus')
            sessionStorage.removeItem('CurrentServiceStationId')
        }
    }, [checkifflogged, userStoredToken, CompanyStoredID, CardInStoredID, UserInfoStoredLocally, CurrentTransaStoredRedux,
        TransactionsStoredIn, MoreTransactionsStoredIn, storedIsCompanyLoggedIn, UserCredidentialsLocally, CurrentServiceStationId,
        PaginatorData, CompanyIDFetch, storedTableloadingStatus, storedIsServiceStation, ServiceStationUserInfoIn])

    const userdata = ([...useSelector(state => state.UserCredidentials)].map((data) => data.status)[0])

    useEffect(() => {
        if (checkifflogged === true) {
            dispatch(RerunFetchFunction())
        }
    }, [checkifflogged])

    useEffect(() => {
        if (CHECKRERUNFUNCTIONSTATUS === true) {
            dispatch(UndoRerunFetchFunction())
            CheckIfCompany ?
                Apis.post('/company-administrators/login', userdata)
                    .then((response) => {
                        if (response.data.code === 200) {
                            setCompanyIDFetch(response.data.company.id)
                            Apis({
                                method: 'get',
                                url: `/companies/transactions/${response.data.company.id}`,
                                headers: {
                                    'Authorization': `Bearer ${response.data.token.access_token}`,
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(function (response) {
                                    dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                                    setPaginatorData(response.data.pageable.total_pages)
                                    setRerunfertchtrans(true)
                                })
                                .catch(function (error) { })
                            Apis({
                                method: 'get',
                                url: `/companies/${response.data.company.id}`,
                                headers: {
                                    'Authorization': `Bearer ${response.data.token.access_token}`,
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(function (response) {
                                    dispatch({ type: "SET_COMPANY_ID", payload: response.data.model.other_accounts })
                                    dispatch({ type: "MORE_TRANSACTIONS_STORED", payload: response.data })
                                })
                                .catch(function (error) { })
                            dispatch({ type: "USER_TOKEN", payload: [response.data.token.access_token] })
                            dispatch({ type: "SET_USER_INFO_DATA", payload: response.data })
                        }
                    }) :
                Apis.post('/customers/login', userdata)
                    .then((response) => {
                        if (response.data.code === 200) {
                            setCompanyIDFetch(response.data.customer.id)
                            Apis({
                                method: 'get',
                                url: `/customers/transactions/${response.data.customer.id}`,
                                headers: {
                                    'Authorization': `Bearer ${response.data.token.access_token}`,
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(function (response) {
                                    dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                                    dispatch({ type: "MORE_TRANSACTIONS_STORED", payload: response.data })
                                    setPaginatorData(response.data.pageable.total_pages)
                                    setRerunfertchtrans(true)
                                })
                                .catch(function (error) {

                                })
                            dispatch({ type: "USER_TOKEN", payload: [response.data.token.access_token] })
                            dispatch({ type: "SET_USER_INFO_DATA", payload: response.data })
                        }
                    })
        }
    }, [CHECKRERUNFUNCTIONSTATUS])

    const windowwidth = window.outerWidth

    const IsBulkTransfer = ([...useSelector(state => state.IsBulkTransfer)].map((data) => data.status)[0])
    const ProcessingBulkTransferInfo = ([...useSelector(state => state.ProcessingBulkTransferInfo)].map((data) => data.status)[0][0])

    return (
        <React.Fragment>
            {CHECKLOADERSTATUS &&
                < Modal modalClassName="zoomIn" tabIndex="-1" isOpen={CHECKLOADERSTATUS} centered
                    style={{ width: windowwidth > 600 ? "170px" : "" }}>
                    <ModalBody style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Spinner color="primary" /><div style={{ marginLeft: "10px", fontWeight: "700" }}>Loading...</div>
                        </div>
                        {
                            IsBulkTransfer &&
                            <div style={{ marginTop: '10px', fontWeight: "700" }}>
                                {ProcessingBulkTransferInfo}
                            </div>
                        }
                    </ModalBody>
                </Modal >
            }
            <Route />
        </React.Fragment >
    );
}

export default App;
