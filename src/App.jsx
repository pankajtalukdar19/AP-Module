import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { history } from '_helpers';
import { Nav, Alert, PrivateRoute } from '_components';
import { Home } from 'home';
import { AccountLayout } from 'account';
import { UsersLayout } from 'users';
import Approve from 'page/Approve';
import Reject from 'page/Reject';
import RedemptionTracker from 'page/RedemptionTracker';
import Dashboard from 'page/Dashboard';
import Applications from 'page/Applications';
import ApplicationsDetails from 'page/ApplicationsDetails';
import Vendors from 'page/Vendors';
import VendorsDetails from 'page/VendorsDetails';
import Setting from 'page/Setting';

export { App };

function App() {
    // init custom history object to allow navigation from 
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();

    return (
        <div className="app-container bg-light">
            <Nav />
            <Alert />
            <div className="container pt-4 pb-4">
                <Routes>
                    {/* private */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="users/*" element={<UsersLayout />} />
                        <Route path="approve" element={<Approve />} />
                        <Route path="reject" element={<Reject />} />
                        <Route path="commercial" element={<RedemptionTracker />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="applications" element={<Applications />} />
                        <Route path="vendors" element={<Vendors />} />
                        <Route path="vendors/:id" element={<VendorsDetails />} />
                        <Route path="applications/:id" element={<ApplicationsDetails />} />
                        <Route path="setting" element={<Setting />} />
                    </Route>
                    {/* public */}
                    <Route path="account/*" element={<AccountLayout />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}
