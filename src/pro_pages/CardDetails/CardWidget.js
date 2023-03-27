import React from 'react';
import CountUp from "react-countup";
import { Card, CardBody, Col } from 'reactstrap';
import { useSelector } from 'react-redux';

const CardWidget = ({ UserCardData, CardTransData }) => {

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

    const CardWidgetdata = [
        {
            id: 1,
            cardColor: "primary",
            label: "Card Status",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+16.24",
            counter: "",
            link: "View all cards",
            text: CheckIfCompany === true ? UserCardData.status : UserCardData.status,
            Link: "/cards",
            bgcolor: "success",
            icon: "bx bx-shopping-bag",
            decimals: '',
            prefix: "",
            suffix: ""
        },
        // {
        //     id: 2,
        //     cardColor: "secondary",
        //     label: "Number Of Vehicles",
        //     badge: "ri-arrow-right-down-line",
        //     badgeClass: "danger",
        //     percentage: "-3.57",
        //     counter: CheckIfCompany ? UserCardData.vehicle_results.length : UserInfoStoredLocally.vehicles.length,
        //     link: "View all Employees",
        //     text: "",
        //     Link: "/employees",
        //     bgcolor: "info",
        //     icon: "bx bx-user-circle ",
        //     decimals: 0,
        //     prefix: "",
        //     separator: ",",
        //     suffix: ""
        // },
        {
            id: 3,
            cardColor: "success",
            label: "Number Of Transactions",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+29.08",
            counter: CheckIfCompany ? CardTransData.length : CardTransData.length,
            link: "View all Transactions",
            text: "",
            Link: "/dashboard",
            bgcolor: "warning",
            icon: "bx bx-wallet",
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 4,
            cardColor: "info",
            label: "Card Balance",
            badgeClass: "muted",
            percentage: "+0.00",
            counter: CheckIfCompany ? UserCardData.deposit_amount / 100 : UserInfoStoredLocally.customer.cards.filter(({ pan }) => pan.includes('_')).reduce((accumulator, object) => {
                return accumulator + object.deposit_amount;
            }, 0) / 100,
            link: "Transfer Funds",
            text: "",
            Link: "/transferfunds",
            bgcolor: "primary",
            icon: "bx bx-dollar-circle",
            decimals: 2,
            prefix: "$",
            suffix: ""
        },
    ];
    return (
        <React.Fragment>
            {CardWidgetdata.map((item, key) => (
                <Col xl={3} md={6} key={key}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1 overflow-hidden">
                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                    <h4 className="fs-22 fw-semibold ff-secondary mb-4"><span className="counter-value" data-target="559.25">
                                        {item.text === "" ?
                                            <CountUp
                                                start={0}
                                                prefix={item.prefix}
                                                suffix={item.suffix}
                                                separator={item.separator}
                                                end={item.counter}
                                                decimals={item.decimals}
                                                duration={1}
                                            /> : <>{item.text}</>}
                                    </span></h4>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className={"avatar-title rounded fs-3 bg-soft-" + item.bgcolor}>
                                        <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>))}
        </React.Fragment>
    );
};

export default CardWidget;