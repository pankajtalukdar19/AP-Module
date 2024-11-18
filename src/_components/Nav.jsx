import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '_store';

export { Nav };

function Nav() {
    const auth = useSelector(x => x.auth.value);
    const dispatch = useDispatch();
    const logout = () => dispatch(authActions.logout());
console.log('soro', auth );

    // only show nav when logged in
    if (!auth) return null;
    
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
            <div className="navbar-nav">
                <NavLink to="/" className="nav-item nav-link">Home</NavLink>
             {
                auth.username === 'pankajtalukdar08@gmail.com' ? (
                    <>
                    
                    <NavLink to="/users" className="nav-item nav-link">Users</NavLink>
                    <NavLink to="/applications" className="nav-item nav-link">Applications</NavLink>
                    <NavLink to="/setting" className="nav-item nav-link">Settings</NavLink>
                    </>
                ) : null
             }
                <NavLink to="/vendors" className="nav-item nav-link">Vendors</NavLink>
                <NavLink to="/dashboard" className="nav-item nav-link">Search</NavLink>
                <button onClick={logout} className="btn btn-link nav-item nav-link">Logout</button>
            </div>
        </nav>
    );
}