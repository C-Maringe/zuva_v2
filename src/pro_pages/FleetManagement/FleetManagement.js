import BreadCrumb from '../../Components/Common/BreadCrumb'
import { Col, Container, Row, Card, CardHeader, CardBody, Button, Table, Modal, Alert, ModalBody, ModalHeader, Label, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Toast } from 'primereact/toast';
import { OPENLOADER, CLOSELOADER } from "../../store/auth.js/OpenLoader";
import { IsBulkTransferProcess, IsNotBulkTransferProcess } from '../../store/auth.js/BulkTransfer';
import Apis from "../../Apis/Apis";
import { AiOutlineEye } from 'react-icons/ai'
import moment from 'moment'

//Import Flatepicker
import Flatpickr from "react-flatpickr";

const handleApplySelectedRows = (row) => {
    const carddetails = JSON.parse(sessionStorage.getItem('carddetails'))
    const ServiceStationSelectedRows = JSON.parse(sessionStorage.getItem('ServiceStationSelectedRows'))

    if (ServiceStationSelectedRows !== null ? ServiceStationSelectedRows.length !== 0 && ServiceStationSelectedRows.includes(row.id) : false) {
        return true
    }
    else if (JSON.stringify(carddetails) !== '{}' ? carddetails.fleet_data[0].service_station_ids.includes(row.id) : false) {
        return true;
    }
    else {
        return false;
    }
}

const FleetManagement = () => {

    const toast = useRef(null);
    const dispatch = useDispatch()

    const [fetchedFleetsData, setFetchedFleetsData] = useState([])
    const [selectedRowFromFetchedData, setSelectedRowFromFetchedData] = useState([])

    const [serviceStations, setServiceStations] = useState(JSON.parse(sessionStorage.getItem('storedServiceStations')) !== null ? JSON.parse(sessionStorage.getItem('storedServiceStations')) : [])

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

    const MoreTransactionsStoredRedux = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])

    const CardsInfoMoredetail = CheckIfCompany ? MoreTransactionsStoredRedux.model.cards.map((data) => ({
        id: data.id, customer_first_name: data.vehicle_results.map((data) => data.vehicle_owner)[0]
        , pan: data.pan, deposit_amount: data.deposit_amount / 100, status: data.status
    })) : []

    const senditems = CheckIfCompany === true ? CardsInfoMoredetail.map((data) => ({
        id: data.id, name: data.customer_first_name, pan: data.pan, deposit_amount: data.deposit_amount, status: data.status,
        fleet: fetchedFleetsData.filter(({ card_number }) => card_number.includes(data.pan)).length,
        fleet_data: fetchedFleetsData.filter(({ card_number }) => card_number.includes(data.pan))
    })) : UserInfoStoredLocally.customer.cards.map((data) => ({
        id: data.id, name: data.customer_first_name, pan: data.pan, deposit_amount: data.deposit_amount / 100, status: data.status,
        fleet: fetchedFleetsData.filter(({ card_number }) => card_number.includes(data.pan)).length,
        fleet_data: fetchedFleetsData.filter(({ card_number }) => card_number.includes(data.pan))
    }))

    const newArr = senditems.filter(({ pan }) => pan.includes('_'))

    const [carddetails, setcarddetails] = useState({})

    const [canViewFleets, setCanViewFleets] = useState(false)

    const [selectedIdForFleets, setSelectedIdForFleets] = useState(0)

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>Name</span>,
            selector: row => row.name,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Card Number</span>,
            selector: row => row.pan,
            sortable: true,
            wrap: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Fleet Assigned</span>,
            selector: row =>
                canViewFleets ? row.fleet === 1 ? 'Yes' : 'No' : 'Loading...',
            sortable: true,
        },
        {
            name: <span className='font-weight-bold fs-13'>Fleet Status</span>,
            selector: row =>
                canViewFleets ? row.fleet === 1 ? row.fleet_data[0].fleet_status ? 'Active' : 'Inactive' : 'Inactive' : 'Loading...',
            sortable: true,
        },
        {
            name: <span className='font-weight-bold fs-13'>Allowed Locations</span>,
            selector: row =>
                canViewFleets ? row.fleet === 1 ? row.fleet_data[0].service_station_ids.length : 0 : 'Loading...',
            sortable: true,
        },
        {
            name: <span className='font-weight-bold fs-13'>Fleets</span>,
            selector: row =>
                <>{canViewFleets ?
                    <Link to='#'>
                        <div className="custom-profileview" style={{ color: "color-#405189" }}
                        >{row.fleet === 1 ? <div
                            onClick={() => {
                                setcarddetails(row)
                                setSelectedIdForFleets(row.fleet_data[0].id)
                                toggleShowAddfleetModal()
                            }}>
                            <AiOutlineEye style={{ fontSize: "20px", color: "color-#405189" }} />
                            View fleet
                        </div> :
                            <div onClick={() => {
                                ResetFleetStates()
                                setcarddetails({})
                                setFleetsSelectedRows([row])
                                toggleShowAddfleetModal()
                            }}>Assign fleet
                            </div>
                            }</div>
                    </Link> :
                    <div>
                        Loading...
                    </div>}
                </>,
            sortable: true,
            wrap: true
        }
    ];

    const fetchFleets = () => {
        Apis.get(`/fleets/fetch/${CardInStoredID.company.id}`)
            .then((response) => {
                if (response.data.code === 200 || response.data.code === 202) {
                    toast.current.show({ severity: 'success', summary: response.data.message, life: 6000 })
                    setFetchedFleetsData(response.data.data)
                    sessionStorage.setItem('storedFetchedFleetsData', JSON.stringify(response.data.data));
                    setCanViewFleets(true)
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Server error', life: 6000 })
                }
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Server error', life: 6000 })
            })
    }

    useEffect(() => {
        if (JSON.parse(sessionStorage.getItem('storedFetchedFleetsData')) === null) {
            fetchFleets();
        }
        else {
            setFetchedFleetsData(JSON.parse(sessionStorage.getItem('storedFetchedFleetsData')))
            setCanViewFleets(true)
        }
        if (JSON.parse(sessionStorage.getItem('storedServiceStations')) === null) {
            Apis.get('/all/service-station')
                .then((response) => {
                    if (response.data.code === 200) {
                        setServiceStations(response.data.data)
                        sessionStorage.setItem('storedServiceStations', JSON.stringify(response.data.data));
                    }
                    else {
                        toast.current.show({ severity: 'error', summary: 'Oops, something went wrong, Check your network', life: 6000 })
                    }
                })
                .catch((error) => { setServiceStations([]) })
        }
        else {
            setServiceStations(JSON.parse(sessionStorage.getItem('storedServiceStations')))
        }
    }, [])

    const columns2 = useMemo(
        () => [
            {
                name: <span className='font-weight-bold fs-13'>Name</span>,
                selector: row => row.name,
                sortable: true
            },
            {
                name: <span className='font-weight-bold fs-13'>Location</span>,
                selector: row => row.address,
                sortable: true,
                wrap: true
            }
        ])


    useEffect(() => {
        if (JSON.stringify(carddetails) !== '{}' || fetchedFleetsData.length !== 0) {
            sessionStorage.setItem('carddetails', JSON.stringify(carddetails))
            setSelectedRowFromFetchedData(fetchedFleetsData.filter(({ card_number }) => card_number.includes(carddetails.pan)))
        }
    }, [carddetails, fetchedFleetsData])

    const [search, setNewSearch] = useState("");
    const handlesearch = (e) => { setNewSearch(e.target.value) }
    const column = Object.keys(newArr[0] || {});
    const filtered = !search ? newArr : newArr.filter((data) =>
        column.some((column) =>
            data[column] === null ? "" : data[column].toString()
                .toLowerCase().indexOf(search.toString().toLowerCase()) > -1
        )
    )

    const [search2, setNewSearch2] = useState("");
    const handlesearch2 = (e) => { setNewSearch2(e.target.value) }
    const column2 = serviceStations.length !== 0 ? Object.keys(serviceStations[0] || {}) : '';
    const filtered2 = !search2 ? serviceStations : serviceStations.filter((data) =>
        column2.some((column) =>
            data[column] === null ? "" : data[column].toString()
                .toLowerCase().indexOf(search2.toString().toLowerCase()) > -1
        )
    )

    const exportExcel2 = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(filtered);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile2(excelBuffer, 'service_stations');
        });
    }

    const saveAsExcelFile2 = (buffer, fileName) => {
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

    const [fleetsSelectedRows, setFleetsSelectedRows] = useState([])
    const [clearFleetsSelectedRows, setclearFleetsSelectedRows] = useState(false);
    const [canPerfomFleetsAddition, setCanPerfomFleetsAddition] = useState(false)
    const [showAddfleetModal, setShowAddfleetModal] = useState(false)
    const [serviceStationTableloading, setServiceStationTableloading] = useState(true)

    const toggleShowAddfleetModal = () => { setShowAddfleetModal(!showAddfleetModal) }

    const handleChange = ({ selectedRows }) => { setFleetsSelectedRows(selectedRows) };

    const handleClearFleetsSelectedRows = () => { setclearFleetsSelectedRows(!clearFleetsSelectedRows); }

    useEffect(() => {
        if (fleetsSelectedRows.length !== 0) {
            setCanPerfomFleetsAddition(true)
        }
        else {
            setCanPerfomFleetsAddition(false)
        }
    }, [fleetsSelectedRows])

    useEffect(() => {
        if (serviceStations.length !== 0) {
            setServiceStationTableloading(false)
        }
    }, [serviceStations])

    const [transactions, setTransactions] = useState(false)
    const [transactionsNumber, setTransactionsNumber] = useState('')
    const [transactionsDay, setTransactionsDay] = useState(false)
    const [transactionsWeek, setTransactionsWeek] = useState(false)
    const [transactionsMonth, setTransactionsMonth] = useState(false)

    const handletransactions = () => { setTransactions(!transactions) }
    const handletransactionsDay = () => { setTransactionsDay(!transactionsDay); setTransactionsWeek(false); setTransactionsMonth(false); }
    const handletransactionsWeek = () => { setTransactionsWeek(!transactionsWeek); setTransactionsDay(false); setTransactionsMonth(false); }
    const handletransactionsMonth = () => { setTransactionsMonth(!transactionsMonth); setTransactionsDay(false); setTransactionsWeek(false); }

    const [fuel, setfuel] = useState(false)
    const [fuelNumber, setfuelNumber] = useState('')
    const [fuelDay, setfuelDay] = useState(false)
    const [fuelWeek, setfuelWeek] = useState(false)
    const [fuelMonth, setfuelMonth] = useState(false)

    const handlefuel = () => { setfuel(!fuel) }
    const handlefuelDay = () => { setfuelDay(!fuelDay); setfuelWeek(false); setfuelMonth(false) }
    const handlefuelWeek = () => { setfuelWeek(!fuelWeek); setfuelDay(false); setfuelMonth(false) }
    const handlefuelMonth = () => { setfuelMonth(!fuelMonth); setfuelWeek(false); setfuelDay(false) }

    const [litres, setlitres] = useState(false)
    const [litresNumber, setlitresNumber] = useState('')

    const handlelitres = () => { setlitres(!litres) }

    const [timeRestrictions, settimeRestrictions] = useState(false)
    const [timeRestrictionsMinNumber, settimeRestrictionsMinNumber] = useState('')
    const [timeRestrictionsMaxNumber, settimeRestrictionsMaxNumber] = useState('')
    const [timeRestrictionsmonday, settimeRestrictionsmonday] = useState(false)
    const [timeRestrictionstuesday, settimeRestrictionstuesday] = useState(false)
    const [timeRestrictionswednesday, settimeRestrictionswednesday] = useState(false)
    const [timeRestrictionsthursday, settimeRestrictionsthursday] = useState(false)
    const [timeRestrictionsfriday, settimeRestrictionsfriday] = useState(false)
    const [timeRestrictionssaturday, settimeRestrictionssaturday] = useState(false)
    const [timeRestrictionssunday, settimeRestrictionssunday] = useState(false)

    const handletimeRestrictions = () => { settimeRestrictions(!timeRestrictions) }
    const handletimeRestrictionsmonday = () => { settimeRestrictionsmonday(!timeRestrictionsmonday) }
    const handletimeRestrictionstuesday = () => { settimeRestrictionstuesday(!timeRestrictionstuesday) }
    const handletimeRestrictionswednesday = () => { settimeRestrictionswednesday(!timeRestrictionswednesday) }
    const handletimeRestrictionsthursday = () => { settimeRestrictionsthursday(!timeRestrictionsthursday) }
    const handletimeRestrictionsfriday = () => { settimeRestrictionsfriday(!timeRestrictionsfriday) }
    const handletimeRestrictionssaturday = () => { settimeRestrictionssaturday(!timeRestrictionssaturday) }
    const handletimeRestrictionssunday = () => { settimeRestrictionssunday(!timeRestrictionssunday) }

    const CardInStoredID = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

    const [showServiceStations, setShowServiceStations] = useState(false)
    const [ServiceStationSelectedRows, setServiceStationSelectedRows] = useState([])
    const handleServiceStationSelectedChange = ({ selectedRows }) => { setServiceStationSelectedRows(selectedRows.map((data) => data.id)) };

    useEffect(() => {
        sessionStorage.setItem('ServiceStationSelectedRows', JSON.stringify(ServiceStationSelectedRows))
    }, [ServiceStationSelectedRows])

    const ResetFleetStates = () => {
        setTransactions(false)
        setTransactionsNumber('')
        setTransactionsDay(false)
        setTransactionsWeek(false)
        setTransactionsMonth(false)
        setfuel(false)
        setfuelNumber('')
        setfuelDay(false)
        setfuelWeek(false)
        setfuelMonth(false)
        setlitres(false)
        setlitresNumber('')
        settimeRestrictions(false)
        settimeRestrictionsMinNumber('')
        settimeRestrictionsMaxNumber('')
        settimeRestrictionsmonday(false)
        settimeRestrictionstuesday(false)
        settimeRestrictionswednesday(false)
        settimeRestrictionsthursday(false)
        settimeRestrictionsfriday(false)
        settimeRestrictionssaturday(false)
        settimeRestrictionssunday(false)
        setShowServiceStations(false)
    }

    const SaveFleetData = {
        admin: CardInStoredID.administrator.first_name,
        card_number: fleetsSelectedRows.map((data) => data.pan),
        fuel_per_transaction: transactionsNumber,
        daily_transaction_limit: transactionsDay ? true : null,
        weekly_transaction_limit: transactionsWeek ? true : null,
        monthly_transaction_limit: transactionsMonth ? true : null,
        fuel_per_day: fuelNumber,
        fuel_per_day_limit: fuelDay ? true : null,
        fuel_per_week_limit: fuelWeek ? true : null,
        fuel_per_month_limit: fuelMonth ? true : null,
        fuel_per_transaction_limit: litresNumber,
        start_time_restriction: timeRestrictionsMinNumber,
        end_time_restriction: timeRestrictionsMaxNumber,
        day_of_week_restriction: [
            timeRestrictionsmonday ? "Monday" : '',
            timeRestrictionstuesday ? "Tuesday" : '',
            timeRestrictionswednesday ? "Wednesday" : '',
            timeRestrictionsthursday ? "Thursday" : '',
            timeRestrictionsfriday ? "Friday" : '',
            timeRestrictionssaturday ? "Saturday" : '',
            timeRestrictionssunday ? "Sunday" : '',
        ].filter(item => item !== ''),
        fleet_status: true,
        service_station_ids: ServiceStationSelectedRows,
        company_id: CardInStoredID.company.id,
        transactions: transactions,
        fuel: fuel,
        litres: litres,
        time_restrictions: timeRestrictions
    }

    useEffect(() => {
        if (JSON.stringify(carddetails) !== '{}') {
            if (carddetails.fleet_data !== undefined) {
                setTransactions(carddetails.fleet_data[0].transactions)
                setTransactionsNumber(carddetails.fleet_data[0].fuel_per_transaction !== null ? carddetails.fleet_data[0].fuel_per_transaction : '')
                setTransactionsDay(carddetails.fleet_data[0].daily_transaction_limit)
                setTransactionsWeek(carddetails.fleet_data[0].weekly_transaction_limit)
                setTransactionsMonth(carddetails.fleet_data[0].monthly_transaction_limit)

                setfuel(carddetails.fleet_data[0].fuel)
                setfuelNumber(carddetails.fleet_data[0].fuel_per_day !== null ? carddetails.fleet_data[0].fuel_per_day : '')
                setfuelDay(carddetails.fleet_data[0].fuel_per_day_limit)
                setfuelWeek(carddetails.fleet_data[0].fuel_per_week_limit)
                setfuelMonth(carddetails.fleet_data[0].fuel_per_month_limit)

                setlitres(carddetails.fleet_data[0].litres)
                setlitresNumber(carddetails.fleet_data[0].fuel_per_transaction_limit !== null ? carddetails.fleet_data[0].fuel_per_transaction_limit : '')

                settimeRestrictions(carddetails.fleet_data[0].time_restrictions)
                settimeRestrictionsMinNumber(carddetails.fleet_data[0].start_time_restriction)
                settimeRestrictionsMaxNumber(carddetails.fleet_data[0].end_time_restriction)
                settimeRestrictionsmonday(carddetails.fleet_data[0].day_of_week_restriction.includes("Monday"))
                settimeRestrictionstuesday(carddetails.fleet_data[0].day_of_week_restriction.includes("Tuesday"))
                settimeRestrictionswednesday(carddetails.fleet_data[0].day_of_week_restriction.includes("Wednesday"))
                settimeRestrictionsthursday(carddetails.fleet_data[0].day_of_week_restriction.includes("Thursday"))
                settimeRestrictionsfriday(carddetails.fleet_data[0].day_of_week_restriction.includes("Friday"))
                settimeRestrictionssaturday(carddetails.fleet_data[0].day_of_week_restriction.includes("Saturday"))
                settimeRestrictionssunday(carddetails.fleet_data[0].day_of_week_restriction.includes("Sunday"))
            }
        }
    }, [carddetails])

    const handleChangeFleetStatus = () => {
        dispatch(OPENLOADER());
        Apis.post(`/fleets/change-status/${selectedIdForFleets}`, { fleet_status: !carddetails.fleet_data[0].fleet_status })
            .then((response) => {
                dispatch(CLOSELOADER())
                if (response.data.code === 200 || response.data.code === 202) {
                    toast.current.show({ severity: 'success', summary: response.data.message, life: 6000 })
                    fetchFleets();
                    toggleShowAddfleetModal();
                    ResetFleetStates();
                    handleClearFleetsSelectedRows();
                    setServiceStationSelectedRows([]);
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Server error', life: 6000 })
                }
            })
            .catch((error) => {
                dispatch(CLOSELOADER())
                toast.current.show({ severity: 'error', summary: 'Server error', life: 6000 })
            })
    }

    const handleSaveFleetData = () => {
        dispatch(OPENLOADER());
        if (JSON.stringify(carddetails) === '{}') {
            Apis.post('/fleets/fetch', SaveFleetData)
                .then((response) => {
                    dispatch(CLOSELOADER())
                    if (response.data.code === 200 || response.data.code === 202) {
                        toast.current.show({ severity: 'success', summary: response.data.message, life: 6000 })
                        fetchFleets();
                        toggleShowAddfleetModal();
                        ResetFleetStates();
                        setServiceStationSelectedRows([]);
                        handleClearFleetsSelectedRows();
                    }
                    else {
                        toast.current.show({ severity: 'error', summary: 'Server error', life: 6000 })
                    }
                })
                .catch((error) => {
                    dispatch(CLOSELOADER())
                    toast.current.show({ severity: 'error', summary: 'Server error', life: 6000 })
                })
        }
        else {
            Apis.put(`/fleets/fetch/${selectedIdForFleets}`, SaveFleetData)
                .then((response) => {
                    dispatch(CLOSELOADER())
                    if (response.data.code === 200 || response.data.code === 202) {
                        toast.current.show({ severity: 'success', summary: response.data.message, life: 6000 })
                        fetchFleets();
                        toggleShowAddfleetModal();
                        ResetFleetStates();
                        handleClearFleetsSelectedRows();
                        setServiceStationSelectedRows([]);
                    }
                    else {
                        toast.current.show({ severity: 'error', summary: 'Server error', life: 6000 })
                    }
                })
                .catch((error) => {
                    dispatch(CLOSELOADER())
                    toast.current.show({ severity: 'error', summary: 'Server error', life: 6000 })
                })
        }
    }

    document.title = 'Zuva | Fleet-Management'
    return (
        <div className="page-content">
            <Toast ref={toast} />
            <Container fluid className='pagecooooo' >
                <BreadCrumb title="Fleet-Management" pageTitle="Fleet-Management" />
                <Row>
                    <Col>
                        <div className="h-100">
                            <Row>
                                <Col xxl={8} >
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title mb-0">Available Cards</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row className="g-4 mb-3">
                                                <Col className="col-sm-auto">
                                                    <div>
                                                        <h5 className="card-title mb-0">Select cards to assign to a fleet:</h5>
                                                    </div>
                                                </Col>
                                                <Col className="col-sm">
                                                    <div className="d-flex justify-content-sm-end">
                                                        {canPerfomFleetsAddition &&
                                                            <Button style={{ backgroundColor: '#009933' }}
                                                                onClick={() => {
                                                                    toggleShowAddfleetModal();
                                                                }}
                                                                className="add-btn me-1" id="create-btn">Assign {fleetsSelectedRows.length === 1 ? 'fleet' : 'fleets'}</Button>}
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
                                                selectableRows
                                                onSelectedRowsChange={handleChange}
                                                clearSelectedRows={clearFleetsSelectedRows}
                                                selectableRowDisabled={row => row.fleet >= 1}
                                                highlightOnHover={true}
                                                striped={true}
                                            />

                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xxl={4}>
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title mb-0">Available Service Stations</h5>
                                        </CardHeader>
                                        <CardBody>
                                            {serviceStations.length !== 0 && <Row className="g-4 mb-3">
                                                <Col className="col-sm-auto">
                                                    <div>
                                                        <Button style={{ backgroundColor: "#009933" }} onClick={() => { exportExcel2() }} className="add-btn me-1" id="create-btn"><i className="ri-file-excel-2-line align-bottom me-1"></i> Excel</Button>
                                                    </div>
                                                </Col>
                                                <Col className="col-sm">
                                                    <div className="d-flex justify-content-sm-end">
                                                        <div className="search-box ms-2">
                                                            <input value={search2} onChange={handlesearch2} type="text" className="form-control search" placeholder="Search..." />
                                                            <i className="ri-search-line search-icon"></i>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>}
                                            <DataTable
                                                columns={columns2}
                                                data={filtered2}
                                                pagination
                                                highlightOnHover={true}
                                                striped={true}
                                                progressPending={JSON.parse(sessionStorage.getItem('storedServiceStations')) !== null ? false : serviceStationTableloading}
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Col >
                </Row >
            </Container >
            < Modal tabIndex="-1" isOpen={showAddfleetModal} className="modal-lg" centered modalClassName="zoomIn"
                backdrop={'static'}
                id='staticBackdrop'>
                <ModalHeader className="p-3" toggle={() => {
                    toggleShowAddfleetModal();
                    handleClearFleetsSelectedRows();
                    setFleetsSelectedRows([]);
                    ResetFleetStates();
                }}>{JSON.stringify(carddetails) !== '{}' ? 'Update fleet' :
                    `Assign new ${fleetsSelectedRows.length === 1 ? 'fleet' : 'fleets'}`}
                </ModalHeader>

                <ModalBody className="p-4">
                    {showServiceStations ?
                        <div>
                            <Col xxl={12}>
                                <Card>
                                    <CardHeader style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <h5 className="card-title mb-0">Available Service Stations</h5>
                                        <Button style={{ backgroundColor: "#009933" }} onClick={() => { setShowServiceStations(false) }}>Go back</Button>
                                    </CardHeader>
                                    <CardBody>
                                        {serviceStations.length !== 0 &&
                                            <Row className="g-4 mb-3">
                                                <Col className="col-sm">
                                                    <div className="d-flex justify-content-sm-end">
                                                        <div className="search-box ms-2">
                                                            <input value={search2} onChange={handlesearch2} type="text" className="form-control search" placeholder="Search..." />
                                                            <i className="ri-search-line search-icon"></i>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>}
                                        <DataTable
                                            columns={columns2}
                                            data={filtered2}
                                            pagination
                                            highlightOnHover={true}
                                            selectableRows
                                            selectableRowSelected={handleApplySelectedRows}
                                            onSelectedRowsChange={handleServiceStationSelectedChange}
                                            striped={true}
                                            progressPending={JSON.parse(sessionStorage.getItem('storedServiceStations')) !== null ? false : serviceStationTableloading}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </div> :
                        <>
                            <hr />
                            <Row className="gy-4">
                                <Col xxl={2} md={6}>
                                    <div className="form-check">
                                        <Input className="form-check-input" checked={transactions} type="checkbox" id="fleet-remember-check1" value={transactions}
                                            onChange={handletransactions}
                                        />
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" htmlFor="fleet-remember-check1">Transactions</Label>
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div className="form-check">
                                        <Input type="number" className="form-control" placeholder='number' onChange={(e) => { setTransactionsNumber(e.target.value) }} value={transactionsNumber} required />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div className="form-check">
                                        <Label style={{ marginLeft: 5 }} className="form-check-label">Transactions per : </Label>
                                    </div>
                                </Col>
                                <Col xxl={4} md={6} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div className="form-check">
                                        <Input className="form-check-input" type="radio" name="flexRadioTransaction" id="fleet-remember-check2"
                                            value={transactionsDay}
                                            checked={transactionsDay}
                                            onChange={handletransactionsDay}
                                        />
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" htmlFor="fleet-remember-check2">Day</Label>
                                    </div>
                                    <div className="form-check">
                                        <Input className="form-check-input" type="radio" name="flexRadioTransaction" id="fleet-remember-check3" value={transactionsWeek}
                                            checked={transactionsWeek}
                                            onChange={handletransactionsWeek}
                                        />
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" htmlFor="fleet-remember-check3">Week</Label>
                                    </div>
                                    <div className="form-check">
                                        <Input className="form-check-input" type="radio" name="flexRadioTransaction" id="fleet-remember-check4" value={transactionsMonth}
                                            checked={transactionsMonth}
                                            onChange={handletransactionsMonth}
                                        />
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" htmlFor="fleet-remember-check4">Month</Label>
                                    </div>
                                </Col>
                                {/* ####### */}
                                <Col xxl={2} md={6}>
                                    <div className="form-check">
                                        <Input className="form-check-input" type="checkbox" id="fleet-remember-check5" value={fuel}
                                            checked={fuel}
                                            onChange={handlefuel} />
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" htmlFor="fleet-remember-check5">Fuel</Label>
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div className="form-check">
                                        <Input type="number" className="form-control" placeholder='number' onChange={(e) => { setfuelNumber(e.target.value) }} value={fuelNumber} required />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div className="form-check">
                                        <Label style={{ marginLeft: 5 }} className="form-check-label">$ per : </Label>
                                    </div>
                                </Col>
                                <Col xxl={4} md={6} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div className="form-check">
                                        <Input className="form-check-input" type="radio" name="flexRadioFuel" id="fleet-remember-check6" value={fuelDay}
                                            checked={fuelDay}
                                            onChange={handlefuelDay} />
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" htmlFor="fleet-remember-check6">Day</Label>
                                    </div>
                                    <div className="form-check">
                                        <Input className="form-check-input" type="radio" name="flexRadioFuel" id="fleet-remember-check7" value={fuelWeek}
                                            checked={fuelWeek}
                                            onChange={handlefuelWeek} />
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" htmlFor="fleet-remember-check7">Week</Label>
                                    </div>
                                    <div className="form-check">
                                        <Input className="form-check-input" type="radio" name="flexRadioFuel" id="fleet-remember-check8" value={fuelMonth}
                                            checked={fuelMonth}
                                            onChange={handlefuelMonth} />
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" htmlFor="fleet-remember-check8">Month</Label>
                                    </div>
                                </Col>

                                <Col xxl={2} md={6}>
                                    <div className="form-check">
                                        <Input className="form-check-input" type="checkbox" id="fleet-remember-check9" value={litres}
                                            checked={litres}
                                            onChange={handlelitres} />
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" htmlFor="fleet-remember-check9">Fuel Per Transactions</Label>
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div className="form-check">
                                        <Input type="number" className="form-control" placeholder='number' onChange={(e) => { setlitresNumber(e.target.value) }} value={litresNumber} required />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div className="form-check">
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" >$ per pransactions</Label>
                                    </div>
                                </Col>
                                <Col xxl={4} md={6} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                                </Col>

                                {/* ###################### */}

                                <Col xxl={2} md={6}>
                                    <div className="form-check">
                                        <Input className="form-check-input" type="checkbox" id="fleet-remember-check10" value={timeRestrictions}
                                            checked={timeRestrictions}
                                            onChange={handletimeRestrictions} />
                                        <Label style={{ marginLeft: 5 }} className="form-check-label" htmlFor="fleet-remember-check10">Time Restrictions</Label>
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div className="form-check">
                                        <Flatpickr
                                            className="form-control"
                                            options={{
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "H:i",
                                                time_24hr: true,
                                            }}
                                            value={timeRestrictionsMinNumber}
                                            onChange={([date]) => {
                                                settimeRestrictionsMinNumber(moment(date).format('HH:mm'));
                                            }}
                                            placeholder='minimum time'
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xxl={3} md={6}>
                                    <div className="form-check" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Label style={{ marginRight: 5 }} className="form-check-label">To: </Label>
                                        <Flatpickr
                                            className="form-control"
                                            options={{
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "H:i",
                                                time_24hr: true,
                                            }}
                                            value={timeRestrictionsMaxNumber}
                                            onChange={([date]) => {
                                                settimeRestrictionsMaxNumber(moment(date).format('HH:mm'));
                                            }}
                                            placeholder='maximum time'
                                            required
                                        />
                                    </div>
                                </Col>

                                <Col xxl={4} md={6} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Input className="form-check-input" type="checkbox" id="fleet-remember-check11" value={timeRestrictionsmonday}
                                            checked={timeRestrictionsmonday}
                                            onChange={handletimeRestrictionsmonday} />
                                        <Label className="form-check-label" htmlFor="fleet-remember-check11">Mo</Label>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Input className="form-check-input" type="checkbox" id="fleet-remember-check12" value={timeRestrictionstuesday}
                                            checked={timeRestrictionstuesday}
                                            onChange={handletimeRestrictionstuesday} />
                                        <Label className="form-check-label" htmlFor="fleet-remember-check12">Tu</Label>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Input className="form-check-input" type="checkbox" id="fleet-remember-check13" value={timeRestrictionswednesday}
                                            checked={timeRestrictionswednesday}
                                            onChange={handletimeRestrictionswednesday} />
                                        <Label className="form-check-label" htmlFor="fleet-remember-check13">We</Label>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Input className="form-check-input" type="checkbox" id="fleet-remember-check14" value={timeRestrictionsthursday}
                                            checked={timeRestrictionsthursday}
                                            onChange={handletimeRestrictionsthursday} />
                                        <Label className="form-check-label" htmlFor="fleet-remember-check14">Th</Label>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Input className="form-check-input" type="checkbox" id="fleet-remember-check15" value={timeRestrictionsfriday}
                                            checked={timeRestrictionsfriday}
                                            onChange={handletimeRestrictionsfriday} />
                                        <Label className="form-check-label" htmlFor="fleet-remember-check15">Fr</Label>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Input className="form-check-input" type="checkbox" id="fleet-remember-check16" value={timeRestrictionssaturday}
                                            checked={timeRestrictionssaturday}
                                            onChange={handletimeRestrictionssaturday} />
                                        <Label className="form-check-label" htmlFor="fleet-remember-check16">Sa</Label>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Input className="form-check-input" type="checkbox" id="fleet-remember-check17" value={timeRestrictionssunday}
                                            checked={timeRestrictionssunday}
                                            onChange={handletimeRestrictionssunday} />
                                        <Label className="form-check-label" htmlFor="fleet-remember-check17">Su</Label>
                                    </div>
                                </Col>
                            </Row>
                            <hr />
                            <Alert className="alert-borderless alert-warning text-center mb-2 mx-2 mt-3" role="alert">
                                <Row className="gy-4">
                                    <Col xxl={3} md={6}>
                                        <div className="form-check" style={{ display: 'flex', flexDirection: 'Column', justifyContent: 'space-between' }}>
                                            <Label style={{ marginBottom: 10, backgroundColor: 'orange', padding: 10, color: 'white' }} className="form-check-label" htmlFor="fleet-remember-check1">Account </Label>
                                            <div  >Dollars</div>
                                        </div>
                                    </Col>
                                    <Col xxl={4} md={6}>
                                        <div className="form-check" style={{ display: 'flex', flexDirection: 'Column', justifyContent: 'space-between' }}>
                                            <Label style={{ marginBottom: 10, backgroundColor: 'orange', padding: 10, color: 'white' }} className="form-check-label" htmlFor="fleet-remember-check1">Vehicle Registration </Label>
                                            <Input type="number" className="form-control" placeholder='number' />
                                        </div>
                                    </Col>
                                    <Col xxl={5} md={6}>
                                        <div className="form-check" style={{ display: 'flex', flexDirection: 'Column', justifyContent: 'space-between' }}>
                                            <Label style={{ marginBottom: 10, backgroundColor: 'orange', padding: 10, color: 'white' }} className="form-check-label" htmlFor="fleet-remember-check1">Current Odometer Reading </Label>
                                            <Input type="number" className="form-control" placeholder='number' />
                                        </div>
                                    </Col>
                                    <Col xxl={5} md={6}>
                                        <div className="form-check" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'Column', justifyContent: 'space-between' }}
                                            onClick={() => setShowServiceStations(true)}>
                                            Allowed Locations {'>'}
                                        </div>
                                    </Col>
                                </Row>
                            </Alert>
                            <hr />
                        </>}
                    <div className="text-end">
                        {JSON.stringify(carddetails) !== '{}' ?
                            <div>
                                <button style={{ marginRight: 20 }} onClick={() => { handleChangeFleetStatus() }} className="btn btn-primary">
                                    {carddetails.fleet_data[0].fleet_status ? 'Deactivate Fleet' : 'Activate Fleet'}
                                </button>
                                <button type="submit" onClick={() => { handleSaveFleetData() }} className="btn btn-primary">Update</button>
                            </div>
                            :
                            <button type="submit" onClick={() => { handleSaveFleetData() }} className="btn btn-primary">Submit</button>}
                    </div>
                </ModalBody>
            </Modal >
        </div >
    )
}

export default FleetManagement