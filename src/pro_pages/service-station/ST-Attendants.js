import BreadCrumb from '../../Components/Common/BreadCrumb'
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Modal, ModalBody, ModalHeader, Label, Input, Container, Row, Button, Form } from 'reactstrap';
import { Toast } from 'primereact/toast';
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";
import DataTable from "react-data-table-component";
import { FiEdit } from 'react-icons/fi'
import { AiOutlineEye } from 'react-icons/ai'
import { Link } from "react-router-dom";
import Apis from '../../Apis/Apis';
import { RerunFetchFunction } from '../../store/auth.js/StoredRerunFunction';
import { OPENLOADER, CLOSELOADER } from '../../store/auth.js/OpenLoader';

const ST_Attendants = () => {

    const dispatch = useDispatch()

    const toast = useRef(null);

    const [modal_signUpModals, setmodal_signUpModals] = useState(false);
    function tog_signUpModals() { setmodal_signUpModals(!modal_signUpModals); }

    const [confirm_delete, setconfirm_delete] = useState(false);
    function tog_confirm_delete() { setconfirm_delete(!confirm_delete); }

    const [first_name, setFirst_Name] = useState("")
    const [last_name, setLast_Name] = useState("")
    const [mobile_number, setMobile_number] = useState("")
    const [supervisor, setsupervisor] = useState({ label: "", value: "" })
    const [passcord, setPasscord] = useState("")
    const [confirm_passcord, setConfirm_passcord] = useState("")

    const Handlefirst_name = (e) => { setFirst_Name(e.target.value) }
    const Handlelast_name = (e) => { setLast_Name(e.target.value) }
    const Handlemobile_number = (e) => { setMobile_number(e.target.value) }
    const Handlepasscord = (e) => { setPasscord(e.target.value) }
    const Handleconfirm_passcord = (e) => { setConfirm_passcord(e.target.value) }

    const CurrentServiceStationId = ([...useSelector(state => state.CurrentServiceStationId)].map((data) => data.status)[0])

    const [UpEdit, setUpEdit] = useState(false)

    const [carddetails, setcarddetails] = useState({ value: "value", pan: "", status: "" })

    const supervisorOption = [{ options: [{ label: "TRUE", value: "TRUE" }, { label: "FALSE", value: "FALSE" }] }];

    const userToken = ([...useSelector(state => state.UserToken)].map((data) => data.status)[0][0])

    const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

    const SelectedRoCardInfo = ([...useSelector(state => state.SelectedCardDetails)].map((data) => data.status)[0])

    useEffect(() => {
        sessionStorage.setItem('SelectedRoCardInfo', JSON.stringify(SelectedRoCardInfo))
    }, [SelectedRoCardInfo])

    const newArr = UserInfoStoredLocally.model === undefined ? [] : UserInfoStoredLocally.model.operators.sort((a, b) => {
        return a.id - b.id;
    });

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true,
        },
        {
            name: <span className='font-weight-bold fs-13'>Name</span>,
            selector: row => row.first_name + " " + row.last_name,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Station</span>,
            selector: row => row.service_station,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Supervisor</span>,
            selector: row => row.supervisor ? "Yes" : "No",
            sortable: true,
        },
        {
            name: <span className='font-weight-bold fs-13'>Mobile</span>,
            selector: row => row.mobile,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            selector: row => row.status,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13 '>Edit</span>,
            selector: row => <FiEdit
                onClick={() => {
                    setcarddetails(row)
                    dispatch({ type: "SET_SELECTED_CARD_DETAILS", payload: row })
                    tog_UpdateAttendant()
                    setUpEdit(true)
                }} />,
            sortable: true,
        },
        {
            name: <span className='font-weight-bold fs-13'>Profile</span>,
            selector: row => <Link to='/service-station/attendant/profile'>
                <div className="custom-profileview" style={{ color: "color-#405189" }}
                    onClick={() => {
                        dispatch({ type: "SET_SELECTED_CARD_DETAILS", payload: row })
                    }} ><AiOutlineEye style={{ fontSize: "20px", color: "color-#405189" }} /> Profile</div></Link>,
            sortable: true,
        },
        {
            name: <span className='font-weight-bold fs-13 '>Delete</span>,
            selector: row => <span className='ri-delete-bin-2-line' style={{ color: 'red', fontSize: '16px' }}
                onClick={() => {
                    setcarddetails(row)
                    dispatch({ type: "SET_SELECTED_CARD_DETAILS", payload: row })
                    tog_confirm_delete();
                }} > Delete</span>,
            sortable: true,
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
            saveAsExcelFile(excelBuffer, 'attendants');
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



    const [modal_UpdateAttendant, setmodal_UpdateAttendant] = useState(false);
    function tog_UpdateAttendant() { setmodal_UpdateAttendant(!modal_UpdateAttendant); }

    const [operator_statusSelect, setoperator_statusSelect] = useState({ label: "", value: "" })
    const [SupervisorSelect, setSupervisorSelect] = useState({ label: "", value: "" })

    const [NothingChanged1, setNothingChanged1] = useState(true)
    const [NothingChanged2, setNothingChanged2] = useState(true)

    const UpdateAttendantData = {
        id: SelectedRoCardInfo.id,
        supervisor: NothingChanged1 ? SelectedRoCardInfo.supervisor : SupervisorSelect.value === "YES" ? true : false,
        operator_status: NothingChanged2 ? SelectedRoCardInfo.status : operator_statusSelect.value
    }

    const operator_statusSelectOption = [{ options: [{ label: "ACTIVE", value: "ACTIVE" }, { label: "BLOCKED", value: "BLOCKED" }] }];
    const SupervisorSelectOption = [{ options: [{ label: "YES", value: "YES" }, { label: "NO", value: "NO" }] }];

    const HandleUpdateAttendant = async () => {
        Apis.post('/attendant/update', UpdateAttendantData)
            .then(function (response) {
                setNothingChanged1(true)
                setNothingChanged2(true)
                if (response.status === 200) {
                    dispatch(RerunFetchFunction())
                    setoperator_statusSelect({ label: "", value: "" })
                    toast.current.show({ severity: 'success', summary: response.data.description, life: 6000 })
                }
                else toast.current.show({ severity: 'error', summary: 'Oops, Server Error', life: 6000 })
            })
            .catch(function (error) {
                toast.current.show({ severity: 'error', summary: 'Oops, Connection Error', life: 6000 })
            });
    }

    const HandleDeleteAttendant = async () => {
        dispatch(OPENLOADER())
        Apis({
            method: 'delete',
            url: `/operators/${SelectedRoCardInfo.id}`,
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                dispatch(CLOSELOADER())
                if (response.data.code === 200) {
                    dispatch(RerunFetchFunction())
                    tog_confirm_delete();
                    toast.current.show({ severity: 'success', summary: response.data.description, life: 6000 })
                }
                else {
                    toast.current.show({ severity: 'error', summary: response.data.description, life: 6000 })
                }
            })
            .catch((error) => { toast.current.show({ severity: 'error', summary: 'Server Error', life: 6000 }) })
    }

    const AttendantFormData = {
        first_name: first_name,
        last_name: last_name,
        mobile: mobile_number,
        supervisor: supervisor.value === 'TRUE' ? true : false,
        passcode: passcord,
        associated_service_station_id: CurrentServiceStationId === null ? '' : CurrentServiceStationId[0]
    }

    const HandleCreateAttendant = () => {
        dispatch(OPENLOADER())
        Apis({
            method: 'post',
            url: `/operators`,
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            data: AttendantFormData
        })
            .then(function (response) {
                dispatch(CLOSELOADER())
                if (response.data.code === 200) {
                    dispatch(RerunFetchFunction())
                    tog_signUpModals();
                    toast.current.show({ severity: 'success', summary: response.data.description, life: 6000 })
                }
                else {
                    toast.current.show({ severity: 'error', summary: response.data.description, life: 6000 })
                }
            })
            .catch((error) => {
                dispatch(CLOSELOADER())
                toast.current.show({ severity: 'error', summary: 'Server Error', life: 6000 })
            })
    }

    document.title = 'Service-Station | Attendants'

    return (
        <div className="page-content ">
            <Container fluid className='pagecooooo'>
                <BreadCrumb title="Attendents" pageTitle="Service-Station  > Attendents" />
                <Row>
                    <Col>
                        <div className="h-100">
                            <Row>
                                <Toast ref={toast} />
                                <Col lg={12}>
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title mb-0">Cards Table</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <div>
                                                <Row className="g-4 mb-3">
                                                    <Col className="col-sm-auto">
                                                        <div>
                                                            <Button style={{ backgroundColor: '#009933' }} onClick={() => { exportExcel() }} color="success" className="add-btn me-1" id="create-btn"><i className="ri-file-excel-2-line align-bottom me-1"></i> Excel</Button>
                                                        </div>
                                                    </Col>
                                                    <Col className="col-sm">
                                                        <div className="d-flex justify-content-sm-end">
                                                            <Button style={{ backgroundColor: '#009933' }}
                                                                onClick={() => {
                                                                    tog_signUpModals()
                                                                    setUpEdit(true)
                                                                }} className="add-btn me-1" id="create-btn">Add New Attendant</Button>
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
                                                />
                                            </div>
                                        </CardBody>
                                    </Card>
                                    < Modal id="signupModals" tabIndex="-1" isOpen={modal_signUpModals} centered >
                                        <ModalHeader className="p-3" toggle={() => { tog_signUpModals(); }}>
                                            Add New Attendant
                                        </ModalHeader>
                                        <ModalBody>
                                            <Form onSubmit={(e) => {
                                                e.preventDefault();
                                                if (passcord !== confirm_passcord) {
                                                    toast.current.show({ severity: 'error', summary: `passwords not matching reenter`, life: 3000 })
                                                }
                                                else {
                                                    if (supervisor !== '') {
                                                        HandleCreateAttendant()
                                                    }
                                                    else toast.current.show({ severity: 'error', summary: `Please select supervisor`, life: 3000 })
                                                }
                                            }}>
                                                <div className="row g-3">
                                                    <Col xxl={6}>
                                                        <div>
                                                            <label htmlFor="firstName" className="form-label">First Name</label>
                                                            <Input type="text" required className="form-control" placeholder="Enter first name" value={first_name || ''} onChange={Handlefirst_name} />
                                                        </div>
                                                    </Col>
                                                    <Col xxl={6}>
                                                        <div>
                                                            <label htmlFor="lastName" className="form-label">Last Name</label>
                                                            <Input type="text" required className="form-control" placeholder="Enter last name" value={last_name || ''} onChange={Handlelast_name} />
                                                        </div>
                                                    </Col>
                                                    <Col xxl={6}>
                                                        <label htmlFor="emailInput" className="form-label">Mobile Number</label>
                                                        <Input type="number" required className="form-control" placeholder="Enter mobile number" value={mobile_number || ''} onChange={Handlemobile_number} />
                                                    </Col>
                                                    <Col xxl={6}>
                                                        <Label htmlFor="readonlyPlaintext" className="form-label">Supervisor</Label>
                                                        <Select
                                                            value={supervisor}
                                                            onChange={(sortBy) => {
                                                                setsupervisor(sortBy);
                                                            }}
                                                            defaultInputValue={carddetails.status}
                                                            options={supervisorOption}
                                                            classNamePrefix="js-example-data-array"
                                                            isLoading={true}
                                                        />
                                                    </Col>

                                                    <Col xxl={6}>
                                                        <label htmlFor="emailInput" className="form-label">Passcord</label>
                                                        <Input type="password" required className="form-control" placeholder="Enter passcord" value={passcord || ''} onChange={Handlepasscord} />
                                                    </Col>
                                                    <Col xxl={6}>
                                                        <label htmlFor="passwordInput" className="form-label">Confirm Passcord</label>
                                                        <Input type="password" required className="form-control" placeholder="Confirm Passcord" value={confirm_passcord || ''} onChange={Handleconfirm_passcord} />
                                                    </Col>
                                                    {/* <div className="col-lg-12"> */}
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <Button type="submit" className="btn btn-primary" style={{ backgroundColor: "#009933" }}>Submit</Button>
                                                    </div>
                                                    {/* </div> */}
                                                </div>
                                            </Form>
                                        </ModalBody>
                                    </Modal >
                                    < Modal id="bottom-rightModal" className='modal-dialog-bottom-right modal-sm' tabIndex="-1" isOpen={confirm_delete} centered modalClassName="zoomIn">
                                        <ModalHeader className="p-3" toggle={() => { tog_confirm_delete(); }}>
                                            Warning
                                        </ModalHeader>
                                        <ModalBody>
                                            <form onSubmit={(e) => { e.preventDefault() }}>
                                                <div className="row g-3">
                                                    <div>
                                                        Are you sure you want to Delete Operator {SelectedRoCardInfo.first_name + " " + SelectedRoCardInfo.last_name}
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="hstack gap-2 justify-content-end">
                                                            <button type="submit" className="btn btn-danger" onClick={(e) => {
                                                                e.preventDefault()
                                                                tog_confirm_delete();
                                                            }}>Cancel</button>
                                                            <button type="submit" className="btn btn-primary" onClick={(e) => {
                                                                e.preventDefault()
                                                                HandleDeleteAttendant();
                                                            }}>Confirm</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </ModalBody>
                                    </Modal >
                                    < Modal id="signupModals" tabIndex="-1" isOpen={modal_UpdateAttendant} centered >
                                        <ModalHeader className="p-3" toggle={() => {
                                            tog_UpdateAttendant();
                                            setNothingChanged1(true)
                                            setNothingChanged2(true)
                                        }}>
                                            EDIT ATTENDANT DETAILS
                                        </ModalHeader>
                                        <ModalBody>
                                            <form onSubmit={(e) => { e.preventDefault(); tog_UpdateAttendant(); }}>
                                                <div className="mb-3">
                                                    <Label htmlFor="readonlyPlaintext" className="form-label">Attendant Name</Label>
                                                    <Input type="text" className="form-control" id="readonlyPlaintext" defaultValue={SelectedRoCardInfo.first_name + " " + SelectedRoCardInfo.last_name} readOnly />
                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="readonlyPlaintext" className="form-label">Supervisor Role</Label>
                                                    <Select
                                                        value={SupervisorSelect}
                                                        onChange={(sortBy) => {
                                                            setSupervisorSelect(sortBy);
                                                            setNothingChanged1(false)
                                                        }}
                                                        defaultInputValue={SelectedRoCardInfo.supervisor === true ? "YES" : "NO" || ""}
                                                        options={SupervisorSelectOption}
                                                        classNamePrefix="js-example-data-array"
                                                        isLoading={true}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="readonlyPlaintext" className="form-label">Status</Label>
                                                    <Select
                                                        value={operator_statusSelect}
                                                        onChange={(sortBy) => {
                                                            setoperator_statusSelect(sortBy);
                                                            setNothingChanged2(false)
                                                        }}
                                                        defaultInputValue={SelectedRoCardInfo.status || ""}
                                                        options={operator_statusSelectOption}
                                                        classNamePrefix="js-example-data-array"
                                                        isLoading={true}
                                                    />
                                                </div>
                                                <div className="text-end">
                                                    <button type="submit" className="btn btn-primary" onClick={() => {
                                                        if (NothingChanged1 === false || NothingChanged2 === false) {
                                                            HandleUpdateAttendant();
                                                        }
                                                        else toast.current.show({ severity: 'info', summary: `You didn't Select anything to change`, life: 6000 })
                                                    }}>Update Attendant</button>
                                                </div>
                                            </form>
                                        </ModalBody>
                                    </Modal >
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}

export default ST_Attendants