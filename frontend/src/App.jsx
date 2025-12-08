import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- Import Ini
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import Dashboard from './components/Dashboard';

// Sidebar Component (Tetap sama)
const Sidebar = () => {
  const location = useLocation();
  const menu = [
    { path: '/', name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { path: '/employees', name: 'Employees', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col hidden md:flex">
      <div className="text-2xl font-bold text-indigo-600 mb-8 px-4">Nexus<span className="text-gray-800">HR</span></div>
      <div className="space-y-1">
        {menu.map((item) => (
          <Link key={item.path} to={item.path} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              location.pathname === item.path 
              ? 'bg-indigo-50 text-indigo-600' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <Sidebar />
        <div className="flex-1 overflow-auto relative">
            {/* Pasang Toaster di sini */}
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/add" element={<EmployeeForm />} />
              <Route path="/edit/:id" element={<EmployeeForm />} />
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;