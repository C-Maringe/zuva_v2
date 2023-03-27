import React from 'react'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import { Col, Container, Row } from "reactstrap";
import CardsTable from './CardsTable'

const MainCards = () => {
    document.title = "Zuva | Client-Cards";
    return (
        <div className="page-content ">
            <Container fluid className='pagecooooo'>
                <BreadCrumb title="Cards" pageTitle="Cards" />
                <Row>
                    <Col>
                        <div className="h-100">
                            <Row>
                                <CardsTable />
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MainCards