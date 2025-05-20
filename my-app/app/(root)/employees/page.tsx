'use client';
import { useState,useEffect } from 'react';
import {toast} from 'react-hot-toast'

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([
        {
            employeeName: 'shalom wubu',
            description: 'software engineer',
            salary: '100,000',
        },
        {
            employeeName: 'john doe',
            description: 'product manager',
            salary: '120,000',
        },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        employeeName: '',
        description: '',
        salary: '',
    });

    const openAddEmployeeForm = () => {
        setShowAddForm(true);
    };

    const closeAddEmployeeForm = () => {
        setShowAddForm(false);
        setNewEmployee({ employeeName: '', description: '', salary: '' });
    };

      useEffect(() => {
        const fetchEmployees = async () => {
          try {
            const response = await fetch('http://localhost:7000/api/payroll');
            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data.employees)) {
                setEmployees(data.employees); // Ensure data is an array
              } else {
                console.error('Invalid API response:', data);
                setEmployees([]); // Default to an empty array if response is invalid
              }
            } else {
              toast.error('Failed to fetch Incomes.');
            }
          } catch (error) {
            console.error('Error fetching Incomes:', error);
            toast.error('An error occurred while fetching Incomes.');
          }
        };
    
        fetchEmployees();
      }, []);

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:7000/api/payroll', {
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/api/payroll/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmployees(employees.filter((Employee) => Employee._id !== id));
        toast.success('payroll deleted successfully!');
      } else {
        toast.error('Failed to delete payroll.');
      }
    } catch (error) {
      console.error('Error deleting payroll:', error);
      toast.error('An error occurred while deleting payroll.');
    }
  };

const filteredEmployees = employees.filter(
    (emp) =>
        (emp.employeeName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">PayRoll</h1>
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
            <table className="min-w-full bg-white overflow-hidden">
                <thead>
                    <tr className=" bg-gray-800 text-white ">
                        <th className="py-2">Name</th>
                        <th className="py-2">Salary</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="border-b ">
                            <td className="py-2 pl-20">{emp.employeeName}</td>
                            <td className="py-2 pl-20">{emp.salary}</td>
                            <td className="py-2 pl-20">{emp.description}</td>
                            <td className="py-2 pl-20">
                                <button onClick={() => handleEdit(emp.id)} className="text-blue-500">
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(emp.id)}
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
                                    value={newEmployee.employeeName}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, employeeName: e.target.value })
                                    }
                                    className="border rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Description</label>
                                <input
                                    type="text"
                                    value={newEmployee.description}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, description: e.target.value })
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