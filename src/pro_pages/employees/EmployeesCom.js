import DataTable from "react-data-table-component";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Card, Row, Button, Col, Modal, ModalBody, ModalHeader, Label, Input } from 'reactstrap';
import { Link } from "react-router-dom";
import { FiEdit } from 'react-icons/fi'
import { Toast } from 'primereact/toast';
import { OPENLOADER, CLOSELOADER } from "../../store/auth.js/OpenLoader";
import Apis from "../../Apis/Apis";

const EmployeesCom = ({ employe }) => {

    const toast = useRef(null);
    const dispatch = useDispatch()

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

    const senditems = UserInfoStoredLocally.vehicles.map((data) => ({
        id: data.id, vehicle_owner: data.vehicle_owner, email: data.email
        // fuel_type: data.fuel_type,
        // make: data.make, model: data.model, reg_number: data.reg_number
    }))

    const newArr = CheckIfCompany ? senditems : UserInfoStoredLocally.customer.vehicles

    const [employeeDetails, setEmployeeDetails] = useState({ email: '', vehicle_owner: '', id: '' })
    const [MakeAdminModal, setMakeAdminModal] = useState(false)

    const toggleMakeAdminModal = () => { setMakeAdminModal(!MakeAdminModal) }

    const [email, setEmail] = useState(employeeDetails.email)
    const handleEmailChange = (e) => { setEmail(e.target.value) }

    useEffect(() => {
        setEmail(employeeDetails.email)
    }, [employeeDetails])

    const payloadData = {
        email: email,
        company_id: CheckIfCompany ? UserInfoStoredLocally.company.id : 0,
        superadmin: CheckIfCompany ? UserInfoStoredLocally.administrator.id : 0,
        superadmin_email: CheckIfCompany ? UserInfoStoredLocally.administrator.email : '',
        superadmin_firstname: CheckIfCompany ? UserInfoStoredLocally.administrator.first_name : '',
    }

    const HandleMakeAdmin = () => {
        if (payloadData.email !== '' && payloadData.email.includes('@') && payloadData.email.includes('.')) {
            dispatch(OPENLOADER())
            Apis.post('company/confirm/make-admin', payloadData)
                .then(function (response) {
                    if (response.status === 200) {
                        dispatch(CLOSELOADER())
                        toggleMakeAdminModal();
                        if (response.data.code === 401) {
                            toast.current.show({ severity: 'error', summary: response.data.description, life: 6000 })
                        }
                        else { toast.current.show({ severity: 'success', summary: response.data.description, life: 6000 }) }
                    }
                    else toast.current.show({ severity: 'error', summary: 'Oops, Server Error', life: 6000 })
                })
                .catch(function (error) {
                    dispatch(CLOSELOADER())
                    toast.current.show({ severity: 'error', summary: 'Oops, Connection Error', life: 6000 })
                });
        }
        else {
            toast.current.show({ severity: 'error', summary: 'Invalid email entered', life: 6000 })
        }
    }

    const columns = CheckIfCompany ? [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Employee Name</span>,
            selector: row => row.vehicle_owner,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Email</span>,
            selector: row => row.email,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Make employee admin</span>,
            selector: row => <Link to='#'>
                <div className="custom-profileview" style={{ color: "color-#405189" }}
                    onClick={() => {
                        setEmployeeDetails(row)
                        toggleMakeAdminModal()
                    }} ><FiEdit style={{ fontSize: "20px", color: "color-#405189" }} /> make admin</div></Link>,
            sortable: true
        }
    ] : [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Employee Name</span>,
            selector: row => row.vehicle_owner,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Vehicle Make</span>,
            selector: row => row.make,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Vehicle Model</span>,
            selector: row => row.model,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Vehicle Reg Number</span>,
            selector: row => row.reg_number,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Fuel Type</span>,
            selector: row => row.fuel_type,
            sortable: true,
        }
    ]

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
            saveAsExcelFile(excelBuffer, 'employees');
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

    return (
        <div>
            <Toast ref={toast} />
            <Row className="g-4 mb-3">
                <Col className="col-sm-auto">
                    <div>
                        <Button style={{ backgroundColor: "#009933" }} onClick={() => { exportExcel() }} className="add-btn me-1" id="create-btn"><i className="ri-file-excel-2-line align-bottom me-1"></i> Excel</Button>
                    </div>
                </Col>
                <Col className="col-sm">
                    <div className="d-flex justify-content-sm-end">
                        {CheckIfCompany && <Button style={{ backgroundColor: '#009933' }}
                            onClick={() => {
                                toggleMakeAdminModal();
                                setEmployeeDetails({ vehicle_owner: 'Create new admin', email: '', id: '' })
                            }}
                            className="add-btn me-1" id="create-btn">Add new admin</Button>}
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
            < Modal id="signupModals" tabIndex="-1" isOpen={MakeAdminModal} centered modalClassName="zoomIn">
                <ModalHeader className="p-3" toggle={() => { toggleMakeAdminModal(); }}>
                    {employeeDetails.vehicle_owner === 'Create new admin' ? 'Create new admin' : 'Make ' + employeeDetails.vehicle_owner + ' an admin'}
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={(e) => { e.preventDefault(); HandleMakeAdmin(); }}>
                        <div className="mb-3">
                            <Label className="form-label">Email</Label>
                            <Input type="email" className="form-control" placeholder='email' onChange={handleEmailChange} value={email} required />
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal >
        </div>
    );
};

export { EmployeesCom };