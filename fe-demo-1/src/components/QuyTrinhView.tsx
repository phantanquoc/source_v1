import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { quyTrinhAPI, userAPI } from '../services/api';

// Định nghĩa kiểu dữ liệu cho công đoạn
interface CongDoan {
  ten: string;
  noidung: string;
  bieumau: string;
  thutu?: number; // Thêm trường thứ tự
}

// Định nghĩa kiểu dữ liệu cho quy trình
interface QuyTrinh {
  _id?: string;
  id: string;
  tenquytrinh: string;
  loaiquytrinh: string;
  username: string;
  datetao?: string;
  dateduyet?: string;
  nguoiduyet?: string;
  ketqualamduoc?: string;
  ketquaptpt?: number;
  chualamduoc?: string;
  nguyennhan?: string;
  nguoibaocao?: string;
  status?: string;
  filekem?: string;
  congdoan?: string;
  noidung?: string;
  luudo?: string;
  congdoans?: CongDoan[];
  datechinhsua?: string;
  nguoichinhsua?: string;
  chinhsualanth?: number;
  // Trường mới cho lịch sử quy trình
  original_id?: string; // ID của quy trình gốc
  version?: number; // Số phiên bản
  is_current?: boolean; // Đánh dấu là phiên bản hiện tại
  history_date?: string; // Ngày tạo bản lịch sử
}

// Định nghĩa kiểu dữ liệu cho thông tin người dùng
interface UserInfo {
  username: string;
  id: string;
  department?: string;
  room?: string;
  position?: string;
  email: string;
}

interface QuyTrinhViewProps {
  onBack?: () => void;
}

