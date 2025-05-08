import AdminSidebar from "../ui/admin/sidebar"
import { useEffect, useState } from "react"
import { createClient } from '@supabase/supabase-js';
import { addUser, changeInfo, fetchAllUsers } from "../../controllers/userController";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function RoleButton({ role, onClick, isActive }) {
    return (
        <button
            className={`flex px-4 py-2 items-center rounded-[32px] border border-black ${isActive ? 'bg-[#1b1b1b] text-[#fafafa]' : 'bg-[#fafafa] text-[#1b1b1b] hover:bg-[#d9d9d9]'}`}
            onClick={onClick}
        >
            {role}
        </button>
    );
}

export default function ManageUsers() {
    // const [activeRole, setActiveRole] = useState('Tất cả');
    const [users, setUsers] = useState([]);
    // const [fileredUsers, setFilteredUsers] = useState([]);

    const [editingUser, setEditingUser] = useState(null);
const [formData, setFormData] = useState({ email: '', phone_no: '', address: '' });
const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email || '',
      phone_no: user.phone_no || '',
      address: user.address || ''
    });
  };

  const handleSave = async () => {
    try {
      await changeInfo(editingUser, formData.phone_no, formData.address, formData.email);
    //   const updated = users.map(u =>
    //     u.id === editingUser.id
    //       ? { ...u, email: formData.email, phone_no: formData.phone_no, address: formData.address }
    //       : u
    //   );
    //   setUsers(updated);
    await fetchUsers();
    //   handleUserStatus(activeRole);
      setEditingUser(null);
    } catch (err) {
      console.error("Lỗi cập nhật:", err.message);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    ssn: '',
    email: '',
    password: '',
    fname: '',
    lname: '',
    gender: 'M',
    dob: '',
    phone_no: '',
    address: '',
  });

  const handleAddUser = async () => {
    try {
      // Lấy dữ liệu từ form
      const { ssn, email, password, fname, lname, gender, dob, phone_no, address } = newUserData;
  
      // Kiểm tra các trường có đầy đủ dữ liệu
      if (!ssn || !email || !password || !fname || !lname || !gender || !dob || !phone_no || !address) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
      }
  
      // Tạo dữ liệu người dùng
      const userData = {
        ssn,
        email,
        password,
        fname,
        lname,
        gender,
        dob,
        phone_no,
        address,
      };
  
      await addUser(userData);
      alert("Người dùng đã được tạo thành công!");
      await fetchUsers();
      // Đóng modal và reset form
      setShowAddModal(false);
      setNewUserData({
        ssn: '',
        email: '',
        password: '',
        fname: '',
        lname: '',
        gender: 'M',
        dob: '',
        phone_no: '',
        address: '',
      });
    } catch (err) {
      console.error("Lỗi tạo người dùng:", err.message);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };
