import Footer from "../components/Footer"
import Header from "../components/Header"

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main style={{ marginTop: '6em', marginBottom: '2em', flexGrow: 1 }}>{children}</main>
                <Footer />
            </div>
        </>
    )
}

export default MainLayout