import DataTable from "react-data-table-component";
import React, { useState } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button, Col, Row } from "reactstrap";
import moment from "moment";

const CardTransactionsCom = ({ CardTransData }) => {

    const newArr = CardTransData.map((data) => ({
        id: data.id, amount: (data.amount / 100).toFixed(2), litres: data.litres, description: data.description,
        created_at: data.created_at, status: data.status, pan: data.pan, credit: (data.credit / 100).toFixed(2), debit: (data.debit / 100).toFixed(2)
    })).sort(function (a, b) { return b.id - a.id })

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Date</span>,
            selector: row => moment(row.created_at).utc().format("YYYY-MM-DD HH:mm:ss"),
            sortable: true,
            grow: 2,
            wrap: true
        }
        ,
        {
            name: <span className='font-weight-bold fs-13'>Card Number</span>,
            selector: row => row.pan,
            sortable: true,
            grow: 3,
            wrap: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Amount</span>,
            selector: row => row.amount,
            sortable: true
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
            grow: 5,
            wrap: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Credit</span>,
            selector: row => row.credit,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Debit</span>,
            selector: row => row.debit,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            selector: row => row.status,
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

    return (
        <div>
            <Row className="g-4 mb-3">
                <Col className="col-sm-auto">
                    <div>
                        <Button style={{ backgroundColor: "#009933", color: 'white' }} onClick={() => { exportExcel() }} className="add-btn me-1" id="create-btn"><i className="ri-file-excel-2-line align-bottom me-1"></i> Excel</Button>
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
    )
}

export { CardTransactionsCom };