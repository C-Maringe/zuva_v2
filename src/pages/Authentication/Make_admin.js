import React, { useRef, Suspense } from 'react';
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

const Make_admin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { token } = useParams();

    const decodedData = jwt_decode(token);

    const toast = useRef(null);

    const useMakeAdminData = {
        email: decodedData.data.email,
        company_id: decodedData.data.company_id,
        superadmin: decodedData.data.superadmin,
        superadmin_firstname: decodedData.data.superadmin_firstname,
        processApproved: true
    }

    const handleConfirmMakeAdmin = () => {
        if (decodedData.exp < Date.now() / 1000) {
            dispatch(CLOSELOADER());
            toast.current.show({ severity: 'error', summary: 'Oops, Link has expired. Login to reset it', life: 6000 })
            setTimeout(() => {
                navigate('/login')
            }, 4000)
        }
        else {
            Apis.post('/company/confirmed/make-admin', useMakeAdminData)
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
                                            <h5 className="text-primary">Make Admin</h5>
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
                                            Confirm email below to make admin!
                                        </Alert>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    dispatch(OPENLOADER())
                                                    handleConfirmMakeAdmin()
                                                }}
                                                action="#">

                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">Email</Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter password"
                                                        type="email"
                                                        defaultValue={useMakeAdminData.email}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <Button color="success" className="btn btn-success w-100" type="submit" style={{ backgroundColor: "#009933" }}
                                                    >Confirm</Button>
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

export default Make_admin;