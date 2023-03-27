import React from 'react'
import EmployeesTable from './EmployeesTable'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import { Col, Container, Row } from "reactstrap";
import { useSelector } from "react-redux";

const Employees = ({ employe }) => {
    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])

    document.title = CheckIfCompany ? "Zuva | Client-Employees" : "Zuva | Client-Vehicles";
    return (
        <div className="page-content ">
            <Container fluid className='pagecooooo'>
                {CheckIfCompany ?
                    <BreadCrumb title="Employees" pageTitle="Employees" /> :
                    <BreadCrumb title="Vehicles" pageTitle="Vehicles" />}
                <Row>
                    <Col>
                        <div className="h-100">
                            <Row>
                                <EmployeesTable employe={employe} />
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Employees