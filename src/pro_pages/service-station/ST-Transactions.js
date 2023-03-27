import { Col, Container, Row, Card, CardBody, Button, CardHeader, Modal, ModalBody, ModalHeader, Label, Input } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IsTableNotLoading } from '../../store/auth.js/tableloadingStore';
import DataTable from "react-data-table-component";
import React, { useEffect, useState, useRef } from "react";
import moment from 'moment'
import Flatpickr from "react-flatpickr";
import { OPENLOADER, CLOSELOADER } from "../../store/auth.js/OpenLoader";
import { IsTableloading } from "../../store/auth.js/tableloadingStore";
import Apis from "../../Apis/Apis";
import { Toast } from 'primereact/toast';

const ST_Transactions = () => {

    const ServiceStationUserInfoIn = ([...useSelector(state => state.ServiceStationUserInfoRedux)].map((data) => data.status)[0])
    const toast = useRef(null);
    const dispatch = useDispatch()

    const StoredTransactions = ([...useSelector(state => state.TransactionsStoredRedux)].map((data) => data.status)[0])
    const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

    useEffect(() => {
        if (StoredTransactions === null) {
            dispatch(IsTableNotLoading())
        }
    }, [StoredTransactions])

    const ecomWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "Number Of Devices",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+16.24",
            counter: UserInfoStoredLocally.model === undefined ? 0 : UserInfoStoredLocally.model.devices.length,
            link: "list all devices",
            Link: "#",
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
            label: "Number Of Operators",
            badge: "ri-arrow-right-down-line",
            badgeClass: "danger",
            percentage: "-3.57",
            counter: UserInfoStoredLocally.model === undefined ? 0 : UserInfoStoredLocally.model.operators.length,
            link: "View all Operators",
            Link: "/service-station/attendants",
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
            Link: "/service-station/transactions",
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
            label: "Service Station Balances",
            badgeClass: "muted",
            percentage: "+0.00",
            counter: 0,
            bgcolor: "primary",
            toshow: "x",
            icon: "bx bx-dollar-circle",
            decimals: 2,
            prefix: "ZWL: $",
            suffix: "k"
        },
    ];


    const storedTableloadingStatus = ([...useSelector(state => state.IsTableLoadingStore)].map((data) => data.status)[0])

    const UserDataInfo = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])

    const CurrentTransaStoredRedux = ([...useSelector(state => state.CurrentTransaStoredRedux)].map((data) => data.status)[0])

    const senditems = CurrentTransaStoredRedux === null ? [] : CurrentTransaStoredRedux.map((data) => ({
        id: data.id, amount: (data.amount / 100).toFixed(2), litres: data.litres, description: data.description, product: data.product,
        date: data.created_at, status: data.status, pan: data.pan, reason: data.reason, transaction_type: data.transaction_type,
        operator: data.operator
    })).sort(function (a, b) { return b.id - a.id })

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])

    const [newSearchedTransactions, setnewSearchedTransactions] = useState([])

    const newArr = newSearchedTransactions.length !== 0 || undefined ? newSearchedTransactions.map((data) => ({
        id: data.id, amount: (data.amount / 100).toFixed(2), litres: data.litres, description: data.description, product: data.product,
        date: data.created_at, status: data.txn_status, pan: data.pan, reason: data.reason, transaction_type: data.transaction_type,
        operator: data.operator
    })).sort(function (a, b) { return b.id - a.id }) : senditems.sort((a, b) => {
        return b.id - a.id;
    });

    // style={{ color: 'grey', overflow: 'hidden', whiteSpace: 'wrap', textOverflow: 'ellipses' }}

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Date</span>,
            selector: row => moment.parseZone(row.date).format("YYYY-MM-DD HH:mm:ss"),
            sortable: true,
            grow: 1.5,
            wrap: true
        }
        ,
        {
            name: <span className='font-weight-bold fs-13'>Amount</span>,
            selector: row => row.amount,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Card</span>,
            selector: row => row.pan === null ? `${CheckIfCompany ? UserDataInfo.model.name : ""} ACCOUNT` : row.pan,
            sortable: true,
            grow: 2.2,
            wrap: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Litres</span>,
            selector: row => row.litres,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Description</span>,
            selector: row => row.description,
            sortable: true,
            grow: 3,
            wrap: true,
        },
        {
            name: <span className='font-weight-bold fs-13'>Transaction Type</span>,
            selector: row => row.transaction_type,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Product</span>,
            selector: row => row.product,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            selector: row => row.status,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Operator</span>,
            selector: row =>
                <span style={{
                    overflow: 'auto',
                    textOverflow: 'ellipses'
                }}>{row.operator}</span>,
            sortable: true,
            wrap: true,
        },
    ];

    const [search, setNewSearch] = useState("");
    const handlesearch = (e) => { setNewSearch(e.target.value) }
    const column = Object.keys(newArr[0] || {});
    const filtered = !search ? newArr : newArr.filter((data) =>
        column.some((column) =>
            data[column] === null ? "" : data[column].toString()
                .toLowerCase().indexOf(search.toString().toLowerCase()) > -1
        )
    )

    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(filtered);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'transactions');
        });
    }

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then(module => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });
                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    }


    const [modal_signUpModals, setmodal_signUpModals] = useState(false);
    function tog_signUpModals() { setmodal_signUpModals(!modal_signUpModals); }
    const [selectedRange1, setSelectedRange1] = useState('')
    const [selectedRange2, setSelectedRange2] = useState('')

    const date_selectedRange2 = new Date(moment.parseZone(selectedRange2).format("YYYY-MM-DD"));
    date_selectedRange2.setDate(date_selectedRange2.getDate() + 1);

    const CurrentServiceStationId = ([...useSelector(state => state.CurrentServiceStationId)].map((data) => data.status)[0])

    const SearchTransactionsByDateData = {
        id: CurrentServiceStationId === null ? '' : CurrentServiceStationId[0],
        startdate: selectedRange1,
        enddate: moment.parseZone(date_selectedRange2).format("YYYY-MM-DD")
    }

    const HandleSearchTransactionsByDate = () => {
        dispatch(OPENLOADER())
        dispatch(IsTableloading())
        Apis.post('/transactions/fetch', SearchTransactionsByDateData)
            .then(function (response) {
                if (response.status === 200) {
                    dispatch(CLOSELOADER())
                    dispatch(IsTableNotLoading())
                    setnewSearchedTransactions(response.data.data)
                    tog_signUpModals();
                    if (response.data.data.length === 0) {
                        toast.current.show({ severity: 'success', summary: 'There are no Transactions For the selected Period', life: 6000 })
                    }
                    else {
                        toast.current.show({ severity: 'success', summary: response.data.description, life: 6000 })
                    }
                }
                else toast.current.show({ severity: 'error', summary: 'Oops, Server Error', life: 6000 })
            })
            .catch(function (error) {
                dispatch(CLOSELOADER())
                dispatch(IsTableNotLoading())
                toast.current.show({ severity: 'error', summary: 'Oops, Connection Error', life: 6000 })
            });
    }

    document.title = "Zuva | Service-Station-Dashboard";
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className="page-content ">
                <Container fluid className='pagecooooo'>
                    <BreadCrumb title="Dashboard" pageTitle="Service-Station  > Dashboards" />
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row className="mb-3 pb-1">
                                    <Col xs={12}>
                                        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                            <div className="flex-grow-1" >
                                                <h4 className="fs-16 mb-1" style={{ color: "white" }}>
                                                    Good {(new Date().getHours()) < 4 ? <>Evening</> : (new Date().getHours()) < 12 ? <>Morning</> : (new Date().getHours()) < 18 ? <>Afternoon</> : <>Evening</>}, {ServiceStationUserInfoIn.user_name}!</h4>
                                                <div className="text-muted mb-0" ><p style={{ color: "white" }}>Here's what's up with your {UserInfoStoredLocally.model === undefined ? 'Loading...' : UserInfoStoredLocally.model.name} Service Station.</p></div>
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
                                <Row>
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

                                                                    <div style={{ display: "flex", flexDirection: "column" }} className="fs-18">
                                                                        <div>
                                                                            USD: ${(UserInfoStoredLocally.model === undefined ? 0 : UserInfoStoredLocally.model.deposit_amount).toFixed(2)}</div>
                                                                        <div className='mt-3'>
                                                                            ZWL: ${(0.00)}</div>
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
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Card>
                                            <CardHeader>
                                                <h5 className="card-title mb-0">Transactions Table</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <div>
                                                    <Row className="g-4 mb-3">
                                                        <Col className="col-sm-auto">
                                                            <div>
                                                                <Button onClick={() => { exportExcel() }} style={{ backgroundColor: '#009933' }} className="add-btn me-1" id="create-btn"><i className="ri-file-excel-2-line align-bottom me-1"></i> Excel</Button>
                                                            </div>
                                                        </Col>
                                                        <Col className="col-sm">
                                                            <div className="d-flex justify-content-sm-end">
                                                                <Button style={{ backgroundColor: '#009933' }}
                                                                    onClick={() => { tog_signUpModals() }}
                                                                    className="add-btn me-1" id="create-btn">Get Transactions By Date</Button>
                                                                <div className="search-box ms-2">
                                                                    <input value={search} onChange={handlesearch} type="text" className="form-control search" placeholder="Search..." />
                                                                    <i className="ri-search-line search-icon"></i>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <DataTable
                                                        columns={columns}
                                                        data={filtered}
                                                        pagination
                                                        highlightOnHover={true}
                                                        striped={true}
                                                        progressPending={storedTableloadingStatus}
                                                    />
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            < Modal id="signupModals" tabIndex="-1" isOpen={modal_signUpModals} centered modalClassName="zoomIn" >
                <ModalHeader className="p-3" toggle={() => { tog_signUpModals(); }}>
                    Search Transactions By Date
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (selectedRange1 && selectedRange2 !== '') {
                            HandleSearchTransactionsByDate()
                        }
                        else {
                            toast.current.show({ severity: 'error', summary: 'Please select date to retrieve transactions', life: 6000 })
                        }
                    }}>
                        <div className="mb-3">
                            <Label className="form-label mb-0">Select Date Ranges</Label>
                            <Flatpickr
                                className="form-control"
                                options={{
                                    mode: "range",
                                    dateFormat: "Y-m-d"
                                }}
                                onClose={(selectedDates, dateStr, instance) => {
                                    try {
                                        setSelectedRange1(instance.formatDate(selectedDates[0], "Y-m-d"))
                                        setSelectedRange2(instance.formatDate(selectedDates[1], "Y-m-d"))
                                    } catch (error) {
                                        var failed_response = error
                                    }
                                }}
                            />
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal >
        </React.Fragment>
    );
};

export default ST_Transactions;
