import BreadCrumb from '../../Components/Common/BreadCrumb'
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane,
  CardHeader, Modal, ModalBody, ModalHeader, Label, Input, Container
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

const ST_Profiles = () => {

  const dispatch = useDispatch()

  const [DescriptionReceived, setDescriptionReceived] = useState("")

  const [toast_severity, settoast_severity] = useState('')
  const toast = useRef(null);
  const [OpenNotify, setOpenNotify] = useState(false)

  const showError = () => { toast.current.show({ severity: toast_severity, summary: DescriptionReceived, life: 12000 }); }

  const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

  const [email, setEmail] = useState('')
  const [email1, setEmail1] = useState('')

  const handleemailchange = (e) => { setEmail(e.target.value); }
  const handleemail1change = (e) => { setEmail1(e.target.value); }

  const useForgetPassword = {
    "id": 1,
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

  useEffect(() => { sessionStorage.setItem('UserInfoStoredLocally', JSON.stringify(UserInfoStoredLocally)) }, [UserInfoStoredLocally])

  const [modal_signUpModals, setmodal_signUpModals] = useState(false);
  function tog_signUpModals() { setmodal_signUpModals(!modal_signUpModals); }

  const [UpEdit, setUpEdit] = useState(false)

  const userToken = ([...useSelector(state => state.UserToken)].map((data) => data.status)[0][0])

  const handleForgetPassword = () => {
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

  SwiperCore.use([Autoplay])


  document.title = 'Service-Station | Profile'
  return (
    <div className="page-content ">
      <Toast ref={toast} />
      <Container fluid className='pagecooooo'>
        <BreadCrumb title="Profile" pageTitle="Profile" />
        <Row >
          <Col>
            <div className="h-100">
              <Row>
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
                          <h3 className="text-white mb-1">{UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.name}</h3>
                          <p className="text-white-75">{UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.name}</p>
                          <div className="hstack text-white-50 gap-1">
                            <div className="me-2"><i
                              className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                              {UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.city}  {UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.address}
                            </div>
                            <div><i
                              className="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>
                              Service Station
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
                          {/* <div className="flex-shrink-0" onClick={() => {
                            tog_signUpModals()
                            setUpEdit(true)
                          }}>
                            <Link to="#" className="btn" style={{ backgroundColor: '#009933', color: 'white' }}><i
                              className="ri-edit-box-line align-bottom"></i> Change Password</Link>
                          </div> */}
                        </div>

                        <TabContent activeTab={activeTab} className="pt-4">
                          <TabPane tabId="1">
                            <Card>
                              <CardBody >
                                <h5 className="card-title mb-3">Info</h5>
                                <div >
                                  <div style={{ display: "flex" }}>
                                    <div className="table-responsive" style={{ width: "50%" }}>
                                      <Table className="table-borderless mb-0">
                                        <tbody>
                                          <tr>
                                            <th className="ps-0" scope="row">Service Station :</th>
                                            <td className="text-muted">{UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.name}</td>
                                          </tr>
                                          <tr>
                                            <th className="ps-0" scope="row">Number of Operators :</th>
                                            <td className="text-muted">{UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.operators.length}</td>
                                          </tr>
                                          <tr>
                                            <th className="ps-0" scope="row">Address :</th>
                                            <td className="text-muted"> {UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.address} </td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </div>
                                    <div className="table-responsive">
                                      <Table className="table-borderless mb-0">
                                        <tbody>
                                          <tr>
                                            <th className="ps-0" scope="row">Status :</th>
                                            <td className="text-muted">{UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.status}</td>
                                          </tr>
                                          <tr>
                                            <th className="ps-0" scope="row">Number of Devices :</th>
                                            <td className="text-muted">{UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.devices.length}</td>
                                          </tr>
                                          <tr>
                                            <th className="ps-0" scope="row">City :</th>
                                            <td className="text-muted">{UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.city}</td>
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
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ST_Profiles