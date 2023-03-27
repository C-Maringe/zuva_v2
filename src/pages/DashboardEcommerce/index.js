import React from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Widgets from "./Widgets";
import Section from "./Section";
import TransactionsTable from "../../pro_pages/Transactions/TransactionTable";

const DashboardEcommerce = () => {
  document.title = "Zuva | Client-Dashboard";
  return (
      <React.Fragment>
        <div className="page-content ">
          <Container fluid className='pagecooooo'>
            <BreadCrumb title="Dashboard" pageTitle="Dashboards" />
            <Row>
              <Col>
                <div className="h-100">
                  <Section />
                  <Row>
                    <Widgets />
                  </Row>
                  <Row>
                    <TransactionsTable/>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
  );
};

export default DashboardEcommerce;
