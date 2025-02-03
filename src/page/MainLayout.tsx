import Footer from "../components/Footer"
import Header from "../components/Header"

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    )
}

export default MainLayout