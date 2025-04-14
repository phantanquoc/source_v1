import React, { useState } from 'react';
import { Users, FileText, Settings } from 'lucide-react';
import GoalPlanView from '../GoalPlanView';

interface PurchasingDepartmentProps {
  subDepartmentId: string | null;
}

const PurchasingDepartment: React.FC<PurchasingDepartmentProps> = ({ subDepartmentId }) => {
  const [showGoalPlan, setShowGoalPlan] = useState(false);
  const departmentName = "Bộ phận Thu mua";
  
  // Find the current sub-department name if applicable
  let subDepartmentName = "";
  if (subDepartmentId === 'purchasing-materials') subDepartmentName = "Thu mua NVL";
  if (subDepartmentId === 'purchasing-equipment') subDepartmentName = "Thu mua Thiết bị";
  
  return (
    <div>
      <div className="flex items-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">{departmentName}</h1>
        {subDepartmentId && (
          <>
            <span className="mx-2 text-gray-400">/</span>
            <h2 className="text-lg md:text-xl text-gray-700">{subDepartmentName}</h2>
          </>
        )}
      </div>
      
      {!subDepartmentId ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-white p-3 md:p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center mb-2 md:mb-3">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                <h3 className="font-medium">Tổng quan nhân sự</h3>
              </div>
              <p className="text-sm text-gray-600">Quản lý thông tin nhân sự của {departmentName}</p>
              <div className="mt-2 md:mt-3 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Xem chi tiết
                </button>
              </div>
            </div>
            
            <div className="bg-white p-3 md:p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center mb-2 md:mb-3">
                <FileText className="h-5 w-5 mr-2 text-green-500" />
                <h3 className="font-medium">Mục tiêu và kế hoạch</h3>
              </div>
              <p className="text-sm text-gray-600">Quản lý báo cáo và tài liệu của {departmentName}</p>
              <div className="mt-2 md:mt-3 text-right">
                <button 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => setShowGoalPlan(true)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
            
            <div className="bg-white p-3 md:p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center mb-2 md:mb-3">
                <Settings className="h-5 w-5 mr-2 text-purple-500" />
                <h3 className="font-medium">Cài đặt bộ phận</h3>
              </div>
              <p className="text-sm text-gray-600">Quản lý cài đặt và quyền hạn của {departmentName}</p>
              <div className="mt-2 md:mt-3 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Các phòng ban trực thuộc</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-4 rounded-lg shadow border border-gray-200">
              <h3 className="font-medium text-base md:text-lg mb-2">Thu mua NVL</h3>
              <p className="text-sm text-gray-600 mb-2 md:mb-3">Quản lý thu mua nguyên vật liệu</p>
              <div className="text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Xem chi tiết
                </button>
              </div>
            </div>
            
            <div className="bg-white p-3 md:p-4 rounded-lg shadow border border-gray-200">
              <h3 className="font-medium text-base md:text-lg mb-2">Thu mua Thiết bị</h3>
              <p className="text-sm text-gray-600 mb-2 md:mb-3">Quản lý thu mua thiết bị</p>
              <div className="text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Thông tin {subDepartmentName}</h3>
          
          <div className="mb-4 md:mb-6">
            <h4 className="font-medium mb-2">Mô tả</h4>
            <p className="text-sm text-gray-600">
              Đây là trang quản lý thông tin và hoạt động của {subDepartmentName} thuộc {departmentName}.
            </p>
          </div>
          
          <div className="mb-4 md:mb-6">
            <h4 className="font-medium mb-2">Nhiệm vụ chính</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Quản lý hoạt động của {subDepartmentName}</li>
              <li>Báo cáo định kỳ về tình hình hoạt động</li>
              <li>Phối hợp với các bộ phận khác</li>
              <li>Đảm bảo chất lượng công việc</li>
            </ul>
          </div>
          
          <div className="mb-4 md:mb-6">
            <h4 className="font-medium mb-2">Nhân sự</h4>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 md:px-4 text-left text-xs md:text-sm">Họ tên</th>
                    <th className="py-2 px-3 md:px-4 text-left text-xs md:text-sm">Chức vụ</th>
                    <th className="py-2 px-3 md:px-4 text-left text-xs md:text-sm">Email</th>
                    <th className="py-2 px-3 md:px-4 text-left text-xs md:text-sm">Số điện thoại</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">Nguyễn Văn A</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">Trưởng phòng</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">nguyenvana@example.com</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">0123456789</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">Trần Thị B</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">Phó phòng</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">tranthib@example.com</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">0987654321</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Công cụ quản lý</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
              <button className="bg-blue-500 text-white py-2 px-3 md:px-4 rounded text-sm hover:bg-blue-600">
                Quản lý nhân sự
              </button>
              <button 
                className="bg-green-500 text-white py-2 px-3 md:px-4 rounded text-sm hover:bg-green-600"
                onClick={() => setShowGoalPlan(true)}
              >
                Báo cáo & Thống kê
              </button>
              <button className="bg-purple-500 text-white py-2 px-3 md:px-4 rounded text-sm hover:bg-purple-600">
                Tài liệu & Quy trình
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showGoalPlan && (
        <GoalPlanView 
          departmentName={subDepartmentId ? `${departmentName} - ${subDepartmentName}` : departmentName}
          onClose={() => setShowGoalPlan(false)}
        />
      )}
    </div>
  );
};

export default PurchasingDepartment;
