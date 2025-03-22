import React from 'react'
import ShipperNav from './ShipperNav'

function Shipperlayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ShipperNav />
            <main style={{ flexGrow: 1 }}>{children}</main>
        </div >
    )
}

export default Shipperlayout