import React, { useState, useRef } from 'react';
import { CardCom } from './CardCom';
import { Card, CardBody, CardHeader, Col, Modal, ModalBody, ModalHeader, Label, Input } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";
import { Toast } from 'primereact/toast';
import Apis from '../../Apis/Apis';
import { RerunFetchFunction } from '../../store/auth.js/StoredRerunFunction';

const CardsTable = () => {

    const dispatch = useDispatch()

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const CardInStoredID = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])
    const toast = useRef(null);

    const [modal_signUpModals, setmodal_signUpModals] = useState(false);
    function tog_signUpModals() { setmodal_signUpModals(!modal_signUpModals); }

    const [UpEdit, setUpEdit] = useState(false)

    const [carddetails, setcarddetails] = useState({ value: "value", pan: "", status: "" })

    const [AccountSelect, setAccountSelect] = useState({ label: "", value: "" })

    const [NothingChanged, setNothingChanged] = useState(true)

    const AccountSelectOption = [{ options: [{ label: "ACTIVE", value: "ACTIVE" }, { label: "BLOCKED", value: "BLOCKED" }] }];

    const HandleUpdateCardStatusdata = {
        pan: carddetails.pan,
        id: CheckIfCompany ? CardInStoredID.cards.length === 0 ? null : CardInStoredID.cards.filter(({ pan }) => pan.includes(carddetails.pan))[0].id : CardInStoredID.customer.cards.length === 0 ? null : CardInStoredID.customer.cards.filter(({ pan }) => pan.includes(carddetails.pan))[0].id,
        status: NothingChanged ? carddetails.status : AccountSelect.value,
    }

    const userToken = ([...useSelector(state => state.UserToken)].map((data) => data.status)[0][0])

    const HandleUpdateCardStatus = async () => {
        Apis({
            method: 'post', url: "/card/update-status",
            mode: "cors",
            headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
            data: JSON.stringify(HandleUpdateCardStatusdata)
        })
            .then(function (response) {
                setNothingChanged(true)
                if (response.status === 200) {
                    dispatch(RerunFetchFunction())
                    setAccountSelect({ label: "", value: "" })
                    toast.current.show({ severity: 'success', summary: response.data.description, life: 6000 })
                }
                else toast.current.show({ severity: 'error', summary: 'Oops, Server Error', life: 6000 })
            })
            .catch(function (error) {
                toast.current.show({ severity: 'error', summary: 'Oops, Connection Error', life: 6000 })
            });
    }

    document.title = "Zuva | Client-Cards";
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <Col lg={12}>
                <Card>
                    <CardHeader>
                        <h5 className="card-title mb-0">Cards Table</h5>
                    </CardHeader>
                    <CardBody>
                        <CardCom setUpEdit={setUpEdit} setcarddetails={setcarddetails} tog_signUpModals={tog_signUpModals} />
                    </CardBody>
                </Card>
                < Modal id="signupModals" tabIndex="-1" isOpen={modal_signUpModals} centered >
                    <ModalHeader className="p-3" toggle={() => { tog_signUpModals(); }}>
                        EDIT CARD STATUS
                    </ModalHeader>
                    <ModalBody>
                        <form onSubmit={(e) => { e.preventDefault(); tog_signUpModals(); }}>
                            <div className="mb-3">
                                <Label htmlFor="readonlyPlaintext" className="form-label">Card Holder Name</Label>
                                <Input type="text" className="form-control" id="readonlyPlaintext" defaultValue={carddetails.name} readOnly />
                            </div>
                            <div className="mb-3">
                                <Label htmlFor="readonlyPlaintext" className="form-label">Card Number</Label>
                                <Input type="text" className="form-control" id="readonlyPlaintext" defaultValue={carddetails.pan} readOnly />
                            </div>
                            <div className="mb-3">
                                <Label htmlFor="readonlyPlaintext" className="form-label">Status</Label>
                                <Select
                                    value={AccountSelect}
                                    onChange={(sortBy) => {
                                        setAccountSelect(sortBy);
                                        setNothingChanged(false)
                                    }}
                                    defaultInputValue={carddetails.status}
                                    options={AccountSelectOption}
                                    classNamePrefix="js-example-data-array"
                                    isLoading={true}
                                />
                            </div>
                            <div className="text-end">
                                <button type="submit" className="btn btn-primary" onClick={() => {
                                    if (NothingChanged === true) {
                                        toast.current.show({ severity: 'info', summary: `You didn't Change the Status`, life: 6000 })
                                    }
                                    else HandleUpdateCardStatus();
                                }}>Update Card</button>
                            </div>
                        </form>
                    </ModalBody>
                </Modal >
            </Col>
        </React.Fragment>
    );
};

export default CardsTable;
