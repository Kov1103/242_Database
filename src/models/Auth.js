import { postData } from "../services/api";
import { jwtDecode } from 'jwt-decode';

export const login = async (email, password) => {
    return postData('/auth/login', { email, password }); // Gọi API lấy tất cả sự kiện
};

export const setSession = async (token) => {
    
    localStorage.setItem('token', token);
      
    // Giải mã token để lấy thông tin người dùng
    const decoded = jwtDecode(token);
    console.log(decoded);
    // Giả sử payload chứa thông tin user, lưu vào sessionStorage
    localStorage.setItem('user', JSON.stringify(decoded));
  
    console.log('Đã lưu thông tin người dùng vào sessionStorage:', decoded);

    return {
        token,
        user: decoded
    };
};

export const getSession = async () => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // Lấy thông tin người dùng từ localStorage
    const user = localStorage.getItem('user');
  
    // Nếu có token và user thì trả về cả 2 thông tin, nếu không trả về null
    return token && user ? { token, user: JSON.parse(user) } : null;
};