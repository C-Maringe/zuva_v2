import React from 'react'
import { Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb'
import TransferCom from './TransferCom';

const Transferfunds = ({ SetOpenLoaderMain }) => {
    document.title = "Zuva | Client Funds Transfer";
    return (
        <React.Fragment>
            <div className="page-content ">
                <Container fluid className='pagecooooo'>
                    <BreadCrumb title="Funds Transfer" pageTitle="Funds Transfer" />
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row>
                                    <TransferCom SetOpenLoaderMain={SetOpenLoaderMain} />
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Transferfunds