// useEffect(() => {
    //     const fetchUsers = async () => {
    //         const { data, error } = await supabase.from('users').select('*');
    //         if (error) {
    //             console.log('error', error);
    //             return;
    //         }
    //         console.log(data);
    //         setUsers(data);
    //         setFilteredUsers(data);
    //     };
    //     fetchUsers();
    // }, [users.map(user => user.role).join(',')])
    const fetchUsers = async () => {
        try {
            const data = await fetchAllUsers(); // Truyền filters
            console.log(data);
            setUsers(data);
        } catch (err) {
            console.error("Lỗi lấy người dùng:", err.message);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [])

    // const handleUserStatus = (role) => {
    //     setActiveRole(role)
    //     let filtered;
    //     switch (role) {
    //         case 'Tất cả':
    //             filtered = users;
    //             break;
    //         case 'Quản trị viên':
    //             filtered = users.filter(user => user.role === 'admin');
    //             break;
    //         case 'Khách hàng':
    //             filtered = users.filter(user => user.role === 'customer');
    //             break;
    //         default:
    //             filtered = users;
    //             break;
    //     }
    //     setFilteredUsers(filtered);
    // }

    function UserItem({ user }) {
        const UserBadge = ({ role }) => {
            return (
                <div
                    className={`px-4 py-1 rounded-2xl text-xs font-semibold ${
                        role === 'customer'
                            ? 'bg-[#f2e5cf] border-2 border-[#f2ae39] text-[#f2ae39]'
                            : 'bg-[#fbcccc] border-2 border-[#f87474] text-[#f87474]'
                    }`}
                >
                    {role === 'customer'
                        ? 'Khách hàng'
                        : 'Quản trị viên'}
                </div>
            )
        }

        const handleRoleChange = async (user_id, role) => {
            const { data, error } = await supabase.from('users').update({ role: role }).eq('id', user_id);
            if (error) {
                console.log('error', error);
                return;
            }
            console.log(data);
            const updatedUsers = users.map(user => user.id === user_id ? { ...user, role: role } : user);
            setUsers(updatedUsers);
            // handleUserStatus(activeRole);
        }

        const handleRemoveUser = async (user_id) => {
            const { data, error } = await supabase.from('users').delete().eq('id', user_id);
            if (error) {
                console.log('error', error);
                return;
            }
            console.log(data);
            const updatedUsers = users.filter(user => user.id !== user_id);
            setUsers(updatedUsers);
            // handleUserStatus(activeRole);
        }
    
        return (
            <div className="w-full flex flex-row items-start justify-between py-5 px-6 rounded-xl border border-black hover:cursor-pointer hover:bg-[#d9d9d9]">
            <div className="flex flex-col items-start gap-1">
                <p className="font-bold text-lg">{user.lname} {user.fname}</p>
                <p className="font-normal text-base">Email: {user.email}</p>
                {/* <p className="font-normal text-base">Lần cuối hoạt động: </p> */}
            </div>
            <div className="flex flex-col items-end gap-4">
                <UserBadge role={user.role} />
                <div className="flex flex-row items-center gap-2">
                {/* {user.role !== 'admin' && (
                    <button className="text-white bg-[#219ce4] px-4 py-2 rounded-lg" onClick={() => handleRoleChange(user.id, "admin")}>Cấp quyền</button>
                )}
                {user.role === 'admin' && (
                    <button className="text-white bg-[#f24b4b] px-4 py-2 rounded-lg" onClick={() => handleRoleChange(user.id, "customer")}>Hủy quyền</button>
                )} */}
                <button className="text-white bg-[#f2ae39] px-4 py-2 rounded-lg" onClick={() => openEditModal(user)}>Chỉnh sửa</button>
                <button className="text-white bg-[#1b1b1b] px-4 py-2 rounded-lg" onClick={() => handleRemoveUser(user.id)}>Xóa</button>
                </div>
            </div>
            </div>
        )
    }

    return (
        <div className="flex-1 min-h-0 max-h-[calc(100vh-76px)] bg-[#fafafa] w-full flex flex-row gap-5 items-start overflow-hidden">
            {editingUser && (
            <div className="fixed text-black inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Chỉnh sửa người dùng</h2>
                <div className="flex flex-col gap-4 text-left">
                    <label>Email:</label>
                    <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="Email"
                    />
                    <label>Số điện thoại:</label>
                    <input
                    type="text"
                    value={formData.phone_no}
                    onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="Số điện thoại"
                    />
                    <label>Địa chỉ:</label>
                    <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="Địa chỉ"
                    />
                    <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 rounded bg-gray-300" onClick={() => setEditingUser(null)}>Hủy</button>
                    <button className="px-4 py-2 rounded bg-[#219ce4] text-white" onClick={handleSave}>Lưu</button>
                    </div>
                </div>
                </div>
            </div>
            )}
            {showAddModal && (
            <div className="fixed text-black inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-bold mb-4">Thêm người dùng</h2>
                <div className="flex flex-col gap-3">
                    {[
                    { label: "SSN", key: "ssn" },
                    { label: "Email", key: "email" },
                    { label: "Mật khẩu", key: "password", type: "password" },
                    { label: "Họ", key: "lname" },
                    { label: "Tên", key: "fname" },
                    { label: "Giới tính", key: "gender", type: "select" },
                    { label: "Ngày sinh", key: "dob", type: "date" },
                    { label: "Số điện thoại", key: "phone_no" },
                    { label: "Địa chỉ", key: "address" }
                    ].map(({ label, key, type = "text" }) => (
                    <div key={key}>
                        <label className="block text-left font-medium">{label}:</label>
                        {type === "select" ? (
                        <select
                            value={newUserData[key]}
                            onChange={(e) =>
                            setNewUserData({ ...newUserData, [key]: e.target.value })
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        >
                            <option value="M">Nam</option>
                            <option value="F">Nữ</option>
                        </select>
                        ) : (
                        <input
                            type={type}
                            value={newUserData[key]}
                            onChange={(e) =>
                            setNewUserData({ ...newUserData, [key]: e.target.value })
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                        )}
                    </div>
                    ))}

                    <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-4 py-2 rounded bg-gray-300"
                        onClick={() => setShowAddModal(false)}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-[#219ce4] text-white"
                        onClick={handleAddUser}
                    >
                        Lưu
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}

            <AdminSidebar />
            <div className="flex flex-col items-start gap-3 w-full py-7 px-5 text-[#1b1b1b] overflow-hidden">
                {/* <p className="text-2xl font-extrabold">Tất cả người dùng</p> */}
                <div className="w-full flex flex-row justify-between items-center">
                <p className="text-2xl font-extrabold">Tất cả người dùng</p>
                <button
                    className="bg-[#219ce4] text-white px-4 py-2 rounded-lg"
                    onClick={() => setShowAddModal(true)}
                >
                    Thêm người dùng
                </button>
                </div>
                {/* <div className="flex flex-row items-center gap-2">
                    {['Tất cả', 'Quản trị viên', 'Khách hàng'].map((role, index) => (
                        <RoleButton
                            key={index}
                            role={role}
                            isActive={role === activeRole}
                            onClick={() => handleUserStatus(role)}
                        />
                    ))}
                </div> */}
                <div className="my-2 flex flex-col items-start gap-2 w-full h-[calc(100vh-240px)] overflow-y-auto scrollbar-hide">
                    {users?.map((user, index) => (
                        <UserItem key={index} user={user} />
                    ))}
                </div>
            </div>
        </div>
    )
}