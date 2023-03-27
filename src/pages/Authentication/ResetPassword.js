import React, { useRef, useEffect, useState } from 'react';
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

const ResetPassword = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams();
    const { token } = useParams();

    const [DescriptionReceived, setDescriptionReceived] = useState("")

    const [toast_severity, settoast_severity] = useState('')
    const toast = useRef(null);
    const [OpenNotify, setOpenNotify] = useState(false)

    const showError = () => {
        toast.current.show({ severity: toast_severity, summary: DescriptionReceived, life: 12000 });
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleemailchange = (e) => { setEmail(e.target.value); }
    const handlepasswordchange = (e) => { setPassword(e.target.value); }

    const useResetPassword = {
        "password": password,
        "token": token,
        "id": JSON.parse(id)
    }

    useEffect(() => {
        if (OpenNotify === true) {
            showError()
            dispatch(CLOSELOADER())
            setOpenNotify(false)
        }
    }, [OpenNotify])

    const handleResetPassword = () => {
        if (email === password) {
            Apis.post('/company/update-password', useResetPassword)
                .then((response) => {
                    setOpenNotify(true)
                    setDescriptionReceived(response.data.description)
                    if (response.data.code === 200) {
                        settoast_severity("success")
                        setTimeout(() => {
                            navigate("/login")
                        }, 2000)
                    }
                    else { settoast_severity("error"); }
                }).catch((error) => {
                    dispatch(CLOSELOADER());
                    toast.current.show({ severity: 'error', summary: 'Oops, Connection Error', life: 6000 })
                })
        }
        else {
            dispatch(CLOSELOADER())
            setOpenNotify(true)
            setDescriptionReceived('Password not Matching, Retry!!!')
            settoast_severity("error")
        }
    }

    SwiperCore.use([Autoplay])

    document.title = "Reset Password | Zuva - Client";
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
                                            <img src={whitezuva} alt="" height="100" />
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
                                            <h5 className="text-primary">RESET PASSWORD</h5>
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
                                            Enter your new password and confirm!
                                        </Alert>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    dispatch(OPENLOADER())
                                                    handleResetPassword();
                                                    return false;
                                                }}
                                                action="#">

                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">New Password</Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter password"
                                                        type="password"
                                                        onChange={handleemailchange}
                                                        value={email || ""}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">Confirm Password</Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Confirm password"
                                                        type="password"
                                                        onChange={handlepasswordchange}
                                                        value={password || ""}
                                                        required
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

                                <div className="mt-4 text-center">
                                    <div className="mb-0">Wait, I remember my password... <Link to="/login" className="fw-semibold text-primary text-decoration-underline"><div style={{ color: "white" }}>Click here</div></Link> </div>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default ResetPassword;