import express from 'express';
import { db } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/login', async (req, res) => {
const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
  }

  // Truy vấn người dùng từ cơ sở dữ liệu
  db.query('SELECT * FROM `user` WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn:', err.message);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }

    const user = result[0];

    // So sánh mật khẩu đã nhập với mật khẩu đã hash trong cơ sở dữ liệu
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Lỗi so sánh mật khẩu:', err.message);
        return res.status(500).json({ message: 'Lỗi server' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Sai mật khẩu' });
      }

      db.query(
        'SELECT * FROM system_administrator WHERE admin_id = ?',
        [user.user_id],
        (err, roleResult) => {
          if (err) {
            console.error('Lỗi truy vấn vai trò:', err.message);
            return res.status(500).json({ message: 'Lỗi server' });
          }

          const role = roleResult.length > 0 ? 'admin' : 'customer';

          const token = jwt.sign(
            { id: user.user_id, email: user.email, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          res.json({
            message: 'Đăng nhập thành công',
            user: {
              id: user.user_id,
              email: user.email,
              fname: user.fname,
              lname: user.lname,
              role,
            },
            token,
          });
        }
      );
    });
  });
});

export default router;