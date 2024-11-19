import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { userActions } from '_store';
import authService from 'service/authService';

export { List };

function List() {
    const [user, setUser] = useState([])


    useEffect(() => {
        const getUser = async ()=>{
            const res = await authService.getUser()
            console.log('res', res);
            setUser(res?.data?.data)
            
        } 
        getUser()
    }, []);

    return (
        <div>
            <h1>Users</h1>
            <Link to="add" className="btn btn-sm btn-success mb-2">Add User</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        {/* <th style={{ width: '30%' }}>First Name</th>
                        <th style={{ width: '30%' }}>Last Name</th> */}
                        <th style={{ width: '30%' }}>Email</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {user?.map(user =>
                        <tr key={user.id}>
                            {/* <td>{user.firstName}</td>
                            <td>{user.lastName}</td> */}
                            <td>{user.email}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`edit/${user.id}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                                {/* <button  className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={user.isDeleting} /> */}
                                {/* <span className="spinner-border spinner-border-sm">Edit</span> */}
                                <span>Delete</span>
                            </td>
                        </tr>
                    )}
                    {/* {users?.loading &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    } */}
                </tbody>
            </table>
        </div>
    );
}
