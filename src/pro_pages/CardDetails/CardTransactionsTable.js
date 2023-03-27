import React from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { CardTransactionsCom } from './CardTransactionsCom';

const CardTransactionsTable = ({CardTransData}) => {
    document.title = "Zuva | Client-Dashboard";
    return (
        <React.Fragment>
            <Col lg={12}>
                <Card>
                    <CardHeader>
                        <h5 className="card-title mb-0">Transactions Table</h5>
                    </CardHeader>
                    <CardBody>
                        <CardTransactionsCom CardTransData={CardTransData} />
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default CardTransactionsTable;
