import React, { useEffect, useState } from "react";
import '../Pages/Dashboard.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('codeCampusToken');
        fetch('http://localhost:5174/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`

            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch users. Are you a Admin?");
                return res.json();
            })
            .then(data => setUsers(data))
            .catch(err => setErrorMessage(err.message));

    }, []);

    const handleRoleChange = async (id, newRole) => {
        const token = sessionStorage.getItem('codeCampusToken');
        try {
            const response = await fetch(`http://localhost:5174/api/Admin/users/${id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // Reverted back to a raw string to match Swagger perfectly
                body: JSON.stringify(newRole)
            });
            if (response.ok) {
                setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            } else {
                alert("Failed to update role.");
            }
        } catch (error) {
            console.error("Error updating role", error);
        }
    };
    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>User Management</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <span style={{ color: user.role === 'Moderator' ? 'bule' : 'black' }}>
                                    {user.role}
                                </span>
                            </td>
                            <td>
                                <select value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    <option value="Contestant">Contestant</option>
                                    <option value="Moderator">Moderator</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>

    );
}