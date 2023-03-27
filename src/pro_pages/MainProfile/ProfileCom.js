import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane,
    CardHeader, Modal, ModalBody, ModalHeader, Label, Input
} from 'reactstrap';
import classnames from 'classnames';
import SwiperCore, { Autoplay } from "swiper";
import { useSelector, useDispatch } from 'react-redux';
import humanicon from '../../assets/Pictures/humanicon.jpg'
import zuvaback from '../../assets/Pictures/zuvaback.jpg'
import DataTable from "react-data-table-component";
import { CLOSELOADER, OPENLOADER } from '../../store/auth.js/OpenLoader';
import Apis from '../../Apis/Apis';
import { Toast } from 'primereact/toast';

const ProfileCom = () => {
    const dispatch = useDispatch()

    const [DescriptionReceived, setDescriptionReceived] = useState("")

    const [toast_severity, settoast_severity] = useState('')
    const toast = useRef(null);
    const [OpenNotify, setOpenNotify] = useState(false)

    const showError = () => { toast.current.show({ severity: toast_severity, summary: DescriptionReceived, life: 12000 }); }

    const CardInStoredID = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])
    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])

    const [email, setEmail] = useState('')
    const [email1, setEmail1] = useState('')

    const handleemailchange = (e) => { setEmail(e.target.value); }
    const handleemail1change = (e) => { setEmail1(e.target.value); }

    const useForgetPassword = {
        "id": CheckIfCompany ? CardInStoredID.company.contacts[0].id : CardInStoredID.customer.id,
        "old_password": email,
        "new_password": email1
    }

    useEffect(() => {
        if (OpenNotify === true) {
            showError()
            setOpenNotify(false)
        }
    }, [OpenNotify])

    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const UserDataInfo = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])
    const newdataAcc = CheckIfCompany ? (UserDataInfo.model.other_accounts.map((data) => ({ account: data.account, balance: data.deposit / 100 }))) : []
    const [USD_ACCOUNT] = (newdataAcc.filter(({ account }) => account.includes("USD")))
    const [ZWL_ACCOUNT] = (newdataAcc.filter(({ account }) => !account.includes("USD")))

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>First Name</span>,
            selector: row => row.first_name,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Last Name</span>,
            selector: row => row.last_name,
            sortable: true,
            grow: 1.4
        },
        {
            name: <span className='font-weight-bold fs-13'>Role</span>,
            selector: row => "Admin",
            sortable: true,
        },
        {
            name: <span className='font-weight-bold fs-13'>Email</span>,
            selector: row => row.email,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Mobile</span>,
            selector: row => row.mobile,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>WhatsApp Number</span>,
            selector: row => row.whats_app_number,
            sortable: true
        },
    ];

    const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])
    useEffect(() => { sessionStorage.setItem('UserInfoStoredLocally', JSON.stringify(UserInfoStoredLocally)) }, [UserInfoStoredLocally])

    const [modal_signUpModals, setmodal_signUpModals] = useState(false);
    function tog_signUpModals() { setmodal_signUpModals(!modal_signUpModals); }

    const [UpEdit, setUpEdit] = useState(false)

    const HandleCompanyPinReset = () => {
        dispatch(OPENLOADER());
        Apis.post('/company/inside/update-password', useForgetPassword)
            .then(function (response) {
                dispatch(CLOSELOADER())
                setOpenNotify(true)
                if (response.data.code === 200) {
                    setDescriptionReceived(`${response.data.description}`)
                    tog_signUpModals(); setEmail1(""); setEmail("")
                    settoast_severity("success")
                }
                else { settoast_severity("error"); setDescriptionReceived(response.data.description) }
            })
            .catch(function (error) {
                dispatch(CLOSELOADER()); setOpenNotify(true)
                setDescriptionReceived("Ooops, SERVER ERROR!!!")
                settoast_severity("error")
            });
    }

    const HandleCustomerPinReset = () => {
        dispatch(OPENLOADER());
        Apis({
            method: 'put', url: '/customers/change-password',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
            data: JSON.stringify(useForgetPassword)
        })
            .then(function (response) {
                dispatch(CLOSELOADER())
                setOpenNotify(true)
                if (response.data.code === 200) {
                    setDescriptionReceived(`${response.data.description}`)
                    tog_signUpModals(); setEmail1(""); setEmail("")
                    settoast_severity("success")
                }
                else { settoast_severity("error"); setDescriptionReceived(response.data.description) }
            })
            .catch(function (error) {
                dispatch(CLOSELOADER()); setOpenNotify(true)
                setDescriptionReceived("Ooops, SERVER ERROR!!!")
                settoast_severity("error")
            });
    }

    const userToken = ([...useSelector(state => state.UserToken)].map((data) => data.status)[0][0])

    const handleForgetPassword = () => {
        CheckIfCompany ? HandleCompanyPinReset() : HandleCustomerPinReset()
    }

    SwiperCore.use([Autoplay])

    return (
        <React.Fragment>
            <Toast ref={toast} />
            <Col lg={12}>
                <div className="profile-wid-bg" >
                    <img src={zuvaback} alt="" className="profile-wid-img" />
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
                                <h3 className="text-white mb-1">{CheckIfCompany ? UserDataInfo.model.name : <><>{CardInStoredID.customer.first_name}  </><>{CardInStoredID.customer.last_name}'s Profile</></>}</h3>
                                <p className="text-white-75">{CheckIfCompany ? UserDataInfo.model.company_contacts[0].company_contact_type : ""}</p>
                                <div className="hstack text-white-50 gap-1">
                                    <div className="me-2"><i
                                        className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                                        {CheckIfCompany ? UserDataInfo.model.city : CardInStoredID.customer.city}
                                    </div>
                                    <div><i
                                        className="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>
                                        {CheckIfCompany ? UserDataInfo.model.reg_number : CardInStoredID.customer.customer_class_of_service}
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
                                                className="d-none d-md-inline-block">Overview</span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <div className="flex-shrink-0" onClick={() => {
                                    tog_signUpModals()
                                    setUpEdit(true)
                                }}>
                                    <Link to="#" className="btn" style={{ backgroundColor: "#009933", color: 'white' }}><i
                                        className="ri-edit-box-line align-bottom"></i> Change Password</Link>
                                </div>
                            </div>

                            <TabContent activeTab={activeTab} className="pt-4">
                                <TabPane tabId="1">
                                    <Card>
                                        <CardBody >
                                            <h5 className="card-title mb-3">Info</h5>
                                            <div >{CheckIfCompany ?
                                                <div style={{ display: "flex" }}>
                                                    <div className="table-responsive" style={{ width: "50%" }}>
                                                        <Table className="table-borderless mb-0">
                                                            <tbody>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Status :</th>
                                                                    <td className="text-muted">{UserDataInfo.model.status}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">BP Number :</th>
                                                                    <td className="text-muted">{UserDataInfo.model.bp_number}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">ZWL Account :</th>
                                                                    <td className="text-muted">
                                                                        ZWL_{ZWL_ACCOUNT.account}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">ZWL Balance :</th>
                                                                    <td className="text-muted"> ${ZWL_ACCOUNT.balance.toFixed(2)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Business Type :</th>
                                                                    <td className="text-muted">{UserDataInfo.model.business_type}</td>
                                                                </tr>

                                                                <tr>
                                                                    <th className="ps-0" scope="row">Email :</th>
                                                                    <td className="text-muted">{UserDataInfo.model.email}</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className="table-responsive">
                                                        <Table className="table-borderless mb-0">
                                                            <tbody>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Address :</th>
                                                                    <td className="text-muted">{UserDataInfo.model.address}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">USD Account :</th>
                                                                    <td className="text-muted">{USD_ACCOUNT.account}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">USD Balance :</th>
                                                                    <td className="text-muted">${USD_ACCOUNT.balance.toFixed(2)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Business Phone :</th>
                                                                    <td className="text-muted">{UserDataInfo.model.business_phone}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Allowed Container :</th>
                                                                    <td className="text-muted">{UserDataInfo.model.allowed_container ? "YES" : "NO"
                                                                    }</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div> :
                                                <div style={{ display: "flex" }}>
                                                    <div className="table-responsive" style={{ width: "50%" }}>
                                                        <Table className="table-borderless mb-0">
                                                            <tbody>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">First Name :</th>
                                                                    <td className="text-muted">{CardInStoredID.customer.first_name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Email :</th>
                                                                    <td className="text-muted">{CardInStoredID.customer.email}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Mobile :</th>
                                                                    <td className="text-muted">
                                                                        ZWL_{CardInStoredID.customer.mobile}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Address :</th>
                                                                    <td className="text-muted"> {CardInStoredID.customer.address} </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Status :</th>
                                                                    <td className="text-muted">{CardInStoredID.customer.status}</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className="table-responsive">
                                                        <Table className="table-borderless mb-0">
                                                            <tbody>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Last Name :</th>
                                                                    <td className="text-muted">{CardInStoredID.customer.last_name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">WhatsApp Number :</th>
                                                                    <td className="text-muted">{CardInStoredID.customer.whats_app_number}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">City :</th>
                                                                    <td className="text-muted">{CardInStoredID.customer.city}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="ps-0" scope="row">Allowed Container :</th>
                                                                    <td className="text-muted">{CardInStoredID.customer.allowed_container ? "YES" : "NO"
                                                                    }</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>}
                                            </div>
                                        </CardBody>
                                    </Card>
                                    {CheckIfCompany &&
                                        <Card>
                                            <CardHeader>
                                                <h5 className="card-title mb-0">Company Administrators</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <DataTable
                                                    columns={columns}
                                                    data={UserDataInfo.model.company_contacts}
                                                    pagination
                                                    highlightOnHover={true}
                                                    striped={true}
                                                />
                                            </CardBody>
                                        </Card>}
                                </TabPane>
                            </TabContent>
                        </div>
                    </Col>
                </Row>
            </Col>
            < Modal id="signupModals" tabIndex="-1" isOpen={modal_signUpModals} centered modalClassName="flip">
                <ModalHeader className="p-3" toggle={() => { tog_signUpModals(); }}>
                    CHANGE YOUR PASSWORD
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={(e) => { e.preventDefault() }}>
                        <div className="mb-3">
                            <Label htmlFor="readonlyPlaintext" className="form-label">Old Password</Label>
                            <Input type="password" className="form-control" id="readonlyPlaintext" required
                                value={email} onChange={handleemailchange} placeholder='Enter Your Old Password' />
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="readonlyPlaintext" className="form-label">New Password</Label>
                            <Input type="password" className="form-control" id="readonlyPlaintext1" required
                                value={email1} onChange={handleemail1change} placeholder='Enter Your New Password' />
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary"
                                onClick={() => {
                                    if (email1 !== "" && email !== "") {
                                        handleForgetPassword()
                                    }
                                }}
                            >Submit</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal >
        </React.Fragment >
    );
};

export default ProfileCom;