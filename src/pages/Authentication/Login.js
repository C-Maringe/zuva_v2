import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import whitezuva from "../../assets/Pictures/whitezuva.png"
import { useDispatch, useSelector } from 'react-redux'
import { IsCompanyLogedIn, IsCompanyLogedOut } from '../../store/auth.js/IsCompany';
import { isloggedin } from '../../store/auth.js/Islogged';
import { Toast } from 'primereact/toast';
import { CLOSELOADER, OPENLOADER } from "../../store/auth.js/OpenLoader";
import Apis from '../../Apis/Apis';
import { RerunFetchFunction } from '../../store/auth.js/StoredRerunFunction';
import { IsTableloading } from '../../store/auth.js/tableloadingStore';
import jwt_decode from "jwt-decode";
import { IsNotServiceStationNow, IsServiceStationNow } from '../../store/auth.js/CheckIfServiceStation';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = () => {

    useEffect(() => {
        AOS.init({
            once: true,
            // disable: 'phone',
            duration: 600,
            easing: 'ease-out-sine',
        });
    }, []);

    const [DescriptionReceived, setDescriptionReceived] = useState("")

    const [toast_severity, settoast_severity] = useState('')
    const toast = useRef(null);

    const showError = () => { toast.current.show({ severity: toast_severity, summary: DescriptionReceived, life: 6000 }); }
    const [serviceStationId, setserviceStationId] = useState(0)

    const [checkIfCompanySuccess, setCheckIfCompanySuccess] = useState(false)
    const [checkIfCompanySuccess1, setCheckIfCompanySuccess1] = useState(false)
    const [checkIfIndividualSuccess, setCheckIfIndividualSuccess] = useState(false)
    const [handleErrorCompany, setHandleErrorCompany] = useState(false)
    const [handleErrorIndividual, setHandleErrorIndividual] = useState(false)

    const [handleErrorCompany1, setHandleErrorCompany1] = useState(false)
    const [handleErrorIndividual1, setHandleErrorIndividual1] = useState(false)
    const [holdCompanySuccess, setholdCompanySuccess] = useState(true)

    useEffect(() => {
        if (checkIfCompanySuccess === true && checkIfCompanySuccess1 === true && serviceStationId === 1) {
            showError()
            setCheckIfCompanySuccess(false)
            setCheckIfCompanySuccess1(false)
            dispatch(CLOSELOADER())
            dispatch(RerunFetchFunction())
            setTimeout(() => {
                navigate('/')
            }, 3000)
        }
        else if (checkIfIndividualSuccess === true && holdCompanySuccess === false && checkIfCompanySuccess === false && serviceStationId === 1) {
            showError()
            dispatch(CLOSELOADER())
            dispatch(RerunFetchFunction())
            setCheckIfIndividualSuccess(false)
            setTimeout(() => {
                navigate('/')
            }, 3000)
        }
        else if (serviceStationId === 2) {
            toast.current.show({ severity: "success", summary: 'login success', life: 6000 });
            setTimeout(() => { navigate('/service-station/transactions') }, 2000)
        }
        else if (handleErrorCompany === true && handleErrorIndividual === true && serviceStationId === 1) {
            toast.current.show({ severity: 'error', summary: 'Incorrect Credentials Entered', life: 6000 });
            setHandleErrorCompany(false)
            dispatch(CLOSELOADER())
            setHandleErrorIndividual(false)
        }
    }, [checkIfIndividualSuccess, checkIfCompanySuccess, handleErrorCompany, handleErrorIndividual, checkIfCompanySuccess1, holdCompanySuccess, serviceStationId])

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleemailchange = (e) => { setEmail(e.target.value); }
    const handlepasswordChange = (e) => { setPassword(e.target.value); }

    const uselogin = {
        "email": email,
        "password": password
    }

    const [CompanyIDFetch, setCompanyIDFetch] = useState("")
    const userToken = ([...useSelector(state => state.UserToken)].map((data) => data.status)[0][0])
    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])

    useEffect(() => {
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
                        dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                        dispatch({ type: "CURRENT_TRANSA_STORED", payload: response.data.pageable.content })
                    })
                    .catch(function (error) { })
                setCompanyIDFetch("");
            }
            else {
                Apis({
                    method: 'get',
                    url: `/customers/transactions/${CompanyIDFetch}?page=0&size=100&sort=id,desc`,
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        dispatch({ type: "TRANSACTIONS_STORED", payload: response.data })
                        dispatch({ type: "MORE_TRANSACTIONS_STORED", payload: response.data })
                        dispatch({ type: "CURRENT_TRANSA_STORED", payload: response.data.pageable.content })
                    })
                    .catch(function (error) { })
                setCompanyIDFetch("");
            }
        }
    }, [CompanyIDFetch, CheckIfCompany])

    const handlelogin = () => {
        dispatch({ type: "USER_CREDIDENTIALS", payload: uselogin })
        Apis.post('/company-administrators/login', uselogin)
            .then((response) => {
                if (response.data.description !== "Login success") { setholdCompanySuccess(false); setHandleErrorCompany(true) }
                else if (response.data.description === "Login success") {
                    setDescriptionReceived(response.data.description)
                    setCompanyIDFetch(response.data.company.id)
                    // ?page=0&size=20&sort=id,desc
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
                            setCheckIfCompanySuccess(true)
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
                            setCheckIfCompanySuccess1(true)
                        })
                        .catch(function (error) { })
                    dispatch(IsCompanyLogedIn())
                    settoast_severity('success')
                    dispatch(isloggedin())
                    // console.log(jwt_decode(response.data.token.access_token).exp)
                    // console.log(Date.now()/1000)
                    dispatch({ type: "USER_TOKEN", payload: [response.data.token.access_token] })
                    dispatch({ type: "SET_USER_INFO_DATA", payload: response.data })
                }
                else {
                    setHandleErrorCompany(true); setholdCompanySuccess(false)
                }
            }).catch((error) => {
                setHandleErrorCompany1(true)
            })
        Apis.post('/customers/login', uselogin)
            .then((response) => {
                // dispatch(CLOSELOADER())
                if (response.data.description === "Login success") {
                    setDescriptionReceived(response.data.description);
                    setCompanyIDFetch(response.data.customer.id)
                    settoast_severity('success')
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
                            dispatch(isloggedin())
                            setCheckIfIndividualSuccess(true)
                            // setTimeout(() => {
                            //     navigate('/')
                            // }, 2000)
                        })
                        .catch(function (error) { })
                    dispatch({ type: "USER_TOKEN", payload: [response.data.token.access_token] })
                    dispatch({ type: "SET_USER_INFO_DATA", payload: response.data })
                    dispatch(IsCompanyLogedOut())
                }
                else { setHandleErrorIndividual(true) }
            }).catch((error) => {
                dispatch(CLOSELOADER())
                setHandleErrorIndividual1(true)
                toast.current.show({ severity: "error", summary: 'Oops, Connection Error!!!', life: 6000 });
            })
        var ServiceStationconfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `/uaa/oauth/token?username=${email}&password=${password}&grant_type=password`,
            headers: { 'Authorization': 'Basic YXBwY2xpZW50OmFwcGNsaWVudEAxMjM=' },
            data: ''
        };
        Apis(ServiceStationconfig)
            .then(function (response) {
                dispatch({ type: "USER_TOKEN", payload: [response.data.access_token] })
                dispatch(CLOSELOADER())
                try {
                    if (jwt_decode(response.data.access_token).authorities[0] === 'BACK_OFFICE') {
                        dispatch(IsServiceStationNow());
                        setserviceStationId(2)
                        dispatch(isloggedin());
                        dispatch({ type: "SERVICE_STATION_USER_INFO", payload: jwt_decode(response.data.access_token) })
                    }
                } catch (error) {
                    console.log(error)
                }
            })
            .catch(function (error) {
                dispatch(IsNotServiceStationNow());
                if (error.message === "Request failed with status code 500") {
                    dispatch(CLOSELOADER());
                    toast.current.show({ severity: "error", summary: 'Oops, Connection Error!!!', life: 6000 });
                }
                else if (error.message === "Request failed with status code 400") {
                    setserviceStationId(1)
                }
                else {
                    dispatch(CLOSELOADER());
                    toast.current.show({ severity: "error", summary: error.message, life: 6000 });
                }
            });
    }

    const [passwordType, setPasswordType] = useState(false)
    const [PasswordSeverity, setPasswordSeverity] = useState('password')
    const TogglePasswordType = (e) => { setPasswordType(!passwordType) }

    useEffect(() => {
        if (passwordType === false) {
            setPasswordSeverity('password')
        }
        else if (passwordType === true) {
            setPasswordSeverity('text')
        }
    }, [passwordType])

    document.title = "Sign In | Zuva - Client";
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <ParticlesAuth>
                <div className="auth-page-content" >
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="#" className="d-inline-block auth-logo">
                                            <Suspense fallback={<h1 style={{ color: 'white' }}>Loading...</h1>}>
                                                <img src={whitezuva} alt="" height="100" data-aos="fade-down" data-aos-delay="200" />
                                            </Suspense>
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center" data-aos="fade-out" data-aos-delay="150">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2" data-aos="fade-down" data-aos-delay="300">
                                            <h5 className="text-primary">Welcome Back !</h5>
                                            <p className="text-muted">Sign in to continue to Zuva Platform.</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    dispatch(OPENLOADER())
                                                    dispatch(IsTableloading())
                                                    handlelogin();
                                                    // handleFuelStationLogin();
                                                    return false;
                                                }}
                                                action="#">
                                                <div className="mb-3" >
                                                    <Label htmlFor="email" className="form-label" data-aos="fade-left" data-aos-delay="300">Email or Username</Label>
                                                    <Input
                                                        data-aos="fade-right" data-aos-delay="300"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email or username"
                                                        type="text"
                                                        onChange={handleemailchange}
                                                        value={email || ""}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <div className="float-end" data-aos="fade-right" data-aos-delay="300">
                                                        <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                                                    </div>
                                                    <Label className="form-label" htmlFor="password-input" data-aos="fade-left" data-aos-delay="300">Password</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            data-aos="fade-right" data-aos-delay="300"
                                                            required
                                                            name="password"
                                                            value={password || ""}
                                                            type={PasswordSeverity}
                                                            className="form-control pe-5"
                                                            placeholder="Enter Password"
                                                            onChange={handlepasswordChange}
                                                        />
                                                        <button
                                                            data-aos="fade-in" data-aos-delay="300"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                TogglePasswordType()
                                                            }}
                                                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon"><i className="ri-eye-fill align-middle"></i></button>
                                                    </div>
                                                </div>

                                                <div className="form-check">
                                                    <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" data-aos="fade-in" data-aos-delay="300" />
                                                    <Label className="form-check-label" htmlFor="auth-remember-check" data-aos="fade-in">Remember me</Label>
                                                </div>

                                                <div className="mt-4" >
                                                    <Button className="btn w-100" type="submit" style={{ backgroundColor: "#009933" }}>Sign In</Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Login;


