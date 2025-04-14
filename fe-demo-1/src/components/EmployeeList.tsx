import React, { useState, useEffect } from 'react';
import { departments } from '../data/departments';
import { userAPI } from '../services/api';

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  department?: string;
  room?: string;
  position?: string;
  phone?: string;
  time: string;
}

interface EmployeeListProps {
  onBack: () => void;
  onUserCountChange: (count: number) => void;  // Thêm prop mới
}

const EmployeeList: React.FC<EmployeeListProps> = ({ onBack, onUserCountChange }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Danh sách các chức vụ có sẵn
  const positionOptions = ['Nhân viên', 'Trưởng phòng', 'Trưởng bộ phận', 'Giám đốc'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
      onUserCountChange(response.data.length); // Cập nhật số lượng người dùng
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const response = await userAPI.deleteUser(userId);
        if (response.status === 200) {
          fetchUsers();
        } else {
          alert('Có lỗi xảy ra khi xóa người dùng');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdateUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      // Tạo object chứa tất cả thông tin cần cập nhật
      const dataToUpdate = {
        username: updatedData.username,
        email: updatedData.email,
        phone: updatedData.phone || '', // Thêm phone vào dữ liệu cập nhật
        department: updatedData.department || '',
        room: updatedData.room || '',
        position: updatedData.position || ''
      };

      const response = await userAPI.updateUser(userId, dataToUpdate);

      if (response.status === 200) {
        setEditingUser(null);
        fetchUsers();
      } else {
        alert('Không thể cập nhật người dùng');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      alert('Có lỗi xảy ra khi cập nhật người dùng');
    }
  };

  // Thêm hàm để lấy danh sách tên bộ phận
  const getDepartmentNames = () => {
    return departments.map(dept => dept.name);
  };

  // Thêm hàm để lấy danh sách phòng ban dựa trên bộ phận được chọn
  const getRoomsByDepartment = (departmentName: string) => {
    const department = departments.find(dept => dept.name === departmentName);
    return department ? department.subDepartments : [];
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Danh sách nhân viên</h1>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          Quay lại
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Tên người dùng</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Số điện thoại</th>
                <th className="px-4 py-2 text-left">Bộ Phận</th>
                <th className="px-4 py-2 text-left">Phòng Ban</th>
                <th className="px-4 py-2 text-left">Chức vụ</th>
                <th className="px-4 py-2 text-left">Thời gian đăng ký</th>
                <th className="px-4 py-2 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b">
                  {editingUser?._id === user._id ? (
                    // Edit mode
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editingUser.username}
                          onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editingUser.phone || ''}
                          onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editingUser.department || ''}
                          onChange={(e) => {
                            // Reset room when department changes
                            setEditingUser({
                              ...editingUser,
                              department: e.target.value,
                              room: ''
                            });
                          }}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="">Chọn bộ phận</option>
                          {getDepartmentNames().map((deptName) => (
                            <option key={deptName} value={deptName}>
                              {deptName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editingUser.room || ''}
                          onChange={(e) => setEditingUser({...editingUser, room: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                          disabled={!editingUser.department}
                        >
                          <option value="">Chọn phòng ban</option>
                          {editingUser.department &&
                            getRoomsByDepartment(editingUser.department).map((room) => (
                              <option key={room.id} value={room.name}>
                                {room.name}
                              </option>
                            ))
                          }
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editingUser.position || ''}
                          onChange={(e) => setEditingUser({...editingUser, position: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="">Chọn chức vụ</option>
                          {positionOptions.map((position) => (
                            <option key={position} value={position}>
                              {position}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">{user.time}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleUpdateUser(user._id, editingUser)}
                          className="text-green-600 hover:text-green-800 mr-2"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Hủy
                        </button>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.phone || '-'}</td>
                      <td className="px-4 py-2">{user.department || '-'}</td>
                      <td className="px-4 py-2">{user.room || '-'}</td>
                      <td className="px-4 py-2">{user.position || '-'}</td>
                      <td className="px-4 py-2">{user.time}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Xóa
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;