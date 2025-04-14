import React, { useState, useEffect } from 'react';
import { GoalPlan, GoalPlanFormProps, GoalStatus } from '../types';
import moment from 'moment-timezone';

const INITIAL_FORM_STATE: GoalPlan = {
  username: '',
  email: '',
  department: '',
  room: '',
  position: '',
  loaimuctieu: '',
  muctiecaptren: '',
  muctiebanthan: '',
  hmcv: '',
  yccc: '',
  ttcc: '',
  datetao: '',
  dateduyet: '',
  nguoiduyet: '',
  ketqualamduoc: '',
  ketquaptpt: 0,
  chualamduoc: '',
  nguyennhan: '',
  nguoibaocao: '',
  status: 'pending' as GoalStatus,
  filekem: ''
};

const GoalPlanForm: React.FC<GoalPlanFormProps> = ({ 
  onClose, 
  onSave, 
  editingGoal, 
  userInfo,
  departmentName // Thêm departmentName vào destructuring
}) => {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_STATE,
    username: userInfo?.username || '',
    email: userInfo?.email || '',
    department: userInfo?.department || '',
    room: userInfo?.room || '',
    position: userInfo?.position || '',
    datetao: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
    dateduyet: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        ...editingGoal,
        ketquaptpt: editingGoal.ketquaptpt ?? 0,
        status: editingGoal.status ?? 'pending' as GoalStatus
      });
    }
  }, [editingGoal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ketquaptpt' ? Math.min(Math.max(parseInt(value) || 0, 0), 100) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!formData.hmcv || !formData.yccc || !formData.ttcc) {
        alert('Vui lòng điền đầy đủ các thông tin bắt buộc');
        return;
      }

      onSave({
        ...formData,
        ketquaptpt: Number(formData.ketquaptpt)
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra khi lưu mục tiêu');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">
            {editingGoal ? 'Chỉnh sửa mục tiêu' : `Thêm mục tiêu mới - ${departmentName}`}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {/* User Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhân viên</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          {/* Department Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bộ phận</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
              <input
                type="text"
                name="room"
                value={formData.room}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          {/* Goal Information */}
          <div className="space-y-4 mb-6">
          <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại mục tiêu</label>
                    <select
                      name="loaimuctieu"
                      value={formData.loaimuctieu}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn loại mục tiêu</option>
                      <option value="Năm">Năm</option>
                      <option value="Quý">Quý</option>
                      <option value="Tháng">Tháng</option>
                      <option value="Tuần">Tuần</option>
                    </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu cấp trên</label>
              <textarea
                name="muctiecaptren"
                value={formData.muctiecaptren}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu bản thân</label>
              <textarea
                name="muctiebanthan"
                value={formData.muctiebanthan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                placeholder="Vui lòng nhập mục tiêu bản thân"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hạng mục công việc <span className="text-red-500">*</span></label>
              <textarea
                name="hmcv"
                value={formData.hmcv}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                placeholder="Vui lòng nhập hạng mục công việc"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yêu cầu cung cấp phương tiện, dụng cụ <span className="text-red-500">*</span></label>
              <textarea
                name="yccc"
                value={formData.yccc}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                placeholder="Vui lòng nhập yêu cầu cung cấp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng cung cấp phương tiện, dụng cụ <span className="text-red-500">*</span></label>
              <textarea
                name="ttcc"
                value={formData.ttcc}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                placeholder="Vui lòng nhập tình trạng cung cấp"
              />
            </div>
          </div>

          {/* Progress and Status */}
          <div className="space-y-4 mb-6">
          <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Chưa bắt đầu</option>
                    <option value="in-progress">Đang thực hiện</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="delayed">Tạm hoãn</option>
                  </select>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kết quả làm được</label>
              <textarea
                name="ketqualamduoc"
                value={formData.ketqualamduoc}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kết quả phần trăm (%)</label>
                  <input
                    type="number"
                    name="ketquaptpt"
                    value={formData.ketquaptpt}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chưa làm được</label>
              <textarea
                name="chualamduoc"
                value={formData.chualamduoc}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nguyên nhân</label>
              <textarea
                name="nguyennhan"
                value={formData.nguyennhan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File kèm</label>
              <input
                type="text"
                name="filekem"
                value={formData.filekem}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              {editingGoal ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalPlanForm;
