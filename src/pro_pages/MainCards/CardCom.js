import DataTable from "react-data-table-component";
import React, { useState, useEffect } from "react";
import { FiEdit } from 'react-icons/fi'
import { AiOutlineEye } from 'react-icons/ai'
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Col, Row } from "reactstrap";

const CardCom = ({ tog_signUpModals, setcarddetails, setUpEdit }) => {
    const dispatch = useDispatch()

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

    const MoreTransactionsStoredRedux = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])

    const SelectedRoCardInfo = ([...useSelector(state => state.SelectedCardDetails)].map((data) => data.status)[0])
    const CardsInfoMoredetail = CheckIfCompany ? MoreTransactionsStoredRedux.model.cards.map((data) => ({
        id: data.id, customer_first_name: data.vehicle_results.map((data) => data.vehicle_owner)[0]
        , pan: data.pan, deposit_amount: data.deposit_amount / 100, status: data.status
    })) : []

    useEffect(() => {
        sessionStorage.setItem('SelectedRoCardInfo', JSON.stringify(SelectedRoCardInfo))
    }, [SelectedRoCardInfo])

    const senditems = CheckIfCompany === true ? CardsInfoMoredetail.map((data) => ({
        id: data.id, name: data.customer_first_name, pan: data.pan, deposit_amount: data.deposit_amount, status: data.status
    })) : UserInfoStoredLocally.customer.cards.map((data) => ({
        id: data.id, name: data.customer_first_name, pan: data.pan, deposit_amount: data.deposit_amount / 100, status: data.status
    }))

    const newArr = senditems.filter(({ pan }) => pan.includes('_'))

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Name</span>,
            selector: row => row.name,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Card Number</span>,
            selector: row => row.pan,
            sortable: true,
            grow: 1.7
        },
        {
            name: <span className='font-weight-bold fs-13'>Balance</span>,
            selector: row => row.deposit_amount.toFixed(2),
            sortable: true
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
                    tog_signUpModals()
                    setUpEdit(true)
                }} />,
            sortable: true,
        }
        ,
        {
            name: <span className='font-weight-bold fs-13'>Profile</span>,
            selector: row => <Link to='/cards/profile'>
                <div className="custom-profileview" style={{ color: "color-#405189" }}
                    onClick={() => {
                        dispatch({ type: "SET_SELECTED_CARD_DETAILS", payload: row })
                    }} ><AiOutlineEye style={{ fontSize: "20px", color: "color-#405189" }} /> Profile</div></Link>,
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
            saveAsExcelFile(excelBuffer, 'cards');
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
            <Row className="g-4 mb-3">
                <Col className="col-sm-auto">
                    <div>
                        <Button style={{ backgroundColor: "#009933" }} onClick={() => { exportExcel() }} className="add-btn me-1" id="create-btn"><i className="ri-file-excel-2-line align-bottom me-1"></i> Excel</Button>
                    </div>
                </Col>
                <Col className="col-sm">
                    <div className="d-flex justify-content-sm-end">
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
    );
};

export { CardCom };