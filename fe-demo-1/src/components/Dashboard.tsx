import React, { useState, useEffect } from 'react';
import { Users, ShoppingCart, Briefcase, FileText } from 'lucide-react';
import axios from 'axios';
import GoalPlanView from './GoalPlanView';
import EmployeeList from './EmployeeList';
import { userAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const [showGoalPlan, setShowGoalPlan] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [userCount, setUserCount] = useState(0);

  // Cập nhật số lượng người dùng khi component được tạo
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy số lượng người dùng
        const userResponse = await userAPI.getAllUsers();
        setUserCount(userResponse.data.length);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, []);

  if (showGoalPlan) {
    return <GoalPlanView departmentName="Phòng ban" onBack={() => setShowGoalPlan(false)} />;
  }

  if (showEmployeeList) {
    // Truyền hàm cập nhật số lượng người dùng cho EmployeeList
    return <EmployeeList
      onBack={() => setShowEmployeeList(false)}
      onUserCountChange={setUserCount}
    />;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div
          className="bg-blue-500 text-white p-3 md:p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition-colors"
          onClick={() => setShowEmployeeList(true)}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs md:text-sm opacity-80">Tổng nhân viên</p>
              <p className="text-xl md:text-2xl font-bold">{userCount}</p>
            </div>
            <Users className="h-8 w-8 md:h-10 md:w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-green-500 text-white p-3 md:p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs md:text-sm opacity-80">Đơn hàng mới</p>
              <p className="text-xl md:text-2xl font-bold">20</p>
            </div>
            <ShoppingCart className="h-8 w-8 md:h-10 md:w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-purple-500 text-white p-3 md:p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs md:text-sm opacity-80">Dự án đang thực hiện</p>
              <p className="text-xl md:text-2xl font-bold">7</p>
            </div>
            <Briefcase className="h-8 w-8 md:h-10 md:w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-orange-500 text-white p-3 md:p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs md:text-sm opacity-80">Báo cáo chờ duyệt</p>
              <p className="text-xl md:text-2xl font-bold">10</p>
            </div>
            <FileText className="h-8 w-8 md:h-10 md:w-10 opacity-80" />
          </div>
        </div>
      </div>

      <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Báo cáo</h2>

      <button
        onClick={() => setShowGoalPlan(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
      >
        MỤC TIÊU VÀ KẾ HOẠCH
      </button>
    </div>
  );
};

export default Dashboard;
