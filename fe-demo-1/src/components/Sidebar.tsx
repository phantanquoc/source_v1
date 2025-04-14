import React, { useState, useEffect } from 'react';
import { departments } from '../data/departments';
import { ChevronDown, ChevronRight, LayoutDashboard, LogOut, User } from 'lucide-react';
import { userAPI } from '../services/api';
import { UserInfo, SidebarProps } from '../types';

const Sidebar: React.FC<SidebarProps> = ({
  activeDepartment,
  setActiveDepartment,
  activeSubDepartment,
  setActiveSubDepartment,
  currentUser,
  onLogout
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const email = localStorage.getItem('apf_email');
        if (email) {
          const response = await userAPI.getUserByEmail(email);
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [currentUser]);

  return (
    <div className="w-full h-full bg-gray-800 text-white overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-700 hidden md:block">
        <h1 className="text-xl font-bold">ABF System</h1>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-700 flex items-center">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
          <User className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{userInfo?.username || 'Người dùng'}</p>
          {userInfo ? (
            <>
              <p className="text-xs text-gray-400">Bộ phận: {userInfo.department || 'N/A'}</p>
              <p className="text-xs text-gray-400">Phòng ban: {userInfo.room || 'N/A'}</p>
              <p className="text-xs text-gray-400">Chức vụ: {userInfo.position || 'N/A'}</p>
              {/* <p className="text-xs text-gray-400">{userInfo.email}</p> */}
            </>
          ) : (
            <p className="text-xs text-gray-400">Quản trị viên</p>
          )}
        </div>
      </div>

      <div className="p-2 flex-1">
        <div
          className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 ${activeDepartment === 'dashboard' ? 'bg-gray-700' : ''}`}
          onClick={() => {
            setActiveDepartment('dashboard');
            setActiveSubDepartment(null);
          }}
        >
          <LayoutDashboard className="mr-2 h-5 w-5" />
          <span>Dashboard</span>
        </div>

        {departments.map((department) => (
          <div key={department.id} className="mb-2">
            <div
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-700 ${activeDepartment === department.id ? 'bg-gray-700' : ''}`}
              onClick={() => {
                setActiveDepartment(department.id === activeDepartment ? null : department.id);
                setActiveSubDepartment(null);
              }}
            >
              <span>{department.name}</span>
              {activeDepartment === department.id ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>

            {activeDepartment === department.id && (
              <div className="ml-4 mt-1 space-y-1">
                {department.subDepartments.map((subDep) => (
                  <div
                    key={subDep.id}
                    className={`p-2 rounded-md cursor-pointer hover:bg-gray-700 ${activeSubDepartment === subDep.id ? 'bg-gray-700' : ''}`}
                    onClick={() => setActiveSubDepartment(subDep.id)}
                  >
                    {subDep.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center w-full p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
