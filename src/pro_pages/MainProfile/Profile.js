import React from 'react'
import ProfileCom from './ProfileCom'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import {Col, Container, Row} from "reactstrap";

const MainProfile = () => {
    document.title = "Zuva | Client-Profile";
    return (
        <div className="page-content ">
            <Container fluid className='pagecooooo'>
                <BreadCrumb title="Profile" pageTitle="Profile" />
                <Row >
                    <Col>
                        <div className="h-100">
                            <Row>
                                <ProfileCom />
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MainProfile