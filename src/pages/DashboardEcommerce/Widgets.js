import React, { useEffect } from 'react';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { IsTableNotLoading } from '../../store/auth.js/tableloadingStore';

const Widgets = () => {

    const dispatch = useDispatch()

    const CardInStoredID = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])
    const StoredTransactions = ([...useSelector(state => state.TransactionsStoredRedux)].map((data) => data.status)[0])
    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])
    const MoreTransactionsStoredRedux = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])

    useEffect(() => {
        if (StoredTransactions === null) {
            dispatch(IsTableNotLoading())
        }
    }, [StoredTransactions])

    const ecomWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "Number Of Cards",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+16.24",
            counter: CheckIfCompany ? CardInStoredID.cards.filter(({ pan }) => pan.includes('_')).length : CardInStoredID.customer.cards.filter(({ pan }) => pan.includes('_')).length,
            link: "View all cards",
            Link: "/cards",
            bgcolor: "success",
            toshow: "",
            icon: "bx bx-shopping-bag",
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 2,
            cardColor: "secondary",
            label: CheckIfCompany ? "Number Of Employees" : "Number Of Vehicles",
            badge: "ri-arrow-right-down-line",
            badgeClass: "danger",
            percentage: "-3.57",
            counter: CheckIfCompany ? CardInStoredID.vehicles.length : CardInStoredID.customer.vehicles.length,
            link: CheckIfCompany ? "View all Employees" : "View all Vehicles",
            Link: "/employees",
            bgcolor: "info",
            toshow: "",
            icon: "bx bx-user-circle ",
            decimals: 0,
            prefix: "",
            separator: ",",
            suffix: ""
        },
        {
            id: 3,
            cardColor: "success",
            label: "Number Of Transactions",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+29.08",
            counter: StoredTransactions === null ? 0 : StoredTransactions.pageable.total_elements,
            link: "View all Transactions",
            Link: "/",
            bgcolor: "warning",
            toshow: "",
            icon: "bx bx-wallet",
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 4,
            cardColor: "info",
            label: CheckIfCompany ? "Company Balances" : "Total Balance",
            badgeClass: "muted",
            percentage: "+0.00",
            counter: 0,
            // link: CheckIfCompany ? "Transfer Funds" : ".",
            // Link: CheckIfCompany ? "/transferfunds" : "/",
            bgcolor: "primary",
            toshow: CheckIfCompany ? "x" : "c",
            icon: "bx bx-dollar-circle",
            decimals: 2,
            prefix: "ZWL: $",
            suffix: "k"
        },
    ];
    return (
        <React.Fragment>
            {ecomWidgets.map((item, key) => (
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
                                    <h4 className={`fs-22 fw-semibold ff-secondary ${item.id !== 4 ? "mb-4" : "mb-2"}`}><span className="counter-value" data-target="559.25">
                                        {item.toshow === "" ? <CountUp
                                            start={0}
                                            prefix={item.prefix}
                                            suffix={item.suffix}
                                            separator={item.separator}
                                            end={item.counter}
                                            decimals={item.decimals}
                                            duration={1}
                                        /> :
                                            CheckIfCompany ?
                                                <div style={{ display: "flex", flexDirection: "column" }} className="fs-18">
                                                    <div>
                                                        USD: ${(MoreTransactionsStoredRedux.model.other_accounts.filter(({
                                                            currency }) => currency.includes('USD'))[0].deposit / 100).toFixed(2)}</div>
                                                    <div className='mt-3'>
                                                        ZWL: ${(MoreTransactionsStoredRedux.model.other_accounts.filter(({
                                                            currency }) => currency.includes('ZWL'))[0].deposit / 100).toFixed(2)}</div>
                                                </div> :
                                                <div style={{ display: "flex", flexDirection: "column" }} className="fs-18">
                                                    <div>USD: ${(
                                                        UserInfoStoredLocally.customer.cards.filter(({ pan, currency }) => pan.includes('_') && currency.includes('USD'))
                                                            .reduce((accumulator, object) => {
                                                                return accumulator + object.deposit_amount;
                                                            }, 0) / 100
                                                    ).toFixed(2)}</div>
                                                    <div className='mt-3'>ZWL: ${(
                                                        UserInfoStoredLocally.customer.cards.filter(({ pan, currency }) => pan.includes('_') && currency.includes('ZWL'))
                                                            .reduce((accumulator, object) => {
                                                                return accumulator + object.deposit_amount;
                                                            }, 0) / 100
                                                    ).toFixed(2)}</div>
                                                </div>
                                        }
                                    </span></h4>
                                    <Link to={item.Link} className="text-decoration-underline">{item.link}</Link>
                                </div>
                                {item.id !== 4 ?
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className={"avatar-title rounded fs-3 bg-soft-" + item.bgcolor}>
                                            <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                                        </span>
                                    </div> : <></>}
                            </div>
                        </CardBody>
                    </Card>
                </Col>))}
        </React.Fragment>
    );
};

export default Widgets;