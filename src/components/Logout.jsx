// src/components/Logout.jsx
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Ensure that Logout is exported as a named export
export const Logout = () => {
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  //   navigate('/login'); // Redirect to login page after logging out
  // };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };
  // return (
  //   <div>
  //     <button onClick={handleLogout}>Logout</button>
  //   </div>
  // );
};