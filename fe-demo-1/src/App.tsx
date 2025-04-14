import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DepartmentView from './components/DepartmentView';
import Login from './components/Login';
import Register from './components/Register';
import { Menu, X } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState<string | null>('dashboard');
  const [activeSubDepartment, setActiveSubDepartment] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('apf_user');
    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('apf_user');
    localStorage.removeItem('apf_email'); // Add this line
  };

  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register
          onSwitchToLogin={() => setShowRegister(false)}
          setCurrentUser={setCurrentUser}
          setIsLoggedIn={setIsLoggedIn}
        />
      );
    }
    return (
      <Login
        onSwitchToRegister={() => setShowRegister(true)}
        setCurrentUser={setCurrentUser}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold">ABF System</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-700 focus:outline-none"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
      <div className={`
        ${isMobile ? 'fixed inset-0 z-40 transition-transform transform duration-300 ease-in-out' : 'relative'}
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        ${isMobile ? 'w-64' : 'w-64 md:w-64 lg:w-72'}
      `}>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        <div className="relative z-40 h-full">
          <Sidebar
            activeDepartment={activeDepartment}
            setActiveDepartment={(id) => {
              setActiveDepartment(id);
              if (isMobile) setSidebarOpen(false);
            }}
            activeSubDepartment={activeSubDepartment}
            setActiveSubDepartment={(id) => {
              setActiveSubDepartment(id);
              if (isMobile) setSidebarOpen(false);
            }}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeDepartment === 'dashboard' ? (
          <Dashboard />
        ) : (
          <DepartmentView
            departmentId={activeDepartment || ''}
            subDepartmentId={activeSubDepartment}
            setActiveSubDepartment={setActiveSubDepartment}
          />
        )}
      </div>
    </div>
  );
}

export default App;
