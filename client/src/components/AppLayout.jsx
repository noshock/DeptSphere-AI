import Header from "./Header";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }) => {
    return (
        <div className="app-layout">

            <Header />

            <Sidebar />

            <div className="app-page-content">
                {children}
            </div>

        </div>
    );
};

export default AppLayout;