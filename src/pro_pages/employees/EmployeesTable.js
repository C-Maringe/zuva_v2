import React from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { EmployeesCom } from './EmployeesCom';
import { useSelector } from "react-redux";

const EmployeesTable = ({ employe }) => {

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])

    document.title = CheckIfCompany ? "Zuva | Client-Employees" : "Zuva | Client-Vehicles";

    return (
        <React.Fragment>
            <Col lg={12}>
                <Card>
                    <CardHeader>
                        <h5 className="card-title mb-0">{CheckIfCompany ? "Employees Table" : "Vehicles Table"}</h5>
                    </CardHeader>
                    <CardBody>
                        < EmployeesCom employe={employe} />
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default EmployeesTable;
