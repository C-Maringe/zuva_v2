const IS_TABLE_LOADING = 'IS_TABLE_LOADING'
const TABLE_NOT_LOADING = 'TABLE_NOT_LOADING'

export function IsTableloading(company) { return { type: IS_TABLE_LOADING, company, } }

export function IsTableNotLoading(company) { return { type: TABLE_NOT_LOADING, company } }

const storedTableloadingStatus = JSON.parse(sessionStorage.getItem('storedTableloadingStatus'))

const defaultstoredTableloadingStatus = [{ status: (storedTableloadingStatus === false ? false : true) }]

function IsTableLoadingStore(state = defaultstoredTableloadingStatus, action) {
    switch (action.type) {
        case IS_TABLE_LOADING:
            return [{ status: true }]
        case TABLE_NOT_LOADING:
            return [{ status: false }];
        default:
            return state;
    }
}

export default IsTableLoadingStore;