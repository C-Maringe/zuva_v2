const SERVICE_STATION_USER_INFO = 'SERVICE_STATION_USER_INFO'

export function ServiceStationUserInfo(company) {
    return {
        type: SERVICE_STATION_USER_INFO,
        company,
    }
}

const ServiceStationUserInfoIn = JSON.parse(sessionStorage.getItem('ServiceStationUserInfoIn'))

const defaultcompanystatus = [{ status: ServiceStationUserInfoIn }]

function ServiceStationUserInfoRedux(state = defaultcompanystatus, action) {
    switch (action.type) {
        case SERVICE_STATION_USER_INFO:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default ServiceStationUserInfoRedux;
