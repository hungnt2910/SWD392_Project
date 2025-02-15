import Footer from "../components/Footer"
import Header from "../components/Header"

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main style={{ marginTop: '6em', marginBottom: '2em' }}>{children}</main>
            <Footer />
        </>
    )
}

export default MainLayout