'use client';
import { useState } from 'react';
import {toast} from 'react-hot-toast'

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([
        {
            id: 1,
            name: 'shalom wubu',
            position: 'software engineer',
            salary: '100,000',
            taxAmount: 'to be calculated',
        },
        {
            id: 2,
            name: 'john doe',
            position: 'product manager',
            salary: '120,000',
            taxAmount: 'to be calculated',
        },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        position: '',
        salary: '',
        taxAmount: '',
    });

    const openAddEmployeeForm = () => {
        setShowAddForm(true);
    };

    const closeAddEmployeeForm = () => {
        setShowAddForm(false);
        setNewEmployee({ name: '', position: '', salary: '', taxAmount: '' });
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            });

            if (response.ok) {
                const addedEmployee = await response.json();
                setEmployees([...employees, addedEmployee]);
                closeAddEmployeeForm();
                toast.success('Employee added successfully!');
            } else {
                toast.error('Failed to add employee.');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            toast.error('An error occurred while adding the employee.');
        }
    };

    const editEmployee = (id) => {
        toast.info('Edit Employee with ID: ' + id);
    };

    const deleteEmployee = (id) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            setEmployees(employees.filter((emp) => emp.id !== id));
            toast.success('Deleted Employee with ID: ' + id);
        }
    };

    // Filter employees based on the search term
    const filteredEmployees = employees.filter(
        (emp) =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.id.toString().includes(searchTerm)
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search Employee by Name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded-lg p-2 w-1/3"
                />
                <button
                    onClick={openAddEmployeeForm}
                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                    Add Employee
                </button>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="w-full bg-gray-800 text-white">
                        <th className="py-2">Employee ID</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Position</th>
                        <th className="py-2">Salary</th>
                        <th className="py-2">Tax Amount</th>
                        <th className="py-2">Actions</th>
                        <th className="py-2">Total Tax</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="border-b ">
                            <td className="py-2 px-12">{emp.id}</td>
                            <td className="py-2 px-12">{emp.name}</td>
                            <td className="py-2 px-12">{emp.position}</td>
                            <td className="py-2 px-12">{emp.salary}</td>
                            <td className="py-2 px-12">{emp.taxAmount}</td>
                            <td className="py-2 px-12">
                                <button onClick={() => editEmployee(emp.id)} className="text-blue-500">
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteEmployee(emp.id)}
                                    className="text-red-500 ml-4"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Employee Form */}
            {showAddForm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Add Employee</h2>
                        <form onSubmit={handleAddEmployee}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={newEmployee.name}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, name: e.target.value })
                                    }
                                    className="border rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Position</label>
                                <input
                                    type="text"
                                    value={newEmployee.position}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, position: e.target.value })
                                    }
                                    className="border rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Salary</label>
                                <input
                                    type="text"
                                    value={newEmployee.salary}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, salary: e.target.value })
                                    }
                                    className="border rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tax Amount</label>
                                <input
                                    type="text"
                                    value={newEmployee.taxAmount}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, taxAmount: e.target.value })
                                    }
                                    className="border rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeAddEmployeeForm}
                                    className="bg-gray-500 text-white rounded-lg px-4 py-2 mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;