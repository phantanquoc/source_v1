const TaoQuyTrinh = require('../models/TaoQuyTrinh');
const QuyTrinhHistory = require('../models/QuyTrinhHistory');
const moment = require('moment-timezone');

// Lấy tất cả quy trình (bao gồm cả các bản lịch sử)
exports.getAllQuyTrinh = async (req, res) => {
  try {
    // Lấy tất cả quy trình, bao gồm cả các bản lịch sử
    // Đã bỏ điều kiện lọc các bản lịch sử
    const quyTrinhs = await TaoQuyTrinh.find({});
    res.status(200).json(quyTrinhs);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách quy trình',
      error: error.message
    });
  }
};

// Lấy quy trình theo ID
exports.getQuyTrinhById = async (req, res) => {
  try {
    const quyTrinh = await TaoQuyTrinh.findById(req.params.id);

    if (!quyTrinh) {
      return res.status(404).json({ message: 'Không tìm thấy quy trình' });
    }

    res.status(200).json(quyTrinh);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy thông tin quy trình',
      error: error.message
    });
  }
};

// Tạo quy trình mới
exports.createQuyTrinh = async (req, res) => {
  try {
    // Log dữ liệu để kiểm tra
    console.log('Dữ liệu gửi lên khi tạo mới:', req.body);
    console.log('Các công đoạn khi tạo mới:', req.body.congdoans);

    // Xử lý dữ liệu đầu vào
    const inputData = { ...req.body };

    // Đảm bảo rằng congdoans là một mảng
    if (inputData.congdoans && !Array.isArray(inputData.congdoans)) {
      try {
        inputData.congdoans = JSON.parse(inputData.congdoans);
      } catch (e) {
        console.error('Lỗi khi parse congdoans:', e);
        inputData.congdoans = [];
      }
    }

    // Xử lý dữ liệu công đoạn
    if (Array.isArray(inputData.congdoans)) {
      // Thêm thứ tự cho các công đoạn
      inputData.congdoans = inputData.congdoans.map((cd, index) => ({
        ...cd,
        thutu: index + 1
      }));

      // Nếu có công đoạn 1 (công đoạn cũ), thêm vào đầu mảng nếu chưa có
      if (inputData.congdoan && inputData.congdoans.length > 0) {
        // Kiểm tra xem công đoạn 1 đã có trong mảng chưa
        const hasCongDoan1 = inputData.congdoans.some(cd => cd.ten === inputData.congdoan);

        if (!hasCongDoan1) {
          // Thêm công đoạn 1 vào đầu mảng
          inputData.congdoans.unshift({
            ten: inputData.congdoan || '',
            noidung: inputData.noidung || '',
            bieumau: inputData.filekem || '',
            thutu: 1
          });

          // Cập nhật lại thứ tự cho các công đoạn còn lại
          inputData.congdoans = inputData.congdoans.map((cd, index) => ({
            ...cd,
            thutu: index + 1
          }));
        }
      }

      console.log('Các công đoạn sau khi xử lý:', inputData.congdoans);
    }

    // Tạo quy trình mới từ dữ liệu gửi lên
    const newQuyTrinh = new TaoQuyTrinh({
      ...inputData,
      datetao: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
      datechinhsua: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
      dateduyet: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
      status: inputData.status || 'pending',
      chinhsualanth: 0,
      nguoichinhsua: inputData.username // Người tạo cũng là người chỉnh sửa đầu tiên
    });

    // Lưu vào database
    const savedQuyTrinh = await newQuyTrinh.save();

    console.log('Quy trình sau khi lưu:', savedQuyTrinh);

    res.status(201).json(savedQuyTrinh);
  } catch (error) {
    console.error('Lỗi chi tiết khi tạo quy trình:', error);
    res.status(500).json({
      message: 'Lỗi khi tạo quy trình mới',
      error: error.message
    });
  }
};

