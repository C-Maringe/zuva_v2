import { Col, Row, Button, Modal, ModalBody, ModalHeader, Label } from "reactstrap";
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";
import { IsTableNotLoading } from '../../store/auth.js/tableloadingStore';
import DataTable from "react-data-table-component";
import React, { useState, useRef, useEffect } from "react";
import moment from 'moment'
import Flatpickr from "react-flatpickr";
import { OPENLOADER, CLOSELOADER } from "../../store/auth.js/OpenLoader";
import { IsTableloading } from "../../store/auth.js/tableloadingStore";
import Apis from "../../Apis/Apis";
import { Toast } from 'primereact/toast';

const TransactionCom = () => {

    const toast = useRef(null);
    const dispatch = useDispatch()
    // name

    const storedTableloadingStatus = ([...useSelector(state => state.IsTableLoadingStore)].map((data) => data.status)[0])

    const UserDataInfo = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])

    const CurrentTransaStoredRedux = ([...useSelector(state => state.CurrentTransaStoredRedux)].map((data) => data.status)[0])

    const [SelectedTransactionTypes, setSelectedTransactionTypes] = useState({ value: "FILTER BY TXN TYPES" })

    const filterTransactionTypesOptions = SelectedTransactionTypes.value !== 'FILTER BY TXN TYPES' ? [{
        options: [
            { label: 'RESET', value: 'FILTER BY TXN TYPES' },
            { label: 'FUEL WITHDRAWAL', value: 'SALE' },
            { label: 'FUEL DEPOSIT', value: 'TOPUP' },
            { label: 'FUNDS TRANSFER', value: 'FUNDS TRANSFER' },
            { label: 'REVERSALS', value: 'REVERSAL' },
        ]
    }] : [{
        options: [
            { label: 'FUEL WITHDRAWAL', value: 'SALE' },
            { label: 'FUEL DEPOSIT', value: 'TOPUP' },
            { label: 'FUNDS TRANSFER', value: 'FUNDS TRANSFER' },
            { label: 'REVERSALS', value: 'REVERSAL' },
        ]
    }]

    const [newSearchedTransactions, setnewSearchedTransactions] = useState([])

    const newArr = newSearchedTransactions.length !== 0 || undefined ? newSearchedTransactions.map((data) => ({
        id: data.id, amount: (data.amount / 100).toFixed(2), litres: data.litres, description: data.description,
        date: data.created_at, status: data.status, pan: data.pan, reason: data.reason
    })).sort(function (a, b) { return b.id - a.id })
        .filter((data) =>
            SelectedTransactionTypes.value.includes('FILTER') ? data.description.includes('') : data.description.includes(SelectedTransactionTypes.value))
        : CurrentTransaStoredRedux === null ? [] : CurrentTransaStoredRedux.map((data) => ({
            id: data.id, amount: (data.amount / 100).toFixed(2), litres: data.litres, description: data.description,
            date: data.created_at, status: data.status, pan: data.pan, reason: data.reason
        })).sort(function (a, b) { return b.id - a.id })
            .filter((data) =>
                SelectedTransactionTypes.value.includes('FILTER') ? data.description.includes('') : data.description.includes(SelectedTransactionTypes.value))

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])

    const CardInStoredID = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Date</span>,
            selector: row => moment.parseZone(row.date).format("YYYY-MM-DD HH:mm:ss"),
            sortable: true,
            grow: 1.5,
            wrap: true
        }
        ,
        {
            name: <span className='font-weight-bold fs-13'>Amount</span>,
            selector: row => row.amount,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Card</span>,
            selector: row => row.pan === null ? `${CheckIfCompany ? UserDataInfo.model.name : ""} ACCOUNT` : row.pan,
            sortable: true,
            grow: 2.2,
            wrap: true
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
            grow: 3,
            wrap: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Reason</span>,
            selector: row => row.reason,
            sortable: true, wrap: true
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

    useEffect(() => {
        if (SelectedTransactionTypes.value === 'FILTER BY TXN TYPES') {
            setNewSearch('')
        }
    }, [SelectedTransactionTypes])

    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(filtered);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'transactions');
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

    const [modal_signUpModals, setmodal_signUpModals] = useState(false);
    function tog_signUpModals() { setmodal_signUpModals(!modal_signUpModals); }
    const [selectedRange1, setSelectedRange1] = useState('')
    const [selectedRange2, setSelectedRange2] = useState('')

    const date_selectedRange2 = new Date(moment.parseZone(selectedRange2).format("YYYY-MM-DD"));
    date_selectedRange2.setDate(date_selectedRange2.getDate() + 1);

    const newdataAcc = CheckIfCompany ? UserDataInfo.model.other_accounts.map((data) => ({ id: data.id })) : []

    const SearchTransactionsByDateData = {
        id: CheckIfCompany ? `(${newdataAcc[0].id}, ${newdataAcc[1].id})` : CardInStoredID.customer.id,
        startdate: selectedRange1,
        enddate: moment.parseZone(date_selectedRange2).add('1 day').format("YYYY-MM-DD")
    }

    const HandleSearchTransactionsByDate = () => {
        console.log(SearchTransactionsByDateData)
        dispatch(OPENLOADER())
        dispatch(IsTableloading())
        Apis.post(CheckIfCompany ? '/transactions/company/fetch' : '/transactions/customer/fetch', SearchTransactionsByDateData)
            .then(function (response) {
                if (response.status === 200) {
                    dispatch(CLOSELOADER())
                    dispatch(IsTableNotLoading())
                    setnewSearchedTransactions(response.data.data)
                    tog_signUpModals();
                    if (response.data.data.length === 0) {
                        toast.current.show({ severity: 'success', summary: 'There are no Transactions For the selected Period', life: 6000 })
                    }
                    else {
                        toast.current.show({ severity: 'success', summary: response.data.description, life: 6000 })
                    }
                }
                else toast.current.show({ severity: 'error', summary: 'Oops, Server Error', life: 6000 })
            })
            .catch(function (error) {
                dispatch(CLOSELOADER())
                dispatch(IsTableNotLoading())
                toast.current.show({ severity: 'error', summary: 'Oops, Connection Error', life: 6000 })
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
                        <Button style={{ backgroundColor: '#009933' }}
                            onClick={() => { tog_signUpModals() }}
                            className="add-btn me-1" id="create-btn">Get Transactions By Date</Button>
                        <Col xxl={3}>
                            <Select
                                value={SelectedTransactionTypes}
                                onChange={(sortBy) => {
                                    setSelectedTransactionTypes(sortBy)
                                }}
                                defaultInputValue={SelectedTransactionTypes.value}
                                options={filterTransactionTypesOptions}
                                classNamePrefix="js-example-data-array"
                                isLoading={true}
                            />
                        </Col>
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
                progressPending={storedTableloadingStatus}
            />
            < Modal id="signupModals" tabIndex="-1" isOpen={modal_signUpModals} centered modalClassName="zoomIn">
                <ModalHeader className="p-3" toggle={() => { tog_signUpModals(); }}>
                    Search Transactions By Date
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (selectedRange1 && selectedRange2 !== '') {
                            HandleSearchTransactionsByDate()
                        }
                        else {
                            toast.current.show({ severity: 'error', summary: 'Please select date to retrieve transactions', life: 6000 })
                        }
                    }}>
                        <div className="mb-3">
                            <Label className="form-label mb-0">Select Date Ranges</Label>
                            <Flatpickr
                                className="form-control"
                                options={{
                                    mode: "range",
                                    dateFormat: "Y-m-d"
                                }}
                                onClose={(selectedDates, dateStr, instance) => {
                                    try {
                                        setSelectedRange1(instance.formatDate(selectedDates[0], "Y-m-d"))
                                        setSelectedRange2(instance.formatDate(selectedDates[1], "Y-m-d"))
                                    } catch (error) {
                                        var failed_response = error
                                    }
                                }}
                            />
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal >
        </div>
    )
}

export { TransactionCom };