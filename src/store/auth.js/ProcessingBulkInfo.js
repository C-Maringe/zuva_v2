const BULK_TRANSFER_INFO = 'BULK_TRANSFER_INFO'

export function setTokenn(company) {
    return {
        type: BULK_TRANSFER_INFO,
        company,
    }
}

const storedBulkTransInfo = JSON.parse(sessionStorage.getItem('storedBulkTransInfo'))

const defaultBulkTransInfo = [{ status: [storedBulkTransInfo] }]

function ProcessingBulkTransferInfo(state = defaultBulkTransInfo, action) {
    switch (action.type) {
        case BULK_TRANSFER_INFO:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default ProcessingBulkTransferInfo;
