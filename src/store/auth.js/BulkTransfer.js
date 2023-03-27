const IS_BULK_TRANSFER = 'IS_BULK_TRANSFER'
const IS_NOT_BULK_TRANSFER = 'IS_NOT_BULK_TRANSFER'

export function IsBulkTransferProcess(company) { return { type: IS_BULK_TRANSFER, company, } }

export function IsNotBulkTransferProcess(company) { return { type: IS_NOT_BULK_TRANSFER, company } }

const storeddefaultIsBulkTranfer = JSON.parse(sessionStorage.getItem('storeddefaultIsBulkTranfer'))

const defaultIsBulkTranfer = [{ status: (storeddefaultIsBulkTranfer === true ? true : false) }]

function IsBulkTransfer(state = defaultIsBulkTranfer, action) {
    switch (action.type) {
        case IS_BULK_TRANSFER:
            return [{ status: true }]
        case IS_NOT_BULK_TRANSFER:
            return [{ status: false }];
        default:
            return state;
    }
}

export default IsBulkTransfer;