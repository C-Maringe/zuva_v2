import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='page-NotFound-container' style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                Error: 404!  |  Page Not Found
            </div>
            <div style={{ marginTop: 30 }}>
                <Link to='/'>
                    Click here to go home
                </Link>
            </div>
        </div>
    )
}

export default NotFound