const QuyTrinhView: React.FC<QuyTrinhViewProps> = ({ onBack }) => {
  // State
  const [quyTrinhs, setQuyTrinhs] = useState<QuyTrinh[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuyTrinh, setEditingQuyTrinh] = useState<QuyTrinh | null>(null);
  const [formData, setFormData] = useState<QuyTrinh>({
    id: '',
    tenquytrinh: '',
    loaiquytrinh: '',
    username: '',
    congdoan: '',
    noidung: '',
    luudo: '',
    filekem: '',
    congdoans: [{ ten: '', noidung: '', bieumau: '' }],
  });

  // State cho modal lịch sử quy trình
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedQuyTrinh, setSelectedQuyTrinh] = useState<QuyTrinh | null>(null);
  const [quyTrinhVersions, setQuyTrinhVersions] = useState<QuyTrinh[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number>(0);

  // State để quản lý số lượng công đoạn
  const [congDoanCount, setCongDoanCount] = useState(1);

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem('apf_email');
        if (email) {
          const userResponse = await userAPI.getUserByEmail(email);
          setUserInfo(userResponse.data);

          const quyTrinhResponse = await quyTrinhAPI.getAllQuyTrinh();
          setQuyTrinhs(quyTrinhResponse.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching data:', error.response?.data);
        } else {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []);

  // Hàm tạo mã quy trình tự động
  const generateProcessCode = (loaiQuyTrinh: string) => {
    let prefix = '';
    let filteredProcesses = [];

    // Xác định tiền tố và lọc quy trình theo loại
    switch (loaiQuyTrinh) {
      case 'Sản xuất':
        prefix = 'QTSX';
        filteredProcesses = quyTrinhs.filter(qt => qt.loaiquytrinh === 'Sản xuất');
        break;
      case 'Quản lý':
        prefix = 'QTQL';
        filteredProcesses = quyTrinhs.filter(qt => qt.loaiquytrinh === 'Quản lý');
        break;
      case 'Kiểm tra':
        prefix = 'QTKT';
        filteredProcesses = quyTrinhs.filter(qt => qt.loaiquytrinh === 'Kiểm tra');
        break;
      default:
        // Loại quy trình khác không tạo mã tự động
        return '';
    }

    // Tính toán số thứ tự tiếp theo
    const nextNumber = filteredProcesses.length + 1;

    // Tạo mã theo định dạng QT+[Loại]+số thứ tự
    return `${prefix}${String(nextNumber).padStart(3, '0')}`;
  };

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Nếu thay đổi loại quy trình
    if (name === 'loaiquytrinh') {
      // Tạo mã quy trình tự động nếu là quy trình mới (không có _id)
      if (!editingQuyTrinh?._id) {
        // Kiểm tra xem loại quy trình có hỗ trợ tạo mã tự động không
        if (['Sản xuất', 'Quản lý', 'Kiểm tra'].includes(value)) {
          const processCode = generateProcessCode(value);
          if (processCode) {
            setFormData({
              ...formData,
              loaiquytrinh: value,
              id: processCode
            });
            return;
          }
        } else {
          // Nếu là loại quy trình khác, xóa mã quy trình để người dùng nhập thủ công
          setFormData({
            ...formData,
            loaiquytrinh: value,
            id: ''
          });
          return;
        }
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Xử lý thay đổi input cho công đoạn
  const handleCongDoanChange = (index: number, field: keyof CongDoan, value: string) => {
    const updatedCongDoans = [...(formData.congdoans || [])];
    if (updatedCongDoans[index]) {
      updatedCongDoans[index] = {
        ...updatedCongDoans[index],
        [field]: value
      };
      setFormData({
        ...formData,
        congdoans: updatedCongDoans
      });
    }
  };

  // Xử lý thêm công đoạn mới
  const handleAddCongDoan = () => {
    console.log('Thêm công đoạn mới');
    console.log('Các công đoạn hiện tại:', formData.congdoans);

    // Tính toán thứ tự cho công đoạn mới
    const currentCongDoans = [...(formData.congdoans || [])];
    const newThuTu = currentCongDoans.length + 1;

    // Tạo công đoạn mới với thứ tự
    const newCongDoan = {
      ten: '',
      noidung: '',
      bieumau: '',
      thutu: newThuTu
    };

    const updatedCongDoans = [...currentCongDoans, newCongDoan];

    console.log('Các công đoạn sau khi thêm:', updatedCongDoans);

    setFormData({
      ...formData,
      congdoans: updatedCongDoans
    });
    setCongDoanCount(prev => prev + 1);
  };

  // Xử lý xóa công đoạn
  const handleRemoveCongDoan = (index: number) => {
    console.log('Xóa công đoạn tại vị trí:', index);
    console.log('Các công đoạn hiện tại:', formData.congdoans);

    // Chỉ cho phép xóa các công đoạn từ thứ 2 trở đi (index > 0)
    if (index > 0 && formData.congdoans) {
      const updatedCongDoans = [...formData.congdoans];
      updatedCongDoans.splice(index, 1);

      // Cập nhật lại thứ tự cho các công đoạn còn lại
      const reorderedCongDoans = updatedCongDoans.map((cd, idx) => ({
        ...cd,
        thutu: idx + 1
      }));

      console.log('Các công đoạn sau khi xóa và sắp xếp lại:', reorderedCongDoans);

      setFormData({
        ...formData,
        congdoans: reorderedCongDoans
      });

      setCongDoanCount(prev => prev - 1);
    }
  };

  // Xử lý khi nhấn nút tạo mới
  const handleCreate = () => {
    setEditingQuyTrinh(null);

    // Khởi tạo form data với các giá trị mặc định
    // Mã quy trình sẽ được tạo tự động khi người dùng chọn loại quy trình
    setFormData({
      id: '',
      tenquytrinh: '',
      loaiquytrinh: '',
      username: userInfo?.username || '',
      congdoan: '',
      noidung: '',
      luudo: '',
      filekem: '',
      congdoans: [{ ten: '', noidung: '', bieumau: '' }],
    });

    setCongDoanCount(1);
    setShowForm(true);
  };

  // Xử lý khi nhấn nút chỉnh sửa
  const handleEdit = (quyTrinh: QuyTrinh) => {
    setEditingQuyTrinh(quyTrinh);

    // Kiểm tra xem quy trình có các công đoạn không
    // Nếu không có, tạo một mảng rỗng
    let congdoans = quyTrinh.congdoans || [];

    // Log dữ liệu để kiểm tra
    console.log('Quy trình được chỉnh sửa:', quyTrinh);
    console.log('Các công đoạn:', congdoans);

    // Nếu có ít nhất một công đoạn
    if (congdoans.length > 0) {
      // Lấy công đoạn đầu tiên làm công đoạn 1
      const firstCongDoan = congdoans[0];

      // Cập nhật formData với công đoạn 1
      setFormData({
        ...quyTrinh,
        congdoan: firstCongDoan.ten || '',
        noidung: firstCongDoan.noidung || '',
        filekem: firstCongDoan.bieumau || '',
        congdoans: congdoans
      });
    } else {
      // Nếu không có công đoạn nào, tạo một mảng rỗng
      setFormData({
        ...quyTrinh,
        congdoans: [{ ten: '', noidung: '', bieumau: '' }]
      });
    }

    // Đếm số lượng công đoạn
    setCongDoanCount(Math.max(1, congdoans.length));

    setShowForm(true);
  };

  // Xử lý khi lưu quy trình
  const handleSave = async () => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!formData.id || !formData.tenquytrinh || !formData.loaiquytrinh) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Chuẩn bị dữ liệu để gửi lên server
      // Xử lý dữ liệu công đoạn
      // Đảm bảo rằng chúng ta lưu cả công đoạn 1 và các công đoạn khác
      const currentCongDoans = [...(formData.congdoans || [])];

      // Công đoạn 1 (công đoạn cũ) sẽ được lưu riêng
      const congDoan1 = {
        ten: formData.congdoan || '',
        noidung: formData.noidung || '',
        bieumau: formData.filekem || '',
        thutu: 1
      };

      // Log dữ liệu để kiểm tra
      console.log('Công đoạn 1:', congDoan1);
      console.log('Các công đoạn hiện tại:', currentCongDoans);

      // Kiểm tra xem công đoạn 1 đã có trong mảng chưa
      const hasCongDoan1 = currentCongDoans.some(cd => cd.thutu === 1);

      // Tạo một mảng mới bao gồm cả công đoạn 1 và các công đoạn khác
      let allCongDoans = [];

      if (congDoan1.ten.trim() !== '') {
        if (!hasCongDoan1) {
          // Nếu công đoạn 1 chưa có trong mảng, thêm vào
          allCongDoans = [congDoan1, ...currentCongDoans];
        } else {
          // Nếu công đoạn 1 đã có trong mảng, cập nhật nó
          allCongDoans = currentCongDoans.map(cd => {
            if (cd.thutu === 1) {
              return { ...congDoan1, thutu: 1 };
            }
            return cd;
          });
        }
      } else {
        // Nếu không có công đoạn 1, sử dụng các công đoạn hiện tại
        allCongDoans = [...currentCongDoans];
      }

      // Lọc bỏ các công đoạn không có tên
      const filteredCongDoans = allCongDoans.filter(cd => cd.ten && cd.ten.trim() !== '');

      // Sắp xếp lại các công đoạn theo thứ tự
      const sortedCongDoans = filteredCongDoans
        .sort((a, b) => (a.thutu || 0) - (b.thutu || 0))
        .map((cd, index) => ({ ...cd, thutu: index + 1 }));

      console.log('Tất cả các công đoạn sau khi xử lý:', sortedCongDoans);

      const dataToSave = {
        ...formData,
        congdoans: sortedCongDoans
      };

      if (editingQuyTrinh?._id) {
        // Cập nhật trực tiếp quy trình hiện tại và lưu lịch sử chỉnh sửa

        // Lấy số lần chỉnh sửa hiện tại (không tăng khi chỉnh sửa, chỉ tăng khi duyệt)
        const currentEditCount = editingQuyTrinh.chinhsualanth || 0;

        // Lưu lịch sử quy trình trước khi cập nhật
        // Tạo một bản sao của quy trình hiện tại với ID có hậu tố là số lần chỉnh sửa
        const baseId = editingQuyTrinh.id.includes('-')
          ? editingQuyTrinh.id.split('-')[0]
          : editingQuyTrinh.id;

        // Lưu lịch sử quy trình hiện tại với ID mới
        const historyData = {
          ...editingQuyTrinh,
          _id: undefined, // Loại bỏ _id để MongoDB tạo mới
          id: `${baseId}-version-${currentEditCount}`, // ID phiên bản (ví dụ: QTSX001-version-1)
          is_history: true, // Đánh dấu là bản lịch sử
          version_number: currentEditCount, // Số phiên bản
          history_date: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss')
        };

        // Lưu lịch sử
        await quyTrinhAPI.createQuyTrinh(historyData);

        // Cập nhật quy trình hiện tại
        const updatedData = {
          ...dataToSave,
          nguoichinhsua: userInfo?.username || '', // Người chỉnh sửa hiện tại
          datechinhsua: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
          chinhsualanth: currentEditCount, // Giữ nguyên số lần chỉnh sửa (chỉ tăng khi duyệt)
          current_version: currentEditCount, // Phiên bản hiện tại
          status: 'pending', // Đặt lại trạng thái thành "Chờ duyệt"
          nguoiduyet: '', // Xóa thông tin người duyệt
          dateduyet: '' // Xóa ngày duyệt
        };

        // Cập nhật quy trình
        const response = await quyTrinhAPI.updateQuyTrinh(editingQuyTrinh._id, updatedData);
        if (response.status === 200) {
          setQuyTrinhs(quyTrinhs.map(qt =>
            qt._id === editingQuyTrinh._id ? response.data : qt
          ));
          alert('Cập nhật quy trình thành công');
        }
      } else {
        // Tạo quy trình mới
        const response = await quyTrinhAPI.createQuyTrinh(dataToSave);
        if (response.status === 201) {
          setQuyTrinhs([...quyTrinhs, response.data]);
          alert('Tạo quy trình thành công');
        }
      }

      setShowForm(false);
      setEditingQuyTrinh(null);
      setCongDoanCount(1);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error saving quy trinh:', error.response?.data);
        alert(`Có lỗi xảy ra khi lưu quy trình: ${error.response?.data?.message || error.message}`);
      } else {
        console.error('Error saving quy trinh:', error);
        alert('Có lỗi không xác định khi lưu quy trình');
      }
    }
  };

  // Xử lý khi xóa quy trình
  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      alert('Không thể xóa quy trình này - ID không hợp lệ');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa quy trình này?')) {
      try {
        const response = await quyTrinhAPI.deleteQuyTrinh(id);
        if (response.status === 200) {
          setQuyTrinhs(quyTrinhs.filter(qt => qt._id !== id));
          const deletedHistoryCount = response.data.deletedHistoryCount || 0;
          const deletedOldHistoryCount = response.data.deletedOldHistoryCount || 0;

          if (deletedHistoryCount > 0 || deletedOldHistoryCount > 0) {
            alert(`Xóa quy trình thành công và đã xóa ${deletedHistoryCount} phiên bản lịch sử mới và ${deletedOldHistoryCount} phiên bản lịch sử cũ`);
          } else {
            alert('Xóa quy trình thành công');
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error deleting quy trinh:', error.response?.data);
          alert(`Có lỗi xảy ra khi xóa quy trình: ${error.response?.data?.message || error.message}`);
        } else {
          console.error('Error deleting quy trinh:', error);
          alert('Có lỗi không xác định khi xóa quy trình');
        }
      }
    }
  };

  // Xử lý khi duyệt quy trình
  const handleApprove = async (id: string | undefined) => {
    if (!id) {
      alert('Không thể duyệt quy trình này - ID không hợp lệ');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn duyệt quy trình này?')) {
      try {
        const response = await quyTrinhAPI.approveQuyTrinh(id, userInfo?.username || 'Unknown');

        if (response.status === 200 && response.data) {
          setQuyTrinhs(quyTrinhs.map(qt =>
            qt._id === id ? response.data : qt
          ));
          alert('Duyệt quy trình thành công');
        } else {
          throw new Error('Không nhận được phản hồi từ server');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error approving quy trinh:', error.response?.data);
          alert(`Có lỗi xảy ra khi duyệt quy trình: ${error.response?.data?.message || error.message}`);
        } else {
          console.error('Error approving quy trinh:', error);
          alert('Có lỗi không xác định khi duyệt quy trình');
        }
      }
    }
  };

  // Hiển thị trạng thái quy trình
  const renderStatus = (status: string | undefined) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Đã ban hành</span>;
      default:
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Chờ duyệt</span>;
    }
  };

  // Hiển thị số lần chỉnh sửa
  const renderEditCount = (quyTrinh: QuyTrinh) => {
    const editCount = quyTrinh.chinhsualanth || 0;
    return editCount;
  };

  // Hàm này đã được thay thế bằng kiểm tra trực tiếp trong JSX
  // const canViewHistory = (quyTrinh: QuyTrinh) => {
  //   const editCount = quyTrinh.chinhsualanth || 0;
  //   return editCount >= 1;
  // };

  // Xử lý khi xem lịch sử quy trình
  const handleViewHistory = async (quyTrinh: QuyTrinh) => {
    try {
      if (!quyTrinh._id) {
        alert('Không thể xem lịch sử quy trình này - ID không hợp lệ');
        return;
      }

      // Gọi API để lấy lịch sử quy trình
      const response = await quyTrinhAPI.getQuyTrinhHistory(quyTrinh._id);

      if (response.status === 200 && response.data) {
        // Lấy dữ liệu lịch sử
        const historyData = response.data;

        console.log('Lịch sử quy trình:', historyData);

        // Cập nhật state để hiển thị modal lịch sử
        setSelectedQuyTrinh(quyTrinh);
        setQuyTrinhVersions(historyData);
        setSelectedVersion(0); // Chọn phiên bản hiện tại mặc định
        setShowHistoryModal(true);
      } else {
        throw new Error('Không nhận được phản hồi từ server');
      }
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử quy trình:', error);
      alert('Có lỗi xảy ra khi lấy lịch sử quy trình');
    }
  };

  // Đóng modal lịch sử
  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedQuyTrinh(null);
    setQuyTrinhVersions([]);
  };

  // Thay đổi phiên bản được chọn
  const handleVersionChange = (version: number) => {
    setSelectedVersion(version);
  };

  return (
    <div className="p-4">
      {/* Modal xem lịch sử quy trình */}
      {showHistoryModal && selectedQuyTrinh && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Lịch sử quy trình: {selectedQuyTrinh.tenquytrinh}</h2>
                <button
                  onClick={handleCloseHistoryModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn phiên bản:</label>
                <div className="flex flex-wrap gap-2">
                  {quyTrinhVersions.map((version, index) => {
                    // Xác định loại phiên bản
                    const isCurrentVersion = version.is_current === true;
                    const versionNumber = version.version || index + 1;
                    const versionLabel = isCurrentVersion
                      ? `Phiên bản hiện tại (${versionNumber})`
                      : `Phiên bản ${versionNumber}`;

                    return (
                      <button
                        key={version._id}
                        onClick={() => handleVersionChange(index)}
                        className={`px-3 py-1 rounded ${selectedVersion === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        {versionLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                {quyTrinhVersions
                  .filter((_, index) => index === selectedVersion)
                  .map(selectedVersionData => {
                    // Xác định loại phiên bản
                    const isCurrentVersion = selectedVersionData.is_current === true;
                    const versionNumber = selectedVersionData.version || 1;
                    const versionTitle = isCurrentVersion
                      ? `Phiên bản hiện tại (${versionNumber})`
                      : `Phiên bản ${versionNumber}`;

                    return (
                      <div key={selectedVersionData._id} className="p-4">
                        <h3 className="text-lg font-medium mb-2">{versionTitle}</h3>
                        {!isCurrentVersion && (
                          <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-sm text-yellow-700">
                              Đây là bản lưu trữ lịch sử tại thời điểm {selectedVersionData.history_date || '-'}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Mã quy trình:</p>
                            <p>{selectedVersionData.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Tên quy trình:</p>
                            <p>{selectedVersionData.tenquytrinh}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Loại quy trình:</p>
                            <p>{selectedVersionData.loaiquytrinh}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Trạng thái:</p>
                            <p>{selectedVersionData.status === 'completed' ? 'Đã ban hành' : 'Chờ duyệt'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Người tạo:</p>
                            <p>{selectedVersionData.username}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Ngày tạo:</p>
                            <p>{selectedVersionData.datetao}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Người chỉnh sửa:</p>
                            <p>{selectedVersionData.nguoichinhsua || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Ngày chỉnh sửa:</p>
                            <p>{selectedVersionData.datechinhsua || '-'}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-md font-medium mb-2">Các công đoạn:</h4>
                          {selectedVersionData.congdoans && selectedVersionData.congdoans.length > 0 ? (
                            <div className="space-y-4">
                              {selectedVersionData.congdoans.map((cd, index) => (
                                <div key={index} className="border rounded p-3">
                                  <h5 className="font-medium">Công đoạn {index + 1}: {cd.ten}</h5>
                                  <p className="text-sm text-gray-600 mt-1">Nội dung: {cd.noidung || '-'}</p>
                                  {cd.bieumau && <p className="text-sm text-gray-600">Biểu mẫu: {cd.bieumau}</p>}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Không có công đoạn nào</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay lại
        </button>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý quy trình</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tạo quy trình mới
        </button>
      </div>

      {/* Popup form tạo/chỉnh sửa quy trình */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b bg-gray-200 flex items-center">
              <img src="/logo-abf.png" alt="AB Foods Logo" className="h-10 mr-4" />
              <h2 className="text-xl font-bold uppercase">
                TẠO QUY TRÌNH
              </h2>
            </div>
            <div className="p-6">
              <table className="w-full border-collapse border">
                <tbody>
                  <tr>
                    <td className="border p-2 bg-gray-100 w-1/4">Mã quy trình <span className="text-red-500">*</span></td>
                    <td className="border p-2">
                      <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                        className="w-full p-1"
                        placeholder={!editingQuyTrinh?._id ? "Chọn loại quy trình để tạo mã tự động" : "Nhập mã quy trình"}
                        required
                        readOnly={['Sản xuất', 'Quản lý', 'Kiểm tra'].includes(formData.loaiquytrinh) && !editingQuyTrinh?._id}
                      />
                      {formData.loaiquytrinh === 'Sản xuất' && !editingQuyTrinh?._id && (
                        <p className="text-xs text-gray-500 mt-1">Mã quy trình được tạo tự động theo định dạng QTSX + số thứ tự</p>
                      )}
                      {formData.loaiquytrinh === 'Quản lý' && !editingQuyTrinh?._id && (
                        <p className="text-xs text-gray-500 mt-1">Mã quy trình được tạo tự động theo định dạng QTQL + số thứ tự</p>
                      )}
                      {formData.loaiquytrinh === 'Kiểm tra' && !editingQuyTrinh?._id && (
                        <p className="text-xs text-gray-500 mt-1">Mã quy trình được tạo tự động theo định dạng QTKT + số thứ tự</p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 bg-gray-100 w-1/4">Tên nhân viên:</td>
                    <td className="border p-2">
                      <input
                        type="text"
                        name="username"
                        value={formData.username || userInfo?.username || ''}
                        onChange={handleInputChange}
                        className="w-full p-1"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 bg-gray-100">Tên quy trình <span className="text-red-500">*</span></td>
                    <td className="border p-2">
                      <input
                        type="text"
                        name="tenquytrinh"
                        value={formData.tenquytrinh}
                        onChange={handleInputChange}
                        className="w-full p-1"
                        placeholder="Ghi tên quy trình"
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 bg-gray-100">Loại quy trình <span className="text-red-500">*</span></td>
                    <td className="border p-2">
                      <select
                        name="loaiquytrinh"
                        value={formData.loaiquytrinh}
                        onChange={handleInputChange}
                        className="w-full p-1"
                        required
                      >
                        <option value="">-- Chọn loại quy trình --</option>
                        <option value="Sản xuất">Sản xuất</option>
                        <option value="Quản lý">Quản lý</option>
                        <option value="Kiểm tra">Kiểm tra</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </td>
                  </tr>
                  {/* Tiêu đề Lưu đồ */}
                  <tr>
                    <td colSpan={2} className="border p-2 bg-blue-100 text-blue-800 font-bold rounded-t-md text-center">
                      LƯU ĐỒ
                    </td>
                  </tr>
                  {/* <tr>
                    <td colSpan={2} className="border p-2">
                      <input
                        type="text"
                        name="luudo"
                        value={formData.luudo || ''}
                        onChange={handleInputChange}
                        className="w-full p-1"
                        placeholder="Nhập thông tin lưu đồ"
                      />
                    </td>
                  </tr> */}
                  <tr>
                    <td colSpan={2} className="border p-2 bg-green-100 text-blue-800 font-bold rounded-t-md ">
                      CÔNG ĐOẠN 1
                    </td>
                  </tr>

                  {/* Hiển thị công đoạn đầu tiên (công đoạn cũ) */}
                  <tr>
                    <td className="border p-2 bg-gray-100">Tên công đoạn:</td>
                    <td className="border p-2">
                      <input
                        type="text"
                        name="congdoan"
                        value={formData.congdoan || ''}
                        onChange={handleInputChange}
                        className="w-full p-1"
                        placeholder="Ghi tên công đoạn"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 bg-gray-100">Nội dung công việc</td>
                    <td className="border p-2">
                      <textarea
                        name="noidung"
                        value={formData.noidung || ''}
                        onChange={handleInputChange}
                        className="w-full p-1"
                        rows={3}
                        placeholder="Ghi nội dung việc làm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 bg-gray-100">Biểu mẫu</td>
                    <td className="border p-2">
                      <input
                        type="text"
                        name="filekem"
                        value={formData.filekem || ''}
                        onChange={handleInputChange}
                        className="w-full p-1"
                        placeholder="File đính kèm"
                      />
                    </td>
                  </tr>

                  {/* Khoảng cách giữa các công đoạn */}
                  <tr>
                    <td colSpan={2} className="border-0 p-2"></td>
                  </tr>

                  {/* Hiển thị các công đoạn mới */}
                  {formData.congdoans && formData.congdoans.map((congdoan, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && ( // Chỉ hiển thị từ công đoạn thứ 2 trở đi
                        <>
                          {/* Tiêu đề công đoạn mới */}
                          <tr>
                            <td colSpan={2} className="border p-2 bg-green-100 text-green-800 font-bold rounded-t-md text-center">
                              <div className="flex justify-between items-center">
                                <span className="flex-grow text-center">CÔNG ĐOẠN {index + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCongDoan(index)}
                                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200"
                                  title="Xóa công đoạn này"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td className="border p-2 bg-gray-100">Tên công đoạn:</td>
                            <td className="border p-2">
                              <input
                                type="text"
                                value={congdoan.ten}
                                onChange={(e) => handleCongDoanChange(index, 'ten', e.target.value)}
                                className="w-full p-1"
                                placeholder={`Ghi tên công đoạn ${index + 1}`}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-2 bg-gray-100">Nội dung công việc</td>
                            <td className="border p-2">
                              <textarea
                                value={congdoan.noidung}
                                onChange={(e) => handleCongDoanChange(index, 'noidung', e.target.value)}
                                className="w-full p-1"
                                rows={3}
                                placeholder="Ghi nội dung việc làm"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-2 bg-gray-100">Biểu mẫu</td>
                            <td className="border p-2">
                              <input
                                type="text"
                                value={congdoan.bieumau}
                                onChange={(e) => handleCongDoanChange(index, 'bieumau', e.target.value)}
                                className="w-full p-1"
                                placeholder="File đính kèm"
                              />
                            </td>
                          </tr>

                          {/* Khoảng cách giữa các công đoạn */}
                          <tr>
                            <td colSpan={2} className="border-0 p-2"></td>
                          </tr>
                        </>
                      )}
                    </React.Fragment>
                  ))}

                  <tr>
                    <td colSpan={2} className="border-0 p-4">
                      <button
                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md shadow-md flex items-center justify-center transition-colors duration-200"
                        type="button"
                        onClick={handleAddCongDoan}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        THÊM CÔNG ĐOẠN MỚI
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 flex justify-center space-x-6">
                {editingQuyTrinh && (
                  <button
                    onClick={() => {
                      if (editingQuyTrinh._id) handleApprove(editingQuyTrinh._id);
                    }}
                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Duyệt quy trình
                  </button>
                )}

                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  tạo quy trình
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách quy trình */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-2 border text-sm font-normal">STT</th>
              <th className="py-2 px-2 border text-sm font-normal">Tên quy trình</th>
              <th className="py-2 px-2 border text-sm font-normal">Mã quy trình</th>
              <th className="py-2 px-2 border text-sm font-normal">Loại quy trình</th>
              <th className="py-2 px-2 border text-sm font-normal">Ngày tạo quy trình</th>
              <th className="py-2 px-2 border text-sm font-normal">Người tạo quy trình</th>
              <th className="py-2 px-2 border text-sm font-normal">Ngày chỉnh sửa</th>
              <th className="py-2 px-2 border text-sm font-normal">Người chỉnh sửa</th>
              <th className="py-2 px-2 border text-sm font-normal">Ngày duyệt quy trình</th>
              <th className="py-2 px-2 border text-sm font-normal">Người duyệt quy trình</th>
              <th className="py-2 px-2 border text-sm font-normal">Chỉnh sửa lần</th>
              <th className="py-2 px-2 border text-sm font-normal">Tình trạng</th>
              <th className="py-2 px-2 border text-sm font-normal">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {quyTrinhs.length > 0 ? (
              quyTrinhs.map((quyTrinh, index) => (
                <tr key={quyTrinh._id} className="hover:bg-gray-50">
                  <td className="py-2 px-2 border text-center">{index + 1}</td>
                  <td className="py-2 px-2 border">{quyTrinh.tenquytrinh}</td>
                  <td className="py-2 px-2 border">{quyTrinh.id}</td>
                  <td className="py-2 px-2 border">{quyTrinh.loaiquytrinh}</td>
                  <td className="py-2 px-2 border">{quyTrinh.datetao}</td>
                  <td className="py-2 px-2 border">{quyTrinh.username}</td>
                  <td className="py-2 px-2 border">{quyTrinh.datechinhsua || '-'}</td>
                  <td className="py-2 px-2 border">{quyTrinh.nguoichinhsua || '-'}</td>
                  <td className="py-2 px-2 border">{quyTrinh.dateduyet || '-'}</td>
                  <td className="py-2 px-2 border">{quyTrinh.nguoiduyet || '-'}</td>
                  <td className="py-2 px-2 border text-center">{renderEditCount(quyTrinh)}</td>
                  <td className="py-2 px-2 border">
                    {renderStatus(quyTrinh.status)}
                  </td>
                  <td className="py-2 px-2 border">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleEdit(quyTrinh)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        sửa
                      </button>
                      <button
                        onClick={() => handleDelete(quyTrinh._id)}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        Xóa
                      </button>
                      {quyTrinh.status !== 'completed' && (
                        <button
                          onClick={() => handleApprove(quyTrinh._id)}
                          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                        >
                          duyệt
                        </button>
                      )}
                      {/* Luôn hiển thị nút "Xem" bất kể số lần chỉnh sửa */}
                      <button
                        onClick={() => handleViewHistory(quyTrinh)}
                        className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                      >
                        Xem
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="py-4 px-4 text-center border">
                  Không có dữ liệu quy trình
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuyTrinhView;
