import React from 'react'
import CartNav from './CartNav'

function CartLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <CartNav />
            <main style={{ flexGrow: 1 }}>{children}</main>
        </div >
    )
}

export default CartLayout