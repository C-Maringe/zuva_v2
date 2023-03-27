import React, { useState } from "react";
import { Col, Container, Row, Card, CardBody, CardHeader, Button } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb'
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const MainReports = () => {
    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])

    const DummyData = [
        { id: 5230, date: "2023-01-10 13:28:57", employee: "Jennifer Mungofa", company: "Casper Holdings", service_station: "Zuva Samora", card_number: "USD_6094480005000000037", vehicle_reg_number: "ADX 4255", mileage: "126778", price: "1.67", quantity: "10", value: "16.70", type: "diesel" },
        { id: 6460, date: "2023-01-12 14:28:57", employee: "Shylet Phiri", company: "Casper Holdings", service_station: "Haddons", card_number: "ZWL_6094480005000000035", vehicle_reg_number: "ABC 1256", mileage: "226458", price: "1.53", quantity: "15", value: "23.00", type: "petrol" },
        { id: 7445, date: "2023-01-13 15:28:57", employee: "Kelvin Dubee", company: "Casper Holdings", service_station: "Zuva Samora", card_number: "USD_6094480005000000036", vehicle_reg_number: "ACE 2453", mileage: "323021", price: "1.67", quantity: "9", value: "15.30", type: "diesel" },
        { id: 8920, date: "2023-01-14 17:28:57", employee: "Samatha Kativhu", company: "Casper Holdings", service_station: "Greendale", card_number: "ZWL_6094480005000000035", vehicle_reg_number: "AFF 4545", mileage: "214092", price: "1.67", quantity: "13", value: "21.70", type: "diesel" },
        { id: 10022, date: "2023-01-19 09:28:57", employee: "James Jinga", company: "Casper Holdings", service_station: "Haddons", card_number: "USD_6094480005000000037", vehicle_reg_number: "AEF 7731", mileage: "139856", price: "1.53", quantity: "22", value: "33.70", type: "petrol" },
    ]

    const columns = CheckIfCompany ? [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Transaction Date</span>,
            selector: row => row.date,
            sortable: true,
            grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Employee Name</span>,
            selector: row => row.employee,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Company Name</span>,
            selector: row => row.company,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Service Station</span>,
            selector: row => row.service_station,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>Card Number</span>,
            selector: row => row.card_number,
            sortable: true,
            grow: 3
        },
        {
            name: <span className='font-weight-bold fs-13'>Vehicle Reg Number</span>,
            selector: row => row.vehicle_reg_number,
            sortable: true,
            grow: 1.5
        },
        {
            name: <span className='font-weight-bold fs-13'>Mileage</span>,
            selector: row => row.mileage,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Fuel Price</span>,
            selector: row => row.price,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Fuel Quantity</span>,
            selector: row => row.quantity,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Total Value</span>,
            selector: row => row.value,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Product Type</span>,
            selector: row => row.type,
            sortable: true
        }
    ] : [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Transaction Date</span>,
            selector: row => row.date,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Employee Name</span>,
            selector: row => row.employee,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Company Name</span>,
            selector: row => row.company,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Service Station</span>,
            selector: row => row.service_station,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Card Number</span>,
            selector: row => row.card_number,
            sortable: true,
        },
        {
            name: <span className='font-weight-bold fs-13'>Vehicle Reg Number</span>,
            selector: row => row.vehicle_reg_number,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Mileage</span>,
            selector: row => row.mileage,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Fuel Price</span>,
            selector: row => row.price,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Fuel Quantity</span>,
            selector: row => row.quantity,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Value(Quantity X Price)</span>,
            selector: row => row.value,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Product Type</span>,
            selector: row => row.type,
            sortable: true,
        }
    ]

    const [search, setNewSearch] = useState("");
    const handlesearch = (e) => { setNewSearch(e.target.value) }
    const column = Object.keys(DummyData[0] || {});
    const filtered = !search ? DummyData : DummyData.filter((data) =>
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
            saveAsExcelFile(excelBuffer, 'Reports');
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
        <div className="page-content ">
            <Container fluid className='pagecooooo'>
                <BreadCrumb title="Reports" pageTitle="Reports" />
                <Row style={{ paddingTop: 20 }}>
                    <Col>
                        <div className="h-100">
                            <Row>
                                <Col lg={12}>
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title mb-0">Transaction Reports Table</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <div>
                                                <Row className="g-4 mb-3">
                                                    <Col className="col-sm-auto">
                                                        <div>
                                                            <Button onClick={() => { exportExcel() }} color="success" className="add-btn me-1" id="create-btn"><i className="ri-file-excel-2-line align-bottom me-1"></i> Excel</Button>
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
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MainReports