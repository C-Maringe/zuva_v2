import React from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { VehiclesCards } from './VehiclesCardsCom';

const VehiclesCardsTable = ({ CardDataStoredLocally, UserCardData }) => {

    document.title = "Zuva | Client-Dashboard";
    return (
        <React.Fragment>
            <Col lg={12}>
                <Card>
                    <CardHeader>
                        <h5 className="card-title mb-0">Card Holder Table</h5>
                    </CardHeader>
                    <CardBody>
                        <VehiclesCards CardDataStoredLocally={CardDataStoredLocally} UserCardData={UserCardData} />
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default VehiclesCardsTable;