// Cập nhật quy trình
exports.updateQuyTrinh = async (req, res) => {
  try {
    // Tìm quy trình hiện tại
    const currentQuyTrinh = await TaoQuyTrinh.findById(req.params.id);

    if (!currentQuyTrinh) {
      return res.status(404).json({ message: 'Không tìm thấy quy trình' });
    }

    // Giữ nguyên số lần chỉnh sửa (chỉ tăng khi duyệt)
    const chinhsualanth = currentQuyTrinh.chinhsualanth || 0;

    // Log dữ liệu để kiểm tra
    console.log('Dữ liệu gửi lên:', req.body);
    console.log('Các công đoạn:', req.body.congdoans);

    // Cập nhật thông tin chỉnh sửa
    const updateData = {
      ...req.body,
      chinhsualanth,
      datechinhsua: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
      nguoichinhsua: req.body.nguoichinhsua || req.body.username
    };

    // Đảm bảo rằng congdoans là một mảng
    if (updateData.congdoans && !Array.isArray(updateData.congdoans)) {
      try {
        updateData.congdoans = JSON.parse(updateData.congdoans);
      } catch (e) {
        console.error('Lỗi khi parse congdoans:', e);
        updateData.congdoans = [];
      }
    }

    // Xử lý dữ liệu công đoạn
    if (Array.isArray(updateData.congdoans)) {
      // Thêm thứ tự cho các công đoạn
      updateData.congdoans = updateData.congdoans.map((cd, index) => ({
        ...cd,
        thutu: index + 1
      }));

      // Nếu có công đoạn 1 (công đoạn cũ), thêm vào đầu mảng nếu chưa có
      if (updateData.congdoan && updateData.congdoans.length > 0) {
        // Kiểm tra xem công đoạn 1 đã có trong mảng chưa
        const hasCongDoan1 = updateData.congdoans.some(cd => cd.ten === updateData.congdoan);

        if (!hasCongDoan1) {
          // Thêm công đoạn 1 vào đầu mảng
          updateData.congdoans.unshift({
            ten: updateData.congdoan || '',
            noidung: updateData.noidung || '',
            bieumau: updateData.filekem || '',
            thutu: 1
          });

          // Cập nhật lại thứ tự cho các công đoạn còn lại
          updateData.congdoans = updateData.congdoans.map((cd, index) => ({
            ...cd,
            thutu: index + 1
          }));
        }
      }

      // Lọc bỏ các công đoạn không có tên
      updateData.congdoans = updateData.congdoans.filter(cd => cd.ten && cd.ten.trim() !== '');

      console.log('Các công đoạn sau khi xử lý (update):', updateData.congdoans);
    }

    // Lưu lịch sử quy trình trước khi cập nhật
    const historyData = {
      original_id: currentQuyTrinh._id.toString(),
      version: currentQuyTrinh.chinhsualanth || 1, // Phiên bản hiện tại
      history_date: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),

      // Sao chép tất cả dữ liệu của quy trình hiện tại
      id: currentQuyTrinh.id,
      tenquytrinh: currentQuyTrinh.tenquytrinh,
      loaiquytrinh: currentQuyTrinh.loaiquytrinh,
      username: currentQuyTrinh.username,
      datetao: currentQuyTrinh.datetao,
      nguoichinhsua: currentQuyTrinh.nguoichinhsua,
      datechinhsua: currentQuyTrinh.datechinhsua,
      nguoiduyet: currentQuyTrinh.nguoiduyet,
      dateduyet: currentQuyTrinh.dateduyet,
      congdoan: currentQuyTrinh.congdoan,
      noidung: currentQuyTrinh.noidung,
      filekem: currentQuyTrinh.filekem,
      status: currentQuyTrinh.status,
      chinhsualanth: currentQuyTrinh.chinhsualanth,
      congdoans: currentQuyTrinh.congdoans
    };

    // Lưu lịch sử vào database
    const newHistory = new QuyTrinhHistory(historyData);
    await newHistory.save();

    console.log('Đã lưu lịch sử quy trình phiên bản:', historyData.version);

    // Tìm và cập nhật quy trình
    const updatedQuyTrinh = await TaoQuyTrinh.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Trả về document đã được cập nhật
    );

    console.log('Quy trình sau khi cập nhật:', updatedQuyTrinh);

    res.status(200).json(updatedQuyTrinh);
  } catch (error) {
    console.error('Lỗi chi tiết:', error);
    res.status(500).json({
      message: 'Lỗi khi cập nhật quy trình',
      error: error.message
    });
  }
};

