import React from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";

function RerunCode() {
    const dispatch = useDispatch()
    const userdata = ([...useSelector(state => state.UserCredidentials)].map((data) => data.status)[0])
        axios.post('/company-administrators/login', userdata)
            .then((response) => {
                if (response.data.code === 200) {
                    axios({
                        method: 'get',
                        url: `/companies/transactions/${response.data.company.id}`,
                        headers: {
                            'Authorization': `Bearer ${response.data.token.access_token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(function (response) {
                            dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                        })
                        .catch(function (error) {console.log(error)})
                    axios({
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
                        .catch(function (error) {console.log(error);})
                    dispatch({ type: "USER_TOKEN", payload: [response.data.token.access_token] })
                    dispatch({ type: "SET_USER_INFO_DATA", payload: response.data })
                }
            })
        axios.post('/customers/login',userdata )
            .then((response) => {
                if (response.data.code === 200) {
                    axios({
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
                        })
                        .catch(function (error) {
                            console.log(error)
                        })
                    dispatch({ type: "USER_TOKEN", payload: [response.data.token.access_token] })
                    dispatch({ type: "SET_USER_INFO_DATA", payload: response.data })
                }
            })
    return (<>{null}</>)
}

export default RerunCode