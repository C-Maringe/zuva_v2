import React from 'react';
import { useSelector } from "react-redux";
import { Col, Row } from 'reactstrap';

const Section = () => {

    const CardInStoredID = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])
    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])

    return (
        <React.Fragment>
            <Row className="mb-3 pb-1">
                <Col xs={12}>
                    <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                        <div className="flex-grow-1" >
                            <h4 className="fs-16 mb-1" style={{ color: "white" }}>
                                Good {(new Date().getHours()) < 4 ? <>Evening</> : (new Date().getHours()) < 12 ? <>Morning</> : (new Date().getHours()) < 18 ? <>Afternoon</> : <>Evening</>}, {CheckIfCompany ? CardInStoredID.administrator.first_name : CardInStoredID.customer.first_name}!</h4>
                            <div className="text-muted mb-0" ><p style={{ color: "white" }}>Here's what's up with your Zuva Client portal.</p></div>
                        </div>
                        <div className="mt-3 mt-lg-0 display-none-at-less-width">
                            <form action="#">
                                <Row className="g-3 mb-0 align-items-center">
                                    <div className="col-auto">
                                        <button type="button" className="btn btn-soft-info btn-icon waves-effect waves-light layout-rightside-btn"  >
                                            <i className="ri-pulse-line"></i></button>
                                    </div>
                                </Row>
                            </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Section;