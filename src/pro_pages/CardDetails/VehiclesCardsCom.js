import DataTable from "react-data-table-component";
import React, { useState } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useSelector } from "react-redux";
import { Button, Col, Row } from "reactstrap";

const VehiclesCards = ({ UserCardData, CardDataStoredLocally }) => {

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const newArr = CheckIfCompany ? UserCardData.vehicle_results : CardDataStoredLocally.vehicles

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Owner</span>,
            selector: row => row.vehicle_owner,
            sortable: true
        }
        ,
        {
            name: <span className='font-weight-bold fs-13'>Make</span>,
            selector: row => row.make,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Model</span>,
            selector: row => row.model,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Reg Number</span>,
            selector: row => row.reg_number,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Fuel Type</span>,
            selector: row => row.fuel_type,
            sortable: true
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
            saveAsExcelFile(excelBuffer, 'vehicles');
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
                        <Button style={{ backgroundColor: "#009933", color: 'white' }} onClick={() => { exportExcel() }} color="success" className="add-btn me-1" id="create-btn"><i className="ri-file-excel-2-line align-bottom me-1"></i> Excel</Button>
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
            />
        </div>
    )
}

export { VehiclesCards };