import React from 'react'
import { Col, Container, Row } from 'reactstrap';
import CardProfileCom from './CardProfileCom';
import BreadCrumb from '../../Components/Common/BreadCrumb'

const CardDetails = () => {
    return (
        <div className="page-content ">
            <Container fluid className='pagecooooo'>
                <BreadCrumb title="Card-Profile" pageTitle="Card-Profile" />
                <Row style={{ paddingTop: 20 }}>
                    <Col>
                        <div className="h-100">
                            <Row>
                                <CardProfileCom />
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default CardDetails