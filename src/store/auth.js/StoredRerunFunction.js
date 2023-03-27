const RERUN_FETCH_FUNCTION = 'RERUN_FETCH_FUNCTION'
const UNDO_RERUN_FETCH_FUNCTION = 'UNDO_RERUN_FETCH_FUNCTION'

export function RerunFetchFunction(company) { return { type: RERUN_FETCH_FUNCTION, company, } }

export function UndoRerunFetchFunction(company) { return { type: UNDO_RERUN_FETCH_FUNCTION, company } }

const StoredRerunFunctionRedux = JSON.parse(sessionStorage.getItem('StoredRerunFunctionRedux'))

const defaultStoredRerunFunctionRedux = [{ status: (StoredRerunFunctionRedux === true ? true : false) }]

function StoredRerunFunction(state = defaultStoredRerunFunctionRedux, action) {
    switch (action.type) {
        case RERUN_FETCH_FUNCTION:
            return [{ status: true }]
        case UNDO_RERUN_FETCH_FUNCTION:
            return [{ status: false }]; 
        default:
            return state;
    }
}

export default StoredRerunFunction;