import BreadCrumb from '../../Components/Common/BreadCrumb'
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import SwiperCore, { Autoplay } from "swiper";
import {
    TabContent, NavLink, NavItem, Nav, Col, Container, Modal, ModalBody,
    ModalFooter, ModalHeader, Row, TabPane, Card, CardBody, CardHeader,
    Table, Button, Label
} from "reactstrap";
import { useSelector, useDispatch } from 'react-redux'
import { Toast } from 'primereact/toast';
import humanicon from '../../assets/Pictures/humanicon.jpg'
import zuvaback from '../../assets/Pictures/zuvaback.jpg'
import moment from 'moment';
import { OPENLOADER, CLOSELOADER } from "../../store/auth.js/OpenLoader";
import Apis from '../../Apis/Apis';
import CountUp from "react-countup";
import DataTable from "react-data-table-component";
import Flatpickr from "react-flatpickr";

const ST_OperatorProfile = () => {

    const dispatch = useDispatch();

    // const TransactionsStoredIn = ([...useSelector(state => state.TransactionsStoredRedux)].map((data) => data.status)[0])

    const [modal_list, setmodal_list] = useState(false);
    const [DescriptionReceived, setDescriptionReceived] = useState("")
    const [toast_severity, settoast_severity] = useState('')
    const toast = useRef(null);
    const showError = () => { toast.current.show({ severity: toast_severity, summary: DescriptionReceived, life: 6000 }); }
    const [OpenNotify, setOpenNotify] = useState(false)

    SwiperCore.use([Autoplay]);

    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab) => { if (activeTab !== tab) { setActiveTab(tab); } };

    const SelectedRoCardInfo1 = ([...useSelector(state => state.SelectedCardDetails)].map((data) => data.status)[0])

    useEffect(() => {
        sessionStorage.setItem('SelectedRoCardInfo', JSON.stringify(SelectedRoCardInfo1))
    }, [SelectedRoCardInfo1])

    const [NewPin, setNewPin] = useState("")
    const HandleNewPin = (e) => { setNewPin(e.target.value) }

    const HandleProcessNewPindata = {
        "new_pin": NewPin,
        "pan": "USD_6094480005000000015"
    }

    const userToken = ([...useSelector(state => state.UserToken)].map((data) => data.status)[0][0])

    const HandleProcessNewPin = () => {
        Apis({
            method: 'post', url: '/card-operations/pin-set',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
            data: JSON.stringify(HandleProcessNewPindata)
        })
            .then(function (response) {
                dispatch(CLOSELOADER())
                setOpenNotify(true)
                setDescriptionReceived(response.data.description)
                if (response.data.description === 'Pin set successfully') {
                    settoast_severity('success')
                    setmodal_list(false)
                }
                else settoast_severity('error')
            })
            .catch(function (error) {
                dispatch(CLOSELOADER())
                setOpenNotify(true)
                setDescriptionReceived("ERROR!!! , Check Your Network Connectivity!!")
                setmodal_list(false)
                settoast_severity('error')
            });
    }

    useEffect(() => {
        if (OpenNotify === true) {
            showError();
            setOpenNotify(false)
        }
    }, [OpenNotify])

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])

    const SelectedRoCardInfo = ([...useSelector(state => state.SelectedCardDetails)].map((data) => data.status)[0])

    const UserDataInfo = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])
    const CardDataStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

    const CurrentTransaStoredRedux = ([...useSelector(state => state.CurrentTransaStoredRedux)].map((data) => data.status)[0])

    const storedTransactionsAfterFiltering = CurrentTransaStoredRedux.filter(({ operator }) => operator.includes(SelectedRoCardInfo.first_name + " " + SelectedRoCardInfo.last_name))

    const [newSearchedTransactions, setnewSearchedTransactions] = useState([])

    const newArr = newSearchedTransactions.map((data) => ({
        id: data.id, amount: (data.amount / 100).toFixed(2), litres: data.litres, description: data.description, product: data.product,
        date: data.created_at, status: data.txn_status, pan: data.pan, reason: data.reason, transaction_type: data.transaction_type,
        operator: data.operator
    })).sort(function (a, b) { return b.id - a.id })

    const newArrSum = newArr.reduce((a, v) => a = parseFloat(a) + parseFloat(v.amount), 0)

    const CardWidgetdata = [
        {
            id: 1,
            cardColor: "primary",
            label: "Operator Status",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+16.24",
            counter: "",
            link: "View all cards",
            text: SelectedRoCardInfo.status,
            Link: "/cards",
            bgcolor: "success",
            icon: "bx bx-shopping-bag",
            decimals: '',
            prefix: "",
            suffix: ""
        },
        {
            id: 3,
            cardColor: "success",
            label: "Number Of Transactions",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+29.08",
            counter: newArr.length,
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
            label: "Transactions Worth",
            badgeClass: "muted",
            percentage: "+0.00",
            counter: newArr.length !== 0 ? newArrSum : 0,
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
            wrap: true
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
            selector: row => <span>{row.operator}</span>,
            sortable: true,
            wrap: true
        }
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
            saveAsExcelFile(excelBuffer, 'card_transactions');
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

    const [selectedRange3, setSelectedRange3] = useState('')
    const [selectedRange4, setSelectedRange4] = useState('')

    const CurrentServiceStationId = ([...useSelector(state => state.CurrentServiceStationId)].map((data) => data.status)[0])

    const SearchTransactionsByDateData = {
        id: CurrentServiceStationId[0],
        operator: SelectedRoCardInfo.first_name + " " + SelectedRoCardInfo.last_name,
        startdate: selectedRange1,
        enddate: moment.parseZone(date_selectedRange2).format("YYYY-MM-DD")
    }

    const date_tommorrow = new Date(moment.parseZone(Date.now()).format("YYYY-MM-DD"));
    date_tommorrow.setDate(date_tommorrow.getDate() + 1);

    const SearchTransactionsByDateDataInitial = {
        id: CurrentServiceStationId[0],
        operator: SelectedRoCardInfo.first_name + " " + SelectedRoCardInfo.last_name,
        startdate: moment.parseZone(Date.now()).format("YYYY-MM-DD"),
        enddate: moment.parseZone(date_tommorrow).format("YYYY-MM-DD")
    }

    const [tableLoading, setTableloading] = useState(false)

    const HandleSearchTransactionsByDate = () => {
        dispatch(OPENLOADER())
        setTableloading(true)
        Apis.post('/transactions/operator/fetch', SearchTransactionsByDateData)
            .then(function (response) {
                setTableloading(false)
                if (response.status === 200) {
                    setSelectedRange3(selectedRange1)
                    setSelectedRange4(selectedRange2)
                    tog_signUpModals();
                    dispatch(CLOSELOADER())
                    setnewSearchedTransactions(response.data.data)
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
                toast.current.show({ severity: 'error', summary: 'Oops, Connection Error', life: 6000 })
            });
    }

    useEffect(() => {
        setTableloading(true)
        Apis.post('/transactions/operator/fetch', SearchTransactionsByDateDataInitial)
            .then(function (response) {
                if (response.status === 200) {
                    setTableloading(false)
                    setnewSearchedTransactions(response.data.data)
                    if (response.data.data.length === 0) {
                        toast.current.show({ severity: 'info', summary: 'Operator has no transactions yet', life: 6000 })
                    }
                }
                else toast.current.show({ severity: 'error', summary: 'Oops, Server Error could not fetch transactions for operator', life: 6000 })
            })
            .catch(function (error) {
                toast.current.show({ severity: 'error', summary: 'Oops, Connection Error could not fetch transactions for operator', life: 6000 })
            });
    }, [])

    document.title = 'Service-Station | Attendant-Profile'
    return (
        <div className="page-content ">
            <Container fluid className='pagecooooo'>
                <BreadCrumb title="Attendent-profile" pageTitle="Service-Station  > Attendent > profile" />
                <Row style={{ paddingTop: 20 }}>
                    <Col>
                        <div className="h-100">
                            <Row>
                                <Col lg={12}>
                                    <Toast ref={toast} />
                                    <div className="custom-page-content">
                                        <div className="profile-foreground position-relative mx-n4 mt-n4" >
                                            <div className="profile-wid-bg" >
                                                <img src={zuvaback} alt="" className="profile-wid-img" />
                                            </div>
                                        </div>
                                        <div className="pt-4 mb-4 mb-lg-3 pb-lg-4">
                                            <Row className="g-4">
                                                <div className="col-auto">
                                                    <div className="avatar-lg">
                                                        <img src={humanicon} alt="user-img"
                                                            className="img-thumbnail rounded-circle" />
                                                    </div>
                                                </div>

                                                <Col>
                                                    <div className="p-2">
                                                        <h3 className="text-white mb-1">Service Station: {SelectedRoCardInfo.service_station}</h3>
                                                        <p className="text-white-75">Operator: {SelectedRoCardInfo.first_name + " " + SelectedRoCardInfo.last_name}</p>
                                                        <div className="hstack text-white-50 gap-1">
                                                            <div className="me-2"><i
                                                                className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>Harare
                                                            </div>
                                                            <div><i
                                                                className="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>Service Station attendant
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <Row>
                                            <Col lg={12}>
                                                <div>
                                                    <div className="d-flex">
                                                        <Nav pills className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                                                            role="tablist">
                                                            <NavItem>
                                                                <NavLink
                                                                    href="#overview-tab"
                                                                    className={classnames({ active: activeTab === '1' })}
                                                                    onClick={() => { toggleTab('1'); }}
                                                                >
                                                                    <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
                                                                        className="d-none d-md-inline-block">View Transactions</span>
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink
                                                                    href="#card/profile/overview"
                                                                    className={classnames({ active: activeTab === '3' })}
                                                                    onClick={() => { toggleTab('3'); }}
                                                                >
                                                                    <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                                        className="d-none d-md-inline-block">Profile Overview</span>
                                                                </NavLink>
                                                            </NavItem>
                                                        </Nav>
                                                    </div>
                                                    <TabContent activeTab={activeTab} className="pt-4">
                                                        <Row>
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
                                                        </Row>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                <Col lg={12}>
                                                                    <Card>
                                                                        <CardHeader style={{ display: "flex", justifyContent: 'space-between' }}>
                                                                            <h5 className="card-title mb-0">Transactions Table</h5>
                                                                            <h5 className="card-title mb-0">
                                                                                {tableLoading ? 'loading...' :
                                                                                    'Showing transactions perfomed ' + (selectedRange3 === '' || selectedRange4 === '' ? ' today ' :
                                                                                        'from ' + selectedRange3 + ' to ' + selectedRange4)}
                                                                            </h5>
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
                                                                                    progressPending={tableLoading}
                                                                                />
                                                                            </div>
                                                                        </CardBody>
                                                                    </Card>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                            </Row>
                                                        </TabPane>
                                                        <TabPane tabId="3">
                                                            <Card>
                                                                <CardBody >
                                                                    <h5 className="card-title mb-3">Info</h5>
                                                                    <div >
                                                                        <div style={{ display: "flex" }}>
                                                                            <div className="table-responsive" style={{ width: "50%" }}>
                                                                                <Table className="table-borderless mb-0">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <th className="ps-0" scope="row">First Name :</th>
                                                                                            <td className="text-muted">{SelectedRoCardInfo.first_name}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th className="ps-0" scope="row">Service Station :</th>
                                                                                            <td className="text-muted">{SelectedRoCardInfo.service_station}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th className="ps-0" scope="row">Supervisor :</th>
                                                                                            <td className="text-muted">{SelectedRoCardInfo.supervisor ? "Yes" : "No"}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th className="ps-0" scope="row">Updated By :</th>
                                                                                            <td className="text-muted">{SelectedRoCardInfo.updated_by}</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </Table>
                                                                            </div>
                                                                            <div className="table-responsive">
                                                                                <Table className="table-borderless mb-0">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <th className="ps-0" scope="row">Last Name :</th>
                                                                                            <td className="text-muted">{SelectedRoCardInfo.last_name}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th className="ps-0" scope="row">Mobile :</th>
                                                                                            <td className="text-muted">{SelectedRoCardInfo.mobile}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th className="ps-0" scope="row">Status :</th>
                                                                                            <td className="text-muted">{SelectedRoCardInfo.status}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th className="ps-0" scope="row">Updated Date :</th>
                                                                                            <td className="text-muted">{moment.parseZone(SelectedRoCardInfo.updated_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </Table>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </CardBody>
                                                            </Card>
                                                        </TabPane>
                                                    </TabContent>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <Modal isOpen={modal_list} centered
                                        onClick={(e) => { e.preventDefault() }} modalClassName="flip">
                                        <ModalHeader className="p-3" toggle={() => { setmodal_list(false); }}>
                                            RESET PIN
                                        </ModalHeader>
                                        <form>
                                            <ModalBody>
                                                <div className="mb-3">
                                                    <label htmlFor="email-field" className="form-label">Confirm Pin</label>
                                                    <input type="text" className="form-control" placeholder="Enter Old Pin" required />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="email-field" className="form-label">New Pin</label>
                                                    <input type="text" className="form-control" placeholder="Enter New Pin" required
                                                        value={NewPin ?? ""} onChange={HandleNewPin} />
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button type="button" className="btn btn-light" onClick={() => { setmodal_list(false); }}>Cancel</button>
                                                    <button type="submit" className="btn btn-success" id="add-btn"
                                                        onClick={() => { HandleProcessNewPin(); dispatch(OPENLOADER()) }}>Reset Pin</button>
                                                </div>
                                            </ModalFooter>
                                        </form>
                                    </Modal>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
            < Modal id="signupModals" tabIndex="-1" isOpen={modal_signUpModals} centered >
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
                            <button type="submit" className="btn btn-primary" >Submit</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal >
        </div>
    )
}

export default ST_OperatorProfile