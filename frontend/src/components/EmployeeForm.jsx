import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const EmployeeForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id; 

    const [formData, setFormData] = useState({
        name: '', email: '', position: '', department: '',
        salary: '', hire_date: '', status: 'active'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- LOGIC FETCH DATA (EDIT MODE) ---
    useEffect(() => {
        if (isEditMode) {
            const fetchEmp = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
                    const dateStr = new Date(res.data.hire_date).toISOString().split('T')[0];
                    setFormData({ ...res.data, hire_date: dateStr });
                } catch (err) { navigate('/'); }
            };
            fetchEmp();
        }
    }, [id]);

    // --- HELPER FUNCTION: FORMAT RUPIAH ---
    // Mengubah angka 1000000 menjadi "1.000.000" untuk tampilan
    const formatNumber = (num) => {
        if (!num) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // --- HANDLE INPUT CHANGE ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Khusus Logic Salary (Hapus titik sebelum simpan ke state)
        if (name === 'salary') {
            const rawValue = value.replace(/\./g, ''); // Hapus semua titik
            if (!isNaN(rawValue)) { // Pastikan hanya angka
                setFormData({ ...formData, salary: rawValue });
            }
        } else {
            // Logic field biasa
            setFormData({ ...formData, [name]: value });
        }
    };

    // --- HANDLE SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const payload = {
            ...formData,
            salary: Number(formData.salary) 
        };

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/employees/${id}`, payload);
                toast.success("Employee updated successfully!"); // <--- GANTI ALERT
            } else {
                await axios.post('http://localhost:5000/api/employees', payload);
                toast.success("New employee added successfully!"); // <--- GANTI ALERT
            }
            navigate('/employees'); // Redirect ke list setelah sukses
        } catch (err) {
            const msg = err.response?.data?.error || "Error saving data";
            setError(msg);
            toast.error(msg); // <--- GANTI ALERT
        } finally { setLoading(false); }
    };
    
    // --- UI FORM ---
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl overflow-hidden border border-gray-100">
                
                {/* Header */}
                <div className="bg-indigo-600 p-8 text-center text-white">
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEditMode ? 'Update Profile' : 'New Employee'}
                    </h2>
                    <p className="opacity-90 mt-2 text-sm">
                        Please fill in the details below carefully.
                    </p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="alert alert-error mb-6 text-sm rounded-lg shadow-sm">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Full Name */}
                        <div className="form-control md:col-span-2">
                            <label className="label font-semibold text-gray-700">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required 
                                className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-indigo-500 transition-all" 
                                placeholder="e.g. Alexander Pierce" />
                        </div>

                        {/* Email */}
                        <div className="form-control md:col-span-2">
                            <label className="label font-semibold text-gray-700">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required 
                                className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-indigo-500" 
                                placeholder="alex@company.com" />
                        </div>

                        {/* Department */}
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700">Department</label>
                            <select name="department" value={formData.department} onChange={handleChange} required 
                                className="select select-bordered w-full bg-gray-50 focus:border-indigo-500 cursor-pointer">
                                <option value="" disabled>Select Department</option>
                                <option value="IT">IT</option>
                                <option value="HR">HR</option>
                                <option value="Finance">Finance</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>

                        {/* Position */}
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700">Position</label>
                            <input type="text" name="position" value={formData.position} onChange={handleChange} required 
                                className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-indigo-500" 
                                placeholder="e.g. Senior Developer" />
                        </div>

                        {/* Salary (Formatted Input) */}
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700">Monthly Salary</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-gray-400 font-bold text-sm">Rp</span>
                                <input 
                                    type="text" // Ubah jadi Text agar bisa ada titik
                                    name="salary" 
                                    value={formatNumber(formData.salary)} // Tampilkan format ber-titik
                                    onChange={handleChange} 
                                    required 
                                    className="input input-bordered w-full pl-10 bg-gray-50 focus:bg-white focus:border-indigo-500 font-mono text-gray-700" 
                                    placeholder="0" 
                                />
                            </div>
                        </div>

                        {/* Join Date (Styled Picker) */}
                        <div className="form-control">
                            <label className="label font-semibold text-gray-700">Join Date</label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    name="hire_date" 
                                    value={formData.hire_date} 
                                    onChange={handleChange} 
                                    required 
                                    className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-indigo-500 cursor-pointer text-gray-600" 
                                />
                                {/* Ikon Kalender Opsional (Visual Only) */}
                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Status Radio (Hanya muncul saat Edit) */}
                        {isEditMode && (
                            <div className="form-control md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <label className="label font-semibold text-gray-700 mb-2">Employment Status</label>
                                <div className="flex gap-6">
                                    <label className="label cursor-pointer gap-2 flex items-center">
                                        <input type="radio" name="status" value="active" checked={formData.status === 'active'} onChange={handleChange} className="radio radio-primary radio-sm" />
                                        <span className="text-sm font-medium text-gray-700">Active</span>
                                    </label>
                                    <label className="label cursor-pointer gap-2 flex items-center">
                                        <input type="radio" name="status" value="inactive" checked={formData.status === 'inactive'} onChange={handleChange} className="radio radio-error radio-sm" />
                                        <span className="text-sm font-medium text-gray-700">Inactive</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="md:col-span-2 flex gap-4 mt-6 pt-4 border-t border-gray-100">
                            <Link to="/" className="btn btn-outline border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 flex-1">
                                Cancel
                            </Link>
                            <button type="submit" className={`btn btn-primary bg-indigo-600 hover:bg-indigo-700 border-none text-white flex-1 ${loading && 'loading'}`}>
                                {isEditMode ? 'Update Employee' : 'Save Employee'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeForm;