import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { userAPI, goalAPI } from '../services/api';
import { GoalPlan, UserInfo } from '../types';
import { PlusCircle, Edit, Trash2, CheckCircle, Clock, AlertCircle, FileText, User, Briefcase, Target, ArrowLeft, Check } from 'lucide-react';
import GoalPlanForm from './GoalPlanForm';

interface GoalPlanViewProps {
  departmentName: string;
  onBack: () => void;
}

const GoalPlanView: React.FC<GoalPlanViewProps> = ({ departmentName, onBack }) => {
  const [goalPlans, setGoalPlans] = useState<GoalPlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalPlan | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // Thêm state mới cho filter
  const [timeFilter, setTimeFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem('apf_email');
        if (email) {
          const userResponse = await userAPI.getUserByEmail(email);
          setUserInfo(userResponse.data);

          const goalsResponse = await goalAPI.getAllGoals();
          setGoalPlans(goalsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (goalPlan: GoalPlan) => {
    try {
      if (editingGoal?._id) {
        // Update existing goal
        const response = await goalAPI.updateGoal(editingGoal._id, goalPlan);
        if (response.status === 200) {
          // Update local state
          setGoalPlans(goalPlans.map(gp =>
            gp._id === editingGoal._id ? response.data : gp
          ));
        }
      } else {
        // Create new goal
        const response = await goalAPI.createGoal(goalPlan);
        if (response.status === 201) {
          // Add new goal to local state
          setGoalPlans([...goalPlans, response.data]);
        }
      }

      setShowForm(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Có lỗi xảy ra khi lưu mục tiêu');
    }
  };

  const handleEdit = (goalPlan: GoalPlan) => {
    setEditingGoal(goalPlan);
    setShowForm(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      alert('Không thể xóa mục tiêu này - ID không hợp lệ');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa mục tiêu/kế hoạch này?')) {
      try {
        const response = await goalAPI.deleteGoal(id);
        if (response.status === 200) {
          setGoalPlans(goalPlans.filter(gp => gp._id !== id));
          alert('Xóa mục tiêu thành công');
        }
      } catch (error) {
        console.error('Error deleting goal:', error);
        alert('Có lỗi xảy ra khi xóa mục tiêu');
      }
    }
  };

  const handleApprove = async (id: string | undefined) => {
    if (!id) {
      alert('Không thể duyệt mục tiêu này - ID không hợp lệ');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn duyệt mục tiêu/kế hoạch này?')) {
      try {
        const updatedGoal = {
          nguoiduyet: userInfo?.username || 'Unknown',
          dateduyet: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
          status: 'completed'
        };

        const response = await goalAPI.updateGoal(id, updatedGoal);

        if (response.status === 200 && response.data) {
          setGoalPlans(goalPlans.map(gp =>
            gp._id === id ? response.data : gp
          ));
        } else {
          throw new Error('Không nhận được phản hồi từ server');
        }
      } catch (error) {
        console.error('Error approving goal:', error);
        alert('Có lỗi xảy ra khi duyệt mục tiêu: ' + (error as Error).message);
      }
    }
  };


  const getStatusBadge = (status?: GoalPlan['status']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><Clock className="w-3 h-3 mr-1" /> Chưa bắt đầu</span>;
      case 'in-progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><AlertCircle className="w-3 h-3 mr-1" /> Đang thực hiện</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Hoàn thành</span>;
      case 'delayed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Tạm hoãn</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><Clock className="w-3 h-3 mr-1" /> Không xác định</span>;
    }
  };


  const getProgressBadge = (ketquaptpt?: number | null) => {
    if (ketquaptpt === undefined || ketquaptpt === null) return null;

    let bgColor = 'bg-gray-100 text-gray-800';
    if (ketquaptpt >= 100) bgColor = 'bg-green-100 text-green-800';
    else if (ketquaptpt >= 50) bgColor = 'bg-blue-100 text-blue-800';
    else if (ketquaptpt > 0) bgColor = 'bg-yellow-100 text-yellow-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {ketquaptpt}%
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error formatting date:', error.message);
      }
      return dateString;
    }
  };

  const filteredGoalPlans = goalPlans.filter(goal => {
    if (timeFilter === 'all') return true;
    return goal.loaimuctieu === timeFilter;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
        </button>
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Mục tiêu và kế hoạch - {departmentName}</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-medium">Danh sách mục tiêu và kế hoạch</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả mục tiêu</option>
                  <option value="Năm">Mục tiêu năm</option>
                  <option value="Quý">Mục tiêu quý</option>
                  <option value="Tháng">Mục tiêu tháng</option>
                  <option value="Tuần">Mục tiêu tuần</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingGoal(null);
                setShowForm(true);
              }}
              className="flex items-center text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Thêm mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1024px]"> {/* Thêm div với min-width cố định */}
              <table className="w-full table-fixed divide-y divide-gray-200"> {/* Thêm table-fixed */}
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-[35%] px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin mục tiêu
                    </th>
                    <th scope="col" className="w-[15%] px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Người thực hiện
                    </th>
                    <th scope="col" className="w-[30%] px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Tiến độ
                    </th>
                    <th scope="col" className="w-[10%] px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th scope="col" className="w-[10%] px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGoalPlans.map((goalPlan) => (
                    <tr key={goalPlan._id} className="hover:bg-gray-50">
                      <td className="px-1 py-1">
                        <div className="flex items-start space-x-3">
                          <Target className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="text-base font-medium text-gray-900 flex items-center">
                              {goalPlan.muctiebanthan}
                              <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {goalPlan.loaimuctieu}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Hạng mục công việc:</span> {goalPlan.hmcv}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Yêu cầu cung cấp:</span> {goalPlan.yccc}
                            </div>
                              <div className="text-sm text-gray-500 mt-1">
                                <span className="font-medium">Tình trạng cung cấp:</span> {goalPlan.ttcc}
                              </div>
                              {goalPlan.filekem && (
                              <div className="text-sm text-blue-600 mt-1 flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                <span>{goalPlan.filekem}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-start space-x-3">
                          <User className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <div className="text-base text-gray-900">{goalPlan.username}</div>
                            <div className="text-sm text-gray-500">{goalPlan.email}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
                              <span>{goalPlan.department} - {goalPlan.room}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Vị trí: {goalPlan.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(goalPlan.status)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">Kết quả</span>
                            {getProgressBadge(goalPlan.ketquaptpt)}
                          </div>
                          {goalPlan.ketqualamduoc && (
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Kết quả làm được:</span> {goalPlan.ketqualamduoc}
                            </div>
                          )}
                          {goalPlan.chualamduoc && (
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Chưa làm được:</span> {goalPlan.chualamduoc}
                            </div>
                          )}
                          {goalPlan.nguyennhan && (
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Nguyên nhân:</span> {goalPlan.nguyennhan}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Tạo:</span> {formatDate(goalPlan.datetao)}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Duyệt:</span> {formatDate(goalPlan.dateduyet)}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Người duyệt:</span>{' '}
                            {goalPlan.nguoiduyet ? (
                              <span className="text-green-600">{goalPlan.nguoiduyet}</span>
                            ) : (
                              <span className="text-yellow-600">Chưa được duyệt</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-col items-end space-y-2">
                          <button
                            onClick={() => handleEdit(goalPlan)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Edit className="w-5 h-5 mr-1" />
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleDelete(goalPlan._id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <Trash2 className="w-5 h-5 mr-1" />
                            Xóa
                          </button>
                          {goalPlan.nguoiduyet ? (
                            <span className="text-green-600 flex items-center">
                              <Check className="w-4 h-4 mr-1" />
                              Đã duyệt
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApprove(goalPlan._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Duyệt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredGoalPlans.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-5 text-center text-base text-gray-500">
                        {timeFilter === 'all'
                          ? 'Chưa có mục tiêu hoặc kế hoạch nào. Hãy thêm mới!'
                          : `Không tìm thấy mục tiêu nào thuộc loại: ${timeFilter}`
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <GoalPlanForm
          departmentName={departmentName}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          editingGoal={editingGoal}
          userInfo={userInfo} // Pass userInfo here
        />
      )}
    </div>
  );
};

export default GoalPlanView;

