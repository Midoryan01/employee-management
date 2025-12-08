import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Fetch Data Logic
    const fetchEmployees = async () => {
        setLoading(true);
        try {
            let url = `http://localhost:5000/api/employees?`;
            if (filterDept) url += `department=${filterDept}&`;
            if (filterStatus) url += `status=${filterStatus}&`;
            const response = await axios.get(url);
            setEmployees(response.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEmployees(); }, [filterDept, filterStatus]);

    // --- MODERN DELETE CONFIRMATION  ---
    const handleDelete = (id) => {
            toast((t) => (
                <div className="flex flex-col items-center gap-3 min-w-[300px] text-center">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Delete Employee?</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Are you sure you want to delete this? This action cannot be undone.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full mt-2">
                        <button 
                            onClick={() => toast.dismiss(t.id)}
                            className="btn btn-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={async () => {
                                toast.dismiss(t.id); 
                                try {
                                    await axios.delete(`http://localhost:5000/api/employees/${id}`);
                                    toast.success("Successfully deleted!");
                                    fetchEmployees();
                                } catch (err) {
                                    toast.error("Failed to delete");
                                }
                            }}
                            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none font-semibold"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ), {
                id: 'delete-confirmation', 
                duration: Infinity, 
                position: 'top-center',
                style: {
                    background: '#fff',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    maxWidth: '400px',
                    width: '100%'
                },
            });
        };

    const filteredEmployees = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Team Members</h1>
                        <p className="text-gray-500 mt-1">Manage your employees and their accounts.</p>
                    </div>
                    <Link to="/add" className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 border-none text-white shadow-lg shadow-indigo-200 px-6 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Employee
                    </Link>
                </div>

                {/* Toolbar Section */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
                    
                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search employee..." 
                            className="input input-bordered pl-10 w-full bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-0"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <select 
                            className="select select-bordered w-full sm:w-auto bg-gray-50 focus:border-indigo-500 focus:ring-0 text-gray-600 pr-10 cursor-pointer" 
                            onChange={(e) => setFilterDept(e.target.value)} 
                            value={filterDept}
                        >
                            <option value="">All Departments</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                        
                        <select 
                            className="select select-bordered w-full sm:w-auto bg-gray-50 focus:border-indigo-500 focus:ring-0 text-gray-600 pr-10 cursor-pointer" 
                            onChange={(e) => setFilterStatus(e.target.value)} 
                            value={filterStatus}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    <th className="py-4 pl-6">Employee</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th className="text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center py-10 text-gray-400">Loading data...</td></tr>
                                ) : filteredEmployees.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-10 text-gray-400">No employees found.</td></tr>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <tr key={emp.id} className="group hover:bg-gray-50 transition-colors duration-200">
                                            {/* Name & Avatar */}
                                            <td className="pl-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-indigo-50 text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-sm border border-indigo-100">
                                                            {emp.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{emp.name}</div>
                                                        <div className="text-sm text-gray-500">{emp.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {/* Role */}
                                            <td>
                                                <div className="font-medium text-gray-800">{emp.position}</div>
                                                <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded-full mt-1 border border-gray-200">
                                                    {emp.department}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center w-fit gap-1.5 ${
                                                    emp.status === 'active' 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                                    {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                                                </span>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    {/* Edit Button */}
                                                    <Link 
                                                        to={`/edit/${emp.id}`} 
                                                        className="btn btn-sm btn-square btn-ghost text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                                                        title="Edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </Link>

                                                    {/* Delete Button */}
                                                    <button 
                                                        onClick={() => handleDelete(emp.id)} 
                                                        className="btn btn-sm btn-square btn-ghost text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
                                                        title="Delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Dummy */}
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                        <span>Viewing Data</span>
                        <div className="flex gap-1">
                             <button className="btn btn-xs btn-ghost" disabled>«</button>
                             <button className="btn btn-xs btn-active bg-white border border-gray-300">1</button>
                             <button className="btn btn-xs btn-ghost" disabled>»</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;