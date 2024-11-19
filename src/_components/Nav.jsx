import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '_store';

export { Nav };

function Nav() {
    const auth = useSelector((state) => state.auth.value);
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(authActions.logout());
    };

    // Return null if the user is not authenticated
    if (!auth || !auth.user) return null;

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
            <div className="navbar-nav">
                {/* Render this if the user is not an admin */}
                {auth.user.is_admin === false && (
                    <>
                        <NavLink to="/" className="nav-item nav-link">Home</NavLink>
                    </>
                )}

                {/* Render these if the user is an admin */}
                {auth.user.is_admin && (
                    <>
                        <NavLink to="/users" className="nav-item nav-link">Users</NavLink>
                        <NavLink to="/applications" className="nav-item nav-link">Applications</NavLink>
                        <NavLink to="/setting" className="nav-item nav-link">Settings</NavLink>
                    </>
                )}

                {/* Logout button */}
                <button onClick={logout} className="btn btn-link nav-item nav-link">Logout</button>
            </div>
        </nav>
    );
}