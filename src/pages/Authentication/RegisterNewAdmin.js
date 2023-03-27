import React, { useRef, Suspense, useState } from 'react';
import { Label, Button, Form, Alert, Card, CardBody, Col, Container, Row, Input } from 'reactstrap';
import SwiperCore, { Autoplay } from "swiper";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { Link, useNavigate } from "react-router-dom";
import whitezuva from "../../assets/Pictures/whitezuva.png"
import { Toast } from 'primereact/toast';
import { useParams } from 'react-router-dom';
import { OPENLOADER, CLOSELOADER } from '../../store/auth.js/OpenLoader';
import { useDispatch } from 'react-redux';
import Apis from '../../Apis/Apis';
import jwt_decode from "jwt-decode";

const RegisterNewAdmin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { token } = useParams();

    const [first_name, setfirst_name] = useState('')
    const [last_name, setlast_name] = useState('')
    const [mobile, setmobile] = useState('')
    const [password, setpassword] = useState('')

    const handlefirstNameChange = (e) => { setfirst_name(e.target.value) }
    const handlelastNameChange = (e) => { setlast_name(e.target.value) }
    const handleMobileChange = (e) => { setmobile(e.target.value) }
    const handlePasswordChange = (e) => { setpassword(e.target.value) }

    const decodedData = jwt_decode(token);

    const toast = useRef(null);

    const useRegisterAdminData = {
        email: decodedData.data.email,
        company_id: decodedData.data.company_id,
        superadmin: decodedData.data.superadmin,
        superadmin_firstname: decodedData.data.superadmin_firstname,
        first_name: first_name,
        last_name: last_name,
        mobile: mobile,
        password: password
    }

    const handleRegistrationApi = () => {
        if (decodedData.exp < Date.now() / 1000) {
            dispatch(CLOSELOADER());
            toast.current.show({ severity: 'error', summary: 'Oops, Link has expired. contact super admin to reset it', life: 6000 })
        }
        else {
            Apis.post('/multiple/company/admins/create', useRegisterAdminData)
                .then((response) => {
                    if (response.status === 200) {
                        dispatch(CLOSELOADER())
                        if (response.data.code === 401) {
                            toast.current.show({ severity: 'error', summary: response.data.description, life: 6000 })
                        }
                        else {
                            toast.current.show({ severity: 'success', summary: response.data.description, life: 6000 })
                            setTimeout(() => {
                                navigate('/login')
                            }, 4000)
                        }
                    }
                    else toast.current.show({ severity: 'error', summary: 'Oops, Server Error', life: 6000 })
                }).catch((error) => {
                    dispatch(CLOSELOADER());
                    toast.current.show({ severity: 'error', summary: 'Oops, Connection Error', life: 6000 })
                })
        }
    }

    const handleRegisterAdmin = () => {
        if (password && mobile && last_name && first_name !== '') {
            if (710000000 < mobile && mobile < 789999999) {
                setmobile(mobile + 263000000000)
                setTimeout(() => {
                    handleRegistrationApi()
                }, 200)
            }
            else if (263710000000 < mobile && mobile < 263789999999) {
                handleRegistrationApi()
            }
            else {
                dispatch(CLOSELOADER());
                toast.current.show({ severity: 'error', summary: 'Invalid mobile number selected', life: 6000 })
            }
        }
        else {
            dispatch(CLOSELOADER());
            toast.current.show({ severity: 'error', summary: 'Some fields are missing values, Please fill all fields', life: 6000 })
        }
    }

    SwiperCore.use([Autoplay])

    document.title = "Make Admin | Zuva - Company";
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
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <Suspense>
                                                <img src={whitezuva} alt="" height="100" />
                                            </Suspense>
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2" style={{ marginBottom: "20px" }}>
                                            <h5 className="text-primary">Admin Registration</h5>
                                        </div>
                                        <lord-icon
                                            src="https://cdn.lordicon.com/rhvddzym.json"
                                            trigger="loop"
                                            colors="primary:#0ab39c"
                                            className="avatar-xl"
                                            style={{ width: "120px", height: "120px" }}
                                        >
                                        </lord-icon>
                                        <Alert className="alert-borderless alert-warning text-center mb-2 mx-2" role="alert">
                                            Enter Your details below to register as admin!
                                        </Alert>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    dispatch(OPENLOADER())
                                                    handleRegisterAdmin()
                                                }}
                                                action="#">

                                                <div className="mb-3">
                                                    <Label className="form-label">First Name</Label>
                                                    <Input
                                                        name="first_name"
                                                        className="form-control"
                                                        placeholder="first name"
                                                        type="text"
                                                        value={first_name}
                                                        onChange={handlefirstNameChange}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label">Last Name</Label>
                                                    <Input
                                                        name="last_name"
                                                        className="form-control"
                                                        placeholder="last name"
                                                        type="text"
                                                        value={last_name}
                                                        onChange={handlelastNameChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Password</Label>
                                                    <Input
                                                        name="password"
                                                        className="form-control"
                                                        placeholder="password"
                                                        type="password"
                                                        value={password}
                                                        onChange={handlePasswordChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Phone number</Label>
                                                    <Input
                                                        name="mobile"
                                                        className="form-control"
                                                        placeholder="phone"
                                                        type="number"
                                                        value={mobile}
                                                        onChange={handleMobileChange}
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <Button color="success" className="btn btn-success w-100" type="submit" style={{ backgroundColor: "#009933" }}
                                                    >Submit</Button>
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

export default RegisterNewAdmin;