import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
// Note: You need to implement an adminApi.getUsers() endpoint in your api.ts 
// or use the mocked one provided in the previous step.
import { adminApi } from '../../api/api'; 

interface UserData {
    id: number;
    email: string;
    name: string;
    role: string;
}

const AdminDashboard: React.FC = () => {
    // Mocking data state since backend endpoint for listing users wasn't explicitly in your file upload
    const [users, setUsers] = useState<UserData[]>([
        { id: 1, email: 'patient@example.com', name: 'John Doe', role: 'PATIENT' },
        { id: 2, email: 'doc@example.com', name: 'Dr. Smith', role: 'DOCTOR' }
    ]);

    // Uncomment when API is ready
    /*
    useEffect(() => {
        adminApi.getUsers().then(res => setUsers(res.data));
    }, []);
    */

    const handleRemove = (id: number) => {
        if(window.confirm("Are you sure?")) {
            setUsers(users.filter(u => u.id !== id));
            // adminApi.deleteUser(id);
        }
    };

    return (
        <div>
            <Navbar role="Admin" />
            <div className="container">
                <div className="card">
                    <h3>User Management</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                             {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button className="btn btn-warning" style={{marginRight:'5px'}}>Reset Pwd</button>
                                        <button className="btn btn-danger" onClick={() => handleRemove(user.id)}>Remove</button>
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;