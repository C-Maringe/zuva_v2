const IS_SERVICE_STATION = 'IS_SERVICE_STATION'
const NOT_SERVICE_STATION = 'NOT_SERVICE_STATION'

export function IsServiceStationNow(company) { return { type: IS_SERVICE_STATION, company, } }

export function IsNotServiceStationNow(company) { return { type: NOT_SERVICE_STATION, company } }

const storedIsServiceStation = JSON.parse(sessionStorage.getItem('storedIsServiceStation'))

const defaultstoredIsServiceStation = [{ status: (storedIsServiceStation === true ? true : false) }]

function IsServiceStation(state = defaultstoredIsServiceStation, action) {
    switch (action.type) {
        case IS_SERVICE_STATION:
            return [{ status: true }]
        case NOT_SERVICE_STATION:
            return [{ status: false }];
        default:
            return state;
    }
}

export default IsServiceStation;