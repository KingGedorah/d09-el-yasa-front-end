import Navbar from "./navbar"
import Footer from "./footer"

const Layout = ({ children, role }) => {
    return (
        <div className="flex flex-col">
            <Navbar role={role} />
            {children}
            <Footer />
        </ div>
    )
}

export default Layout