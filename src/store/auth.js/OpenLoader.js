const OPEN_LOADER = 'OPEN_LOADER'
const CLOSE_LOADER = 'CLOSE_LOADER'

export function OPENLOADER(company) { return { type: OPEN_LOADER, company, } }

export function CLOSELOADER(company) { return { type: CLOSE_LOADER, company } }

const DEFAULTLOADERSTATUS = [{ status: ( false) }]

function TOGGLELOADER(state = DEFAULTLOADERSTATUS, action) {
    switch (action.type) {
        case OPEN_LOADER:
            return [{ status: true }]
        case CLOSE_LOADER:
            return [{ status: false }];
        default:
            return state;
    }
}

export default TOGGLELOADER;