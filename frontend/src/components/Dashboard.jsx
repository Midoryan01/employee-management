import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ total_employees: 0, department_breakdown: [] });
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Stats & All Employees secara paralel
                const [statsRes, empRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/stats'),
                    axios.get('http://localhost:5000/api/employees')
                ]);

                setStats(statsRes.data);
                
                // Ambil 5 karyawan terakhir (Asumsi ID Auto Increment, makin besar makin baru)
                // Kita sort desc berdasarkan ID, lalu ambil 5
                const sorted = empRes.data.sort((a, b) => b.id - a.id).slice(0, 5);
                setRecentEmployees(sorted);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Helper: Hitung Avg Salary Global
    const globalAvgSalary = stats.department_breakdown.length > 0 
        ? stats.department_breakdown.reduce((acc, curr) => acc + curr.average_salary, 0) / stats.department_breakdown.length 
        : 0;

    const formatRupiah = (num) => "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Warna-warni Chart
    const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

    if (loading) return <div className="p-10 text-center text-gray-400">Loading Dashboard...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
            
            {/* --- TOP CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase">Total Staff</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_employees}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase">Departments</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.department_breakdown.length}</p>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-500 rounded-full">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase">Avg. Salary</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{formatRupiah(Math.round(globalAvgSalary))}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
            </div>

            {/* --- MIDDLE SECTION: CHARTS & RECENT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* CHART SECTION */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-700 mb-6">Employees by Department</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.department_breakdown}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="department" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [value, 'Employees']}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                                    {stats.department_breakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* RECENT ADDITIONS LIST */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700">Recent Hires</h3>
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Latest 5</span>
                    </div>
                    <div className="space-y-4">
                        {recentEmployees.length === 0 ? (
                            <p className="text-gray-400 text-sm">No recent hires.</p>
                        ) : (
                            recentEmployees.map((emp) => (
                                <div key={emp.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="avatar placeholder">
                                        <div className="bg-gray-100 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                                            {emp.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{emp.name}</p>
                                        <p className="text-xs text-gray-500">{emp.position}</p>
                                    </div>
                                    <div className="ml-auto text-xs text-gray-400">
                                        {new Date(emp.hire_date).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;