import React, { useEffect, useState, useRef } from 'react';
import Select from "react-select";
import {
    Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, Input, TabPane, Container
    , CardHeader, Button, Modal, ModalBody, ModalHeader, Form, Label
} from 'reactstrap';

import { Toast } from 'primereact/toast';
import classnames from 'classnames';
import SwiperCore, { Autoplay } from "swiper";
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CLOSELOADER, OPENLOADER } from "../../store/auth.js/OpenLoader";
import { RerunFetchFunction } from '../../store/auth.js/StoredRerunFunction';
import Apis from '../../Apis/Apis';
import DataTable from "react-data-table-component";
import { read, utils } from 'xlsx';
import { IsBulkTransferProcess, IsNotBulkTransferProcess } from '../../store/auth.js/BulkTransfer';

const TransferCom = () => {
    const dispatch = useDispatch()

    const [DescriptionReceived, setDescriptionReceived] = useState("")

    const [toast_severity, settoast_severity] = useState('')
    const toast = useRef(null);

    const storedTableloadingStatus = ([...useSelector(state => state.IsTableLoadingStore)].map((data) => data.status)[0])

    const showError = () => { toast.current.show({ severity: toast_severity, summary: DescriptionReceived, life: 6000 }) }

    const [AccountSelect, setAccountSelect] = useState({ value: "" })
    const [AccountSelect1, setAccountSelect1] = useState({ value: "" })
    const [ReasonSelect, setReasonSelect] = useState({ label: "FUEL TOP UP", value: "FUEL TOP UP" })
    const [CardNumberSelect, setCardNumberSelect] = useState({ value: "" })
    const [CardNumberSelectIDsReceive, setCardNumberSelectIDsReceive] = useState({ value: "" })
    const [CardNumberSelectReceive, setCardNumberSelectReceive] = useState({ value: "" })
    const [Amount, setAmount] = useState(0)

    const HandleAmountChange = (e) => { setAmount(e.target.value) }

    SwiperCore.use([Autoplay])

    const [activeTab, setActiveTab] = useState('1')

    const toggleTab = (tab) => {
        if (activeTab !== tab) { setActiveTab(tab); }
    };

    const CardsDataSelect = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

    const MoreTransactionsStoredRedux = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])

    const datatass = MoreTransactionsStoredRedux.model.cards.map(({
        vehicle_results, ...rest }) => ({ ...rest, cardholder: vehicle_results.map((data) => data.vehicle_owner)[0] }))

    const AccountsDatas = ([...useSelector(state => state.CompanyID)].map((data) => data.status)[0])
    const AccountsDatasIDSelect = AccountsDatas.map((data) => ({
        label: " Account: " + data.account + "  BAL: $" + (data.deposit / 100).toFixed(2) + " Curr: " + data.currency, value: data.id
    }))

    const AccountSelectOption = [{ options: AccountsDatasIDSelect }];
    const ReasonSelectOption = [{ options: [{ label: "FUEL TOP UP", value: "FUEL TOP UP" },], },];

    const CardNumberSelectOption = [{
        options: datatass.filter(({ pan }) => pan.includes('_')).map((data) => (
            { label: "User: " + (data.cardholder === undefined ? "no_name" : data.cardholder) + "  BAL: $" + (data.deposit_amount / 100).toFixed(2) + "  Card No: " + data.pan + " Curr: " + data.currency, value: data.pan }))
    },]
    const CardNumberSelectIDSS = [{
        options: datatass.filter(({ pan }) => pan.includes('_')).map((data) => (
            { label: "User: " + (data.cardholder === undefined ? "no_name" : data.cardholder) + "  BAL: $" + (data.deposit_amount / 100).toFixed(2) + "  Card No: " + data.pan + " Curr: " + data.currency, value: data.id }))
    },]

    const HandleCardtoCard = {
        amount: Amount * 100,
        recipient_card_pan: CardNumberSelectReceive.value,
        source_card_pan: CardNumberSelect.value
    }

    const HandleCompanyToCard = {
        amount: Amount * 100,
        recipient_card_id: CardNumberSelectIDsReceive.value,
        company_id: AccountSelect.value,
        reason: ReasonSelect.value
    }

    const HandleCardToCompany = {
        amount: Amount * 100,
        source_card_pan: CardNumberSelect.value,
        recipient_account: AccountSelect1.value
    }

    const userToken = ([...useSelector(state => state.UserToken)].map((data) => data.status)[0][0])

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])

    const UserDataInfo = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])
    const newdataAcc = CheckIfCompany ? (UserDataInfo.model.other_accounts.map((data) => ({ account: data.account, balance: data.deposit / 100, id: data.id }))) : []
    const newdataAcc2 = CheckIfCompany ? (UserDataInfo.model.other_accounts.map((data) => ({ value: data.account, label: 'Account: ' + data.account + ' balance: ' + (data.deposit / 100).toFixed(2) }))) : []

    const [USD_ACCOUNT] = (newdataAcc.filter(({ account }) => account.includes("USD")))
    const [ZWL_ACCOUNT] = (newdataAcc.filter(({ account }) => !account.includes("USD")))

    const AccountsSelectOption = [{ options: newdataAcc2 }];

    const HandleTransferCardtoCard = () => {
        Apis({
            method: 'post', url: '/funds-transfer/company/card-to-card',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
            data: JSON.stringify(HandleCardtoCard)
        })
            .then(function (response) {
                setDescriptionReceived(response.data.description)
                setOpenNotify(true)
                dispatch(CLOSELOADER())
                if (response.data.description === 'Funds Allocated Successfully') {
                    settoast_severity('success')
                    dispatch(RerunFetchFunction())
                }
                else settoast_severity('error')
            })
            .catch(function (error) {
                setDescriptionReceived(error.data.description)
                setOpenNotify(true)
                dispatch(CLOSELOADER())
            });
    }

    const [OpenNotify, setOpenNotify] = useState(false)

    useEffect(() => {
        if (OpenNotify === true) {
            showError()
            setOpenNotify(false)
            if (DescriptionReceived === 'Funds Allocated Successfully') {
                setAccountSelect({ value: "" });
                setAccountSelect1({ value: "" });
                setReasonSelect({ label: "FUEL TOP UP", value: "FUEL TOP UP" });
                setCardNumberSelect({ value: "" });
                setCardNumberSelectIDsReceive({ value: "" });
                setCardNumberSelectReceive({ value: "" });
                setAmount(0)
            }
        }
    }, [OpenNotify, DescriptionReceived])

    const HandleTransferCompanytoCard = () => {
        Apis({
            method: 'post', url: '/funds-transfer/allocate',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
            data: JSON.stringify(HandleCompanyToCard)
        })
            .then(function (response) {
                setDescriptionReceived(response.data.description)
                setOpenNotify(true)
                dispatch(CLOSELOADER())
                if (response.data.description === 'Funds Allocated Successfully') {
                    settoast_severity('success')
                    dispatch(RerunFetchFunction())
                }
                else settoast_severity('error')
            })
            .catch(function (error) {
                setDescriptionReceived(error.data.description)
                setOpenNotify(true)
                dispatch(CLOSELOADER())
            });
    }

    const HandleTransferCardtoCompany = () => {
        Apis({
            method: 'post', url: '/funds-transfer/company/card-to-company',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
            data: JSON.stringify(HandleCardToCompany)
        })
            .then(function (response) {
                setDescriptionReceived(response.data.description)
                setOpenNotify(true)
                dispatch(CLOSELOADER())
                if (response.data.description === 'Funds Allocated Successfully') {
                    settoast_severity('success')
                    dispatch(RerunFetchFunction())
                }
                else settoast_severity('error')
            })
            .catch(function (error) {
                console.log(error)
                setDescriptionReceived(error.data.description)
                setOpenNotify(true)
                dispatch(CLOSELOADER())
            });
    }

    const newArr = [{ id: 1, employee_name: 'C Maringe', card_number: 'USD_6094480005000000001', amount: 10 }]
    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>employee_name</span>,
            selector: row => row.employee_name,
            sortable: true,
            grow: 1.5
        },
        {
            name: <span className='font-weight-bold fs-13'>card_number</span>,
            selector: row => row.card_number,
            sortable: true,
            grow: 1.5
        },
        {
            name: <span className='font-weight-bold fs-13'>amount</span>,
            selector: row => row.amount,
            sortable: true
        }
    ];

    const columns1 = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>employee_name</span>,
            selector: row => row.employee_name,
            sortable: true,
            grow: 2
        },
        {
            name: <span className='font-weight-bold fs-13'>card_number</span>,
            selector: row => row.card_number,
            sortable: true,
            grow: 2.5
        },
        {
            name: <span className='font-weight-bold fs-13'>amount</span>,
            selector: row => row.amount,
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
            saveAsExcelFile(excelBuffer, 'bulk_transaction_tamplate');
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

    const [importeddata, setimporteddata] = useState([])
    const onButtonClick = (event) => { event.target.nextElementSibling.click(); };
    var fileInput = document.getElementById("fileInput");

    const onFileChange = (event) => {
        const files = event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;
                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setimporteddata(rows)
                }
            }
            reader.readAsArrayBuffer(file);
        }
    };

    const [openModalTable, setOpenModalTable] = useState(false)

    const CardsTocheck = datatass.filter(({ pan }) => pan.includes('_'))

    const [rowsNotExisting1, setrowsNotExisting1] = useState([])
    const [rowsNotActive1, setrowsNotActive1] = useState([])
    const [rowsNotNumber1, setrowsNotNumber1] = useState([])

    const [canMakeBulkTransfer, setcanMakeBulkTransfer] = useState(false)
    const [bulkTransferData, setbulkTransferData] = useState([])

    useEffect(() => {
        if (importeddata.length > 0) {
            try {
                let TransData = [];
                let rowsNotExisting = []
                let rowsNotActive = []
                let rowsNotNumber = []
                let importeddata_usd = importeddata.filter(({ card_number }) => card_number.includes("USD")).reduce((totalValue, currentValue) => {
                    return totalValue + currentValue.amount;
                }, 0) || 0;
                let importeddata_zwl = importeddata.filter(({ card_number }) => !card_number.includes("USD")).reduce((totalValue, currentValue) => {
                    return totalValue + currentValue.amount;
                }, 0) || 0;

                if (importeddata_usd < USD_ACCOUNT.balance && importeddata_zwl < ZWL_ACCOUNT.balance) {
                    for (let i = 0; i < importeddata.length; i++) {
                        const newObjectTocheck = CardsTocheck.filter(({ pan }) => pan.includes(importeddata[i].card_number)) || [];
                        if (typeof importeddata[i].amount === 'number') {
                            if (i + 1 === importeddata.length && rowsNotExisting.length > 0) {
                                rowsNotExisting = [...rowsNotExisting, ...[i + 1]];
                                setcanMakeBulkTransfer(false)
                                toast.current.show({ severity: 'error', summary: `Error!!!, Card numbers on row number ${rowsNotExisting} does not exist `, life: 10000 })
                            }
                            else if (i + 1 === importeddata.length && rowsNotActive.length > 0) {
                                rowsNotActive = [...rowsNotActive, ...[i + 1]];
                                setcanMakeBulkTransfer(false)
                                toast.current.show({ severity: 'error', summary: `Error!!!, Card numbers on row number ${rowsNotActive} are not active `, life: 10000 })
                            }
                            if (i + 1 === importeddata.length && rowsNotNumber.length > 0) {
                                setcanMakeBulkTransfer(false)
                                toast.current.show({ severity: 'error', summary: `Error!!!, Amount on row number ${rowsNotNumber} is not a valid number `, life: 10000 })
                            }
                            else if (i + 1 === importeddata.length && newObjectTocheck.length > 0 && rowsNotExisting.length === 0 && rowsNotActive.length === 0 && rowsNotNumber.length === 0) {
                                if (newObjectTocheck[0].status === 'ACTIVE') {
                                    let newObject = {
                                        amount: importeddata[i].amount * 100,
                                        company_id: newObjectTocheck[0].currency === 'USD' ? USD_ACCOUNT.id : newObjectTocheck[0].currency === 'ZWL' ? ZWL_ACCOUNT.id : null,
                                        reason: "FUEL TOP UP",
                                        recipient_card_id: newObjectTocheck[0].id
                                    }
                                    TransData = [...TransData, newObject]
                                    setcanMakeBulkTransfer(true)
                                    toast.current.show({ severity: 'info', summary: `Valid excel details provided`, life: 3000 })
                                }
                                else {
                                    rowsNotActive = [...rowsNotActive, ...[i + 1]];
                                    setcanMakeBulkTransfer(false)
                                    toast.current.show({ severity: 'error', summary: `Error!!!, Card numbers on row number ${rowsNotActive} are not active `, life: 10000 })
                                }
                            }
                            else if (newObjectTocheck.length > 0) {
                                if (newObjectTocheck[0].status !== 'ACTIVE') {
                                    setcanMakeBulkTransfer(false)
                                    rowsNotActive = [...rowsNotActive, ...[i + 1]];
                                }
                                else {
                                    let newObject = {
                                        amount: importeddata[i].amount * 100,
                                        company_id: newObjectTocheck[0].currency === 'USD' ? USD_ACCOUNT.id : newObjectTocheck[0].currency === 'ZWL' ? ZWL_ACCOUNT.id : null,
                                        reason: "FUEL TOP UP",
                                        recipient_card_id: newObjectTocheck[0].id
                                    }
                                    TransData = [...TransData, newObject]
                                }
                            }
                            else {
                                rowsNotExisting = [...rowsNotExisting, ...[i + 1]];
                            }
                        }
                        else if (i + 1 === importeddata.length) {
                            rowsNotNumber = [...rowsNotNumber, ...[i + 1]];
                            setcanMakeBulkTransfer(false)
                            toast.current.show({ severity: 'error', summary: `Error!!!, Amount row number ${rowsNotNumber} is not a valid number `, life: 10000 })
                        }
                        else {
                            rowsNotNumber = [...rowsNotNumber, ...[i + 1]];
                        }
                    }
                    setrowsNotExisting1(rowsNotExisting)
                    setrowsNotActive1(rowsNotActive)
                    setbulkTransferData(TransData)
                    setrowsNotNumber1(rowsNotNumber)
                    setOpenModalTable(true)
                }
                else {
                    setOpenModalTable(true)
                    setcanMakeBulkTransfer(false)
                    toast.current.show({ severity: 'error', summary: `Error!!!, Your USD or ZWL account has insufficient balance to process funds transfer for all this cards`, life: 10000 })
                }
            } catch (error) {
                setcanMakeBulkTransfer(false)
                toast.current.show({ severity: 'error', summary: `Error 601, Invalid Excel format provided, please make sure there are no missing values on the file`, life: 10000 })
                console.log(error)
            }
        }
    }, [importeddata])

    let i = 0;
    let successTransfer = []
    let failTransfer = []

    function doAsync(item, callback) {
        Apis({
            method: 'post', url: '/funds-transfer/allocate',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
            data: JSON.stringify(bulkTransferData[i])
        })
            .then(function (response) {
                callback();
                if (response.data.description !== 'Funds Allocated Successfully') {
                    failTransfer = [...failTransfer, ...[i + 1], ...[response.data.description]];
                }
                else if (response.data.description === 'Funds Allocated Successfully') {
                    successTransfer = [...successTransfer, ...[i + 1]];
                }
            })
            .catch(function (error) {
                callback();
                failTransfer = [...failTransfer, ...[i + 1], ...[error.data.description]];
            });
    }

    function HandleTransferBulkCompanytoCard() {
        dispatch(OPENLOADER());
        dispatch(IsBulkTransferProcess())
        dispatch({ type: "BULK_TRANSFER_INFO", payload: [`Processing Card On row number ${i + 1}`] })
        if (bulkTransferData.length === i + 1) {
            Apis({
                method: 'post', url: '/funds-transfer/allocate',
                headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
                data: JSON.stringify(bulkTransferData[i])
            })
                .then(function (response) {
                    setDescriptionReceived(response.data.description)
                    setOpenNotify(true)
                    dispatch(CLOSELOADER())
                    setOpenModalTable(false)
                    dispatch(IsNotBulkTransferProcess())
                    i = 0
                    if (response.data.description === 'Funds Allocated Successfully') {
                        successTransfer = [...successTransfer, ...[i + 1]];
                        settoast_severity('success')
                        dispatch(RerunFetchFunction())
                        setimporteddata([])
                        setcanMakeBulkTransfer(false)
                        if (failTransfer.length !== 0) {
                            toast.current.show({ severity: 'error', summary: `Cards on row number ${failTransfer} failed`, life: 10000 })
                        }
                    }
                    else {
                        failTransfer = [...failTransfer, ...[i + 1], ...[response.data.description]];
                        settoast_severity('error')
                        if (failTransfer.length !== 0 && successTransfer.length !== 0) {
                            toast.current.show({ severity: 'success', summary: `Cards on row number ${successTransfer} were Sucessfull`, life: 10000 })
                            toast.current.show({ severity: 'error', summary: `Cards on row number ${failTransfer} failed`, life: 10000 })
                        }
                        else if (failTransfer.length !== 0) {
                            toast.current.show({ severity: 'error', summary: `Cards on row number ${failTransfer} failed`, life: 10000 })
                        }
                        i = 0;
                        dispatch(IsNotBulkTransferProcess())
                    }
                })
                .catch(function (error) {
                    dispatch(CLOSELOADER())
                    dispatch(IsNotBulkTransferProcess());
                    if (failTransfer.length !== 0 && successTransfer.length !== 0) {
                        toast.current.show({ severity: 'success', summary: `Cards on row number ${successTransfer} were Sucessfull`, life: 10000 })
                        toast.current.show({ severity: 'error', summary: `Cards on row number ${failTransfer} failed`, life: 10000 })
                    }
                    else if (failTransfer.length !== 0) {
                        toast.current.show({ severity: 'error', summary: `Cards on row number ${failTransfer} failed`, life: 10000 })
                    }
                    else {
                        setDescriptionReceived(error.data.description)
                        setOpenNotify(true)
                    }
                });
        }
        else if (i < bulkTransferData.length) {
            doAsync(bulkTransferData[i], () => {
                i = i + 1;
                HandleTransferBulkCompanytoCard();
            });
        }
        else {
            dispatch({ type: "BULK_TRANSFER_INFO", payload: [`All bulkTransferData processed`] })
        }
    }

    const page_location = window.location.href.includes('#') ? window.location.href.split("#")[1].split("/")[1] : '1'

    useEffect(() => {
        if (parseInt(page_location) >= 1) {
            toggleTab(page_location)
        }
    }, [page_location])

    return (
        <React.Fragment>
            <Toast ref={toast} />
            <Col lg={12}>
                <Nav pills className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                    role="tablist">
                    <NavItem>
                        <NavLink
                            href="#company-to-card/1"
                            className={classnames({ active: activeTab === '1' })}
                            onClick={() => { toggleTab('1'); }}
                        >
                            <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                className="d-none d-md-inline-block"><div style={{ color: "white" }}>COMPANY TO CARD TRANSFER</div></span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            href="#card-to-card/2"
                            className={classnames({ active: activeTab === '2' })}
                            onClick={() => { toggleTab('2'); }}
                        >
                            <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
                                className="d-none d-md-inline-block"><div style={{ color: "white" }}>CARD TO CARD TRANSFER</div></span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            href="#card-to-company/3"
                            className={classnames({ active: activeTab === '3' })}
                            onClick={() => { toggleTab('3'); }}
                        >
                            <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
                                className="d-none d-md-inline-block"><div style={{ color: "white" }}>CARD TO COMPANY TRANSFER</div></span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            href="#bulk-company-to-card/4"
                            className={classnames({ active: activeTab === '4' })}
                            onClick={() => { toggleTab('4'); }}
                        >
                            <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
                                className="d-none d-md-inline-block"><div style={{ color: "white" }}>BULK COMPANY TO CARD TRANSFER</div></span>
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={activeTab} className="pt-4">
                    <TabPane tabId="1">
                        <Row>
                            <Col xxl={12}>
                                <Card>
                                    <CardBody>
                                        <h5 className="card-title mb-3" >Company to Card Transfer</h5>
                                        <CardBody className="card-body">
                                            <div className="live-preview">
                                                <ToastContainer />
                                                <Row className="gy-4">
                                                    <Col xxl={3} md={6}>
                                                        <h6 className="fw-semibold">Account</h6>
                                                        <Select
                                                            value={AccountSelect}
                                                            onChange={(sortBy) => {
                                                                setAccountSelect(sortBy)
                                                            }}
                                                            options={AccountSelectOption}
                                                            classNamePrefix="js-example-data-array"
                                                            isLoading={true}
                                                        />
                                                    </Col>
                                                    <Col xxl={3} md={6}>
                                                        <div>
                                                            <h6 className="fw-semibold">Amount</h6>
                                                            <div className="form-icon right">
                                                                <Input type="number" className="form-control form-control-icon" id="iconrightInput" placeholder="$0.00"
                                                                    value={Amount} onChange={HandleAmountChange} />
                                                                <i className="ri-money-dollar-circle-line"></i>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xxl={3} md={6}>
                                                        <h6 className="fw-semibold">Card Number</h6>
                                                        <Select
                                                            value={CardNumberSelectIDsReceive}
                                                            onChange={(sortBy) => {
                                                                setCardNumberSelectIDsReceive(sortBy);
                                                            }}
                                                            options={CardNumberSelectIDSS}
                                                            classNamePrefix="js-example-data-array"
                                                            isLoading={true}
                                                        />
                                                    </Col>
                                                    <Col xxl={3} md={6}>
                                                        <h6 className="fw-semibold">Reason</h6>
                                                        <Select
                                                            value={ReasonSelect}
                                                            onChange={(sortBy) => {
                                                                setReasonSelect(sortBy);
                                                            }}
                                                            options={ReasonSelectOption}
                                                            classNamePrefix="js-example-data-array"
                                                            isLoading={true}
                                                        />
                                                    </Col>
                                                    <Col md={12}>
                                                        <div className="text-end">
                                                            <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#009933" }}
                                                                onClick={() => { dispatch(OPENLOADER()); HandleTransferCompanytoCard() }}>Submit</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col xxl={12}>
                                <Card>
                                    <CardBody>
                                        <h5 className="card-title mb-3">Card to Card Transfer</h5>
                                        <CardBody className="card-body">
                                            <div className="live-preview">
                                                <Row className="gy-4">
                                                    <Col xxl={3} md={6}>
                                                        <h6 className="fw-semibold">Source Card Number</h6>
                                                        <Select
                                                            value={CardNumberSelect}
                                                            onChange={(sortBy) => {
                                                                setCardNumberSelect(sortBy);
                                                            }}
                                                            options={CardNumberSelectOption}
                                                            classNamePrefix="js-example-data-array"
                                                            isLoading={true}
                                                        />
                                                    </Col>
                                                    <Col xxl={3} md={6}>
                                                        <div>
                                                            <h6 className="fw-semibold">Amount</h6>
                                                            <div className="form-icon right">
                                                                <Input type="number" className="form-control form-control-icon" id="iconrightInput" placeholder="$0.00"
                                                                    value={Amount} onChange={HandleAmountChange} />
                                                                <i className="ri-money-dollar-circle-line"></i>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xxl={3} md={6}>
                                                        <h6 className="fw-semibold">Destination Card Number</h6>
                                                        <Select
                                                            value={CardNumberSelectReceive}
                                                            onChange={(sortBy) => {
                                                                setCardNumberSelectReceive(sortBy);
                                                            }}
                                                            options={CardNumberSelectOption}
                                                            classNamePrefix="js-example-data-array"
                                                            isLoading={true}
                                                        />
                                                    </Col>
                                                    <Col xxl={3} md={6}>
                                                        <h6 className="fw-semibold">Reason</h6>
                                                        <Select
                                                            value={ReasonSelect}
                                                            onChange={(sortBy) => {
                                                                setReasonSelect(sortBy)
                                                            }}
                                                            options={ReasonSelectOption}
                                                            classNamePrefix="js-example-data-array"
                                                            isLoading={true}
                                                        />
                                                    </Col>
                                                    <Col md={12}>
                                                        <div className="text-end">
                                                            <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#009933" }}
                                                                onClick={() => { dispatch(OPENLOADER()); HandleTransferCardtoCard() }}>Submit</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
                        <Row>
                            <Col xxl={12}>
                                <Card>
                                    <CardBody>
                                        <h5 className="card-title mb-3">Card to Company Transfer</h5>
                                        <CardBody className="card-body">
                                            <div className="live-preview">
                                                <ToastContainer />
                                                <Row className="gy-4">
                                                    <Col xxl={3} md={6}>
                                                        <h6 className="fw-semibold">Card Number</h6>
                                                        <Select
                                                            value={CardNumberSelect}
                                                            onChange={(sortBy) => {
                                                                setCardNumberSelect(sortBy);
                                                            }}
                                                            options={CardNumberSelectOption}
                                                            classNamePrefix="js-example-data-array"
                                                            isLoading={true}
                                                        />
                                                    </Col>
                                                    <Col xxl={3} md={6}>
                                                        <div>
                                                            <h6 className="fw-semibold">Amount</h6>
                                                            <div className="form-icon right">
                                                                <Input type="number" className="form-control form-control-icon" id="iconrightInput" placeholder="$0.00"
                                                                    value={Amount} onChange={HandleAmountChange} />
                                                                <i className="ri-money-dollar-circle-line"></i>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col xxl={3} md={6}>
                                                        <h6 className="fw-semibold">Account</h6>
                                                        <Select
                                                            value={AccountSelect1}
                                                            onChange={(sortBy) => {
                                                                setAccountSelect1(sortBy)
                                                            }}
                                                            options={AccountsSelectOption}
                                                            classNamePrefix="js-example-data-array"
                                                            isLoading={true}
                                                        />
                                                    </Col>
                                                    <Col xxl={3} md={6}>
                                                        <h6 className="fw-semibold">Reason</h6>
                                                        <Select
                                                            value={ReasonSelect}
                                                            onChange={(sortBy) => {
                                                                setReasonSelect(sortBy);
                                                            }}
                                                            options={ReasonSelectOption}
                                                            classNamePrefix="js-example-data-array"
                                                            isLoading={true}
                                                        />
                                                    </Col>
                                                    <Col md={12}>
                                                        <div className="text-end">
                                                            <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#009933" }}
                                                                onClick={() => { dispatch(OPENLOADER()); HandleTransferCardtoCompany() }}>Submit</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="4">
                        <Row>
                            <Col xxl={12}>
                                <Card>
                                    <CardBody>
                                        <h5 className="card-title mb-3">Company to Card bulk Transfer</h5>
                                        <CardBody className="card-body">
                                            <div className="live-preview">
                                                <Row className="g-4 mb-3">
                                                    <Col className="col-sm-auto" style={{ "fontWeight": "600", "fontSize": "16px" }}>
                                                        Excel Tamplate
                                                    </Col>
                                                    <Col className="col-sm">
                                                        <div className="d-flex justify-content-sm-end">
                                                            <div>
                                                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#009933" }}
                                                                    onClick={() => { exportExcel() }}><i className="ri-file-excel-2-line align-bottom me-1"></i> Download Excel tamplate</button>
                                                            </div>
                                                            <button className="btn btn-primary" style={{ backgroundColor: "#009933", marginLeft: "20px" }} onClick={onButtonClick}>
                                                                <i className="ri-file-excel-2-line align-bottom me-1"></i>Import Excel File</button>
                                                            <input
                                                                type="file"
                                                                id='fileInput'
                                                                onClick={(e) => { e.target.value = null; }}
                                                                style={{ display: 'none' }}
                                                                onChange={onFileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <DataTable
                                                    columns={columns}
                                                    data={filtered}
                                                    highlightOnHover={true}
                                                    striped={true}
                                                    progressPending={storedTableloadingStatus}
                                                />
                                            </div>
                                        </CardBody>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </Col>
            <Modal isOpen={openModalTable} centered className="modal-lg"
                onClick={(e) => { e.preventDefault() }} modalClassName="zoomIn">
                <ModalHeader toggle={() => {
                    setOpenModalTable(false); setimporteddata([]); setcanMakeBulkTransfer(false);
                }}>
                    Imported Excel file
                </ModalHeader>
                <ModalBody>
                    <Row className="mt-3 pb-1">
                        <Col lg={12}>

                            <Row className="g-4 mb-3">
                                <Col className="col-sm-auto">
                                    {
                                        rowsNotExisting1.length === 0 && rowsNotActive1.length === 0 && rowsNotNumber1.length === 0 && canMakeBulkTransfer !== false ?
                                            <div>
                                                <Button onClick={() => { HandleTransferBulkCompanytoCard() }} style={{ backgroundColor: "#009933" }} className="add-btn me-1" id="create-btn">Transfer Funds</Button>
                                            </div> :
                                            <div>
                                                <button className="btn btn-primary" style={{ backgroundColor: "#009933" }} onClick={() => {
                                                    fileInput.click();
                                                }}>
                                                    <i className="ri-file-excel-2-line align-bottom me-1"></i>ReImport excel file</button>
                                            </div>
                                    }

                                </Col>
                            </Row>
                            <DataTable
                                columns={columns1}
                                data={importeddata}
                                pagination
                                highlightOnHover={true}
                                striped={true}
                            />
                        </Col>
                    </Row>
                </ModalBody>
            </Modal >
        </React.Fragment >
    );
};

export default TransferCom;