// Xóa quy trình và tất cả các phiên bản lịch sử của nó
exports.deleteQuyTrinh = async (req, res) => {
  try {
    // Tìm quy trình cần xóa
    const quyTrinhToDelete = await TaoQuyTrinh.findById(req.params.id);

    if (!quyTrinhToDelete) {
      return res.status(404).json({ message: 'Không tìm thấy quy trình' });
    }

    // Lấy ID của quy trình
    const baseId = quyTrinhToDelete.id;

    // Xóa quy trình chính
    await TaoQuyTrinh.findByIdAndDelete(req.params.id);

    // Xóa tất cả các phiên bản lịch sử của quy trình này trong collection taoquytrinh
    // Xóa cả các bản lịch sử cũ (không có trường is_history)
    const deleteHistoryResult = await TaoQuyTrinh.deleteMany({
      id: { $regex: `^${baseId}-version-` }
    });

    // Xóa tất cả các phiên bản lịch sử của quy trình này trong collection quytrinhhistory
    const deleteOldHistoryResult = await QuyTrinhHistory.deleteMany({
      original_id: req.params.id
    });

    console.log(`Đã xóa ${deleteHistoryResult.deletedCount} phiên bản lịch sử trong taoquytrinh và ${deleteOldHistoryResult.deletedCount} phiên bản trong quytrinhhistory của quy trình ${baseId}`);

    res.status(200).json({
      message: 'Xóa quy trình thành công',
      deletedHistoryCount: deleteHistoryResult.deletedCount,
      deletedOldHistoryCount: deleteOldHistoryResult.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi xóa quy trình',
      error: error.message
    });
  }
};

// Lấy lịch sử quy trình
exports.getQuyTrinhHistory = async (req, res) => {
  try {
    const originalId = req.params.id;

    // Tìm quy trình gốc
    const originalQuyTrinh = await TaoQuyTrinh.findById(originalId);

    if (!originalQuyTrinh) {
      return res.status(404).json({ message: 'Không tìm thấy quy trình' });
    }

    // Lấy tất cả các phiên bản lịch sử của quy trình này
    const historyVersions = await QuyTrinhHistory.find({ original_id: originalId })
      .sort({ version: 1 }); // Sắp xếp theo phiên bản tăng dần

    // Tạo mảng kết quả bao gồm cả phiên bản hiện tại
    const allVersions = [
      ...historyVersions,
      {
        ...originalQuyTrinh.toObject(),
        version: originalQuyTrinh.chinhsualanth,
        is_current: true // Đánh dấu là phiên bản hiện tại
      }
    ];

    // Sắp xếp lại theo phiên bản
    allVersions.sort((a, b) => (a.version || 0) - (b.version || 0));

    res.status(200).json(allVersions);
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử quy trình:', error);
    res.status(500).json({
      message: 'Lỗi khi lấy lịch sử quy trình',
      error: error.message
    });
  }
};

// Duyệt quy trình
exports.approveQuyTrinh = async (req, res) => {
  try {
    // Lấy thông tin người duyệt từ request
    const { nguoiduyet } = req.body;

    if (!nguoiduyet) {
      return res.status(400).json({ message: 'Thiếu thông tin người duyệt' });
    }

    // Tìm quy trình hiện tại
    const currentQuyTrinh = await TaoQuyTrinh.findById(req.params.id);

    if (!currentQuyTrinh) {
      return res.status(404).json({ message: 'Không tìm thấy quy trình' });
    }

    // Tăng số lần chỉnh sửa khi duyệt
    const chinhsualanth = (currentQuyTrinh.chinhsualanth || 0) + 1;

    // Cập nhật trạng thái và thông tin duyệt
    const approvedQuyTrinh = await TaoQuyTrinh.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed', // Đã ban hành (chỉ có 2 trạng thái: pending và completed)
        nguoiduyet,
        dateduyet: moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH:mm:ss'),
        chinhsualanth: chinhsualanth, // Tăng số lần chỉnh sửa khi duyệt
        // Cập nhật thêm các trường khác nếu cần
      },
      { new: true }
    );

    res.status(200).json(approvedQuyTrinh);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi duyệt quy trình',
      error: error.message
    });
  }
};

// Xóa tất cả các bản lịch sử trong database (chỉ dùng cho admin)
exports.deleteAllHistoryVersions = async (req, res) => {
  try {
    // Xóa tất cả các bản có ID chứa chuỗi "-version-" trong collection taoquytrinh
    const deleteResult = await TaoQuyTrinh.deleteMany({
      id: { $regex: '-version-' }
    });

    // Xóa tất cả các bản lịch sử trong collection quytrinhhistory
    const deleteOldResult = await QuyTrinhHistory.deleteMany({});

    console.log(`Đã xóa ${deleteResult.deletedCount} bản lịch sử trong taoquytrinh và ${deleteOldResult.deletedCount} bản trong quytrinhhistory`);

    res.status(200).json({
      message: `Đã xóa ${deleteResult.deletedCount} bản lịch sử trong taoquytrinh và ${deleteOldResult.deletedCount} bản trong quytrinhhistory`
    });
  } catch (error) {
    console.error('Lỗi khi xóa các bản lịch sử:', error);
    res.status(500).json({
      message: 'Lỗi khi xóa các bản lịch sử',
      error: error.message
    });
  }
};
