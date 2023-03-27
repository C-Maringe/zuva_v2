import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import SwiperCore, { Autoplay } from "swiper";
import { TabContent, NavLink, NavItem, Nav, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, TabPane, Card, CardBody, Table } from "reactstrap";
import { useSelector, useDispatch } from 'react-redux'
import { Toast } from 'primereact/toast';
import humanicon from '../../assets/Pictures/humanicon.jpg'
import zuvaback from '../../assets/Pictures/zuvaback.jpg'
import CardWidget from './CardWidget'
import CardTransactionsTable from './CardTransactionsTable';
import VehiclesCardsTable from './VehiclesCardsTable';
import moment from 'moment';
import { OPENLOADER, CLOSELOADER } from "../../store/auth.js/OpenLoader";
import Apis from '../../Apis/Apis';

const CardProfileCom = () => {
    const dispatch = useDispatch()

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

    const UserCardData = CheckIfCompany ? (UserDataInfo.model.cards.filter(({ pan }) => pan.includes(SelectedRoCardInfo.pan))[0]) :
        (CardDataStoredLocally.customer.cards.filter(({ pan }) => pan.includes(SelectedRoCardInfo.pan))[0])


    const CurrentTransaStoredRedux = ([...useSelector(state => state.CurrentTransaStoredRedux)].map((data) => data.status)[0])

    const CardTransData = CurrentTransaStoredRedux == null ? [] :
        (CurrentTransaStoredRedux.filter(({ pan }) => pan === SelectedRoCardInfo.pan))

    // const CardTransData = TransactionsStoredIn == null ? [] :
    //     (TransactionsStoredIn.pageable.content.filter(({ pan }) => pan === SelectedRoCardInfo.pan))

    document.title = "Zuva | Card Profile";
    return (
        <React.Fragment>
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
                                    <h3 className="text-white mb-1">Card: {SelectedRoCardInfo.pan}</h3>
                                    <p className="text-white-75">User: {SelectedRoCardInfo.name === undefined ? "No_Name" : SelectedRoCardInfo.name}</p>
                                    <div className="hstack text-white-50 gap-1">
                                        <div className="me-2"><i
                                            className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>{CheckIfCompany ? UserDataInfo.model.city : CardDataStoredLocally.customer.city}
                                        </div>
                                        <div><i
                                            className="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>{CheckIfCompany ? UserDataInfo.model.reg_number : ""}
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
                                                href="#activities"
                                                className={classnames({ active: activeTab === '2' })}
                                                onClick={() => { toggleTab('2'); }}
                                            >
                                                <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block"> View Card Holder</span>
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
                                    <div className="flex-shrink-0" onClick={() => { setmodal_list(true) }}>
                                        <div className="btn" style={{ backgroundColor: "#009933", color: 'white' }}><i
                                            className="ri-edit-box-line align-bottom"></i> Card Pin Reset</div>
                                    </div>
                                </div>
                                <TabContent activeTab={activeTab} className="pt-4">
                                    <Row>
                                        <CardWidget UserCardData={UserCardData} CardTransData={CardTransData} />
                                    </Row>
                                    <TabPane tabId="1">
                                        <Row>
                                            <CardTransactionsTable CardTransData={CardTransData} />
                                        </Row>
                                        <Row>
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Row>
                                            <VehiclesCardsTable CardDataStoredLocally={CardDataStoredLocally} UserCardData={UserCardData} />
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId="3">
                                        <Card>
                                            <CardBody >
                                                <h5 className="card-title mb-3">Info</h5>
                                                <div >
                                                    {CheckIfCompany ?
                                                        <div style={{ display: "flex" }}>
                                                            <div className="table-responsive" style={{ width: "50%" }}>
                                                                <Table className="table-borderless mb-0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row"> Company Name :</th>
                                                                            <td className="text-muted">{UserCardData.company}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Customer First Name :</th>
                                                                            <td className="text-muted">{SelectedRoCardInfo.name === undefined ? "No_Name" : SelectedRoCardInfo.name}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Currency :</th>
                                                                            <td className="text-muted">
                                                                                {UserCardData.currency}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">CardHolder Name :</th>
                                                                            <td className="text-muted"> {SelectedRoCardInfo.name === undefined ? "No_Name" : SelectedRoCardInfo.name} </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Container :</th>
                                                                            <td className="text-muted">{UserCardData.allowed_container ? "YES" : "NO"}</td>
                                                                        </tr>

                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Card Class :</th>
                                                                            <td className="text-muted">{UserCardData.class_of_service}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                            <div className="table-responsive">
                                                                <Table className="table-borderless mb-0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Card Number :</th>
                                                                            <td className="text-muted">{UserCardData.pan}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Balance :</th>
                                                                            <td className="text-muted">${(UserCardData.deposit_amount / 100).toFixed(2)}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Status :</th>
                                                                            <td className="text-muted">{UserCardData.status}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Last Use :</th>
                                                                            <td className="text-muted">{UserCardData.last_use_date !== null ? moment(UserCardData.last_use_date).utc().format('DD-MM-YYYY[ ]hh:mm:ss') : ""}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Expiry Date :</th>
                                                                            <td className="text-muted">{UserCardData.expiry !== null ? moment(UserCardData.expiry).utc().format('DD-MM-YYYY[ ]hh:mm:ss') : ""}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div style={{ display: "flex" }}>
                                                            <div className="table-responsive" style={{ width: "50%" }}>
                                                                <Table className="table-borderless mb-0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Customer First Name :</th>
                                                                            <td className="text-muted">{UserCardData.customer_first_name}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Currency :</th>
                                                                            <td className="text-muted">
                                                                                {UserCardData.currency}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Container :</th>
                                                                            <td className="text-muted">{UserCardData.allowed_container ? "YES" : "NO"}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Card Class :</th>
                                                                            <td className="text-muted">{UserCardData.class_of_service}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Last Use :</th>
                                                                            <td className="text-muted">{
                                                                                UserCardData.expiry !== null ? moment(UserCardData.last_use_date).utc().format('DD-MM-YYYY[ ]hh:mm:ss') : ""}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                            <div className="table-responsive">
                                                                <Table className="table-borderless mb-0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Card Number :</th>
                                                                            <td className="text-muted">{UserCardData.pan}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Customer Last Name :</th>
                                                                            <td className="text-muted">{UserCardData.customer_last_name}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Balance :</th>
                                                                            <td className="text-muted">${UserCardData.deposit_amount}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Status :</th>
                                                                            <td className="text-muted">{UserCardData.status}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Expiry Date :</th>
                                                                            <td className="text-muted">{UserCardData.expiry !== null ? moment(UserCardData.expiry).utc().format('DD-MM-YYYY[ ]hh:mm:ss') : ""}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    }
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
                                <button style={{ backgroundColor: "#009933", color: 'white' }} type="submit" className="btn" id="add-btn"
                                    onClick={() => { HandleProcessNewPin(); dispatch(OPENLOADER()) }}>Reset Pin</button>
                            </div>
                        </ModalFooter>
                    </form>
                </Modal>
            </Col>
        </React.Fragment >
    );
};

export default CardProfileCom;