import express from 'express';
import { db } from '../db.js';
import bcrypt from 'bcrypt';
const router = express.Router();

router.get('/', async (req, res) => {
  // Truy vấn tất cả người dùng từ bảng 'user'
  db.query('SELECT * FROM `user`', (err, userResult) => {
    if (err) {
      console.error('Lỗi truy vấn người dùng:', err.message);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    // Kiểm tra nếu không có người dùng nào
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Không có người dùng nào' });
    }

    // Duyệt qua từng user và lấy vai trò của họ từ bảng 'system_administrator'
    const usersWithRoles = [];

    let processedUsers = 0; // Biến đếm số lượng người dùng đã xử lý

    userResult.forEach(user => {
      // Truy vấn bảng system_administrator để lấy vai trò của người dùng
      db.query(
        'SELECT * FROM `system_administrator` WHERE admin_id = ?',
        [user.user_id], // admin_id là ID người dùng từ bảng `user`
        (err, roleResult) => {
          if (err) {
            console.error('Lỗi truy vấn vai trò:', err.message);
            return res.status(500).json({ message: 'Lỗi server' });
          }

          // Xác định vai trò
          const role = roleResult.length > 0 ? 'admin' : 'customer'; // Nếu có trong bảng system_administrator thì là admin, không có thì là customer

          // Thêm người dùng vào danh sách với vai trò
          usersWithRoles.push({
            ...user,
            id: user.user_id,
            role,
          });

          // Kiểm tra xem đã xử lý hết tất cả người dùng chưa
          processedUsers++;
          if (processedUsers === userResult.length) {
            res.json({
              message: 'Lấy danh sách người dùng thành công',
              users: usersWithRoles,
            });
          }
        }
      );
    });
  });
});

router.patch('/update', async (req, res) => {
  const {
    id,
    ssn,
    email,
    password,
    fname,
    lname,
    gender,
    dob,
    phone_no,
    address
  } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!id || !ssn || !email || !password || !fname || !lname || !gender || !dob || !phone_no || !address) {
    return res.status(400).json({ message: 'Thiếu thông tin đầu vào' });
  }

  // Gọi stored procedure
  const query = `CALL procedure_update_user(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [id, ssn, email, password, fname, lname, gender, dob, phone_no, address];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Lỗi khi gọi procedure:', err.message);
      return res.status(500).json({ message: 'Lỗi server khi cập nhật người dùng' });
    }

    res.json({ message: 'Cập nhật người dùng thành công' });
  });
});

router.post('/create', async (req, res) => {
  const {
    ssn,
    email,
    password,
    fname,
    lname,
    gender,
    dob,
    phone_no,
    address
  } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!ssn || !email || !password || !fname || !lname || !gender || !dob || !phone_no || !address) {
    return res.status(400).json({ message: 'Thiếu thông tin đầu vào' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // độ mạnh là 10 salt rounds

    // Gọi stored procedure
    const query = `CALL procedure_insert_user(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [ssn, email, hashedPassword, fname, lname, gender, dob, phone_no, address];

    db.query(query, params, (err, result) => {
      if (err) {
        console.error('Lỗi khi gọi procedure:', err.message);
        return res.status(500).json({ message: 'Lỗi server khi tạo người dùng' });
      }

      res.json({ message: 'Tạo người dùng thành công', params });
    });
  } catch (error) {
    console.error('Lỗi khi hash mật khẩu:', error.message);
    res.status(500).json({ message: 'Lỗi server khi xử lý mật khẩu' });
  }
});


export default router;