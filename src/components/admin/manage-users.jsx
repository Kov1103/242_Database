import AdminSidebar from "../ui/admin/sidebar";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { addUser, changeInfo, deleteUserFunc, fetchAllUsers } from "../../controllers/userController";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ email: '', phone_no: '', address: '' });
    const [showAddModal, setShowAddModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null); // 👈 thêm state

    const [newUserData, setNewUserData] = useState({
        ssn: '', email: '', password: '', fname: '', lname: '',
        gender: 'M', dob: '', phone_no: '', address: ''
    });

    const fetchUsers = async () => {
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (err) {
            console.error("Lỗi lấy người dùng:", err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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
            await fetchUsers();
            setEditingUser(null);
        } catch (err) {
            console.error("Lỗi cập nhật:", err.message);
        }
    };

    const handleAddUser = async () => {
        const { ssn, email, password, fname, lname, gender, dob, phone_no, address } = newUserData;
        if (!ssn || !email || !password || !fname || !lname || !gender || !dob || !phone_no || !address) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        try {
            await addUser(newUserData);
            alert("Người dùng đã được tạo thành công!");
            await fetchUsers();
            setShowAddModal(false);
            setNewUserData({
                ssn: '', email: '', password: '', fname: '', lname: '',
                gender: 'M', dob: '', phone_no: '', address: ''
            });
        } catch (err) {
            console.error("Lỗi tạo người dùng:", err.message);
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    const confirmRemoveUser = async () => {
        if (!userToDelete) return;
        try {
            await deleteUserFunc(userToDelete.id);
            await fetchUsers();
            setUserToDelete(null);
        } catch (err) {
            console.error("Lỗi xóa người dùng:", err.message);
        }
    };

    function UserItem({ user }) {
        const UserBadge = ({ role }) => (
            <div className={`px-4 py-1 rounded-2xl text-xs font-semibold ${role === 'customer'
                ? 'bg-[#f2e5cf] border-2 border-[#f2ae39] text-[#f2ae39]'
                : 'bg-[#fbcccc] border-2 border-[#f87474] text-[#f87474]'}`}>
                {role === 'customer' ? 'Khách hàng' : 'Quản trị viên'}
            </div>
        );

        return (
            <div className="w-full flex flex-row items-start justify-between py-5 px-6 rounded-xl border border-black hover:cursor-pointer hover:bg-[#d9d9d9]">
                <div className="flex flex-col items-start gap-1">
                    <p className="font-bold text-lg">{user.lname} {user.fname}</p>
                    <p className="font-normal text-base">Email: {user.email}</p>
                </div>
                <div className="flex flex-col items-end gap-4">
                    <UserBadge role={user.role} />
                    <div className="flex flex-row items-center gap-2">
                        <button className="text-white bg-[#f2ae39] px-4 py-2 rounded-lg" onClick={() => openEditModal(user)}>Chỉnh sửa</button>
                        <button className="text-white bg-[#1b1b1b] px-4 py-2 rounded-lg" onClick={() => setUserToDelete(user)}>Xóa</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 max-h-[calc(100vh-76px)] bg-[#fafafa] w-full flex flex-row gap-5 items-start overflow-hidden">
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 text-black">
                    <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa người dùng</h2>
                        <div className="flex flex-col gap-4 text-left">
                            <label>Email:</label>
                            <input type="email" value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="border rounded px-3 py-2" />
                            <label>Số điện thoại:</label>
                            <input type="text" value={formData.phone_no}
                                onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                                className="border rounded px-3 py-2" />
                            <label>Địa chỉ:</label>
                            <input type="text" value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="border rounded px-3 py-2" />
                            <div className="flex justify-end gap-2">
                                <button className="px-4 py-2 rounded bg-gray-300" onClick={() => setEditingUser(null)}>Hủy</button>
                                <button className="px-4 py-2 rounded bg-[#219ce4] text-white" onClick={handleSave}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 text-black">
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
                                    <label className="block font-medium text-left">{label}:</label>
                                    {type === "select" ? (
                                        <select value={newUserData[key]}
                                            onChange={(e) => setNewUserData({ ...newUserData, [key]: e.target.value })}
                                            className="border rounded px-3 py-2 w-full">
                                            <option value="M">Nam</option>
                                            <option value="F">Nữ</option>
                                        </select>
                                    ) : (
                                        <input type={type} value={newUserData[key]}
                                            onChange={(e) => setNewUserData({ ...newUserData, [key]: e.target.value })}
                                            className="border rounded px-3 py-2 w-full" />
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-end gap-2 mt-4">
                                <button className="px-4 py-2 rounded bg-gray-300" onClick={() => setShowAddModal(false)}>Hủy</button>
                                <button className="px-4 py-2 rounded bg-[#219ce4] text-white" onClick={handleAddUser}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xác nhận xóa */}
            {userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 text-black">
                    <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">Xác nhận xóa người dùng</p>
                        <p className="mb-6">{userToDelete.fname} {userToDelete.lname}</p>
                        <div className="flex justify-center gap-4">
                            <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setUserToDelete(null)}>Hủy</button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={confirmRemoveUser}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}

            <AdminSidebar />
            <div className="flex flex-col items-start gap-3 w-full py-7 px-5 text-[#1b1b1b] overflow-hidden">
                <div className="w-full flex flex-row justify-between items-center">
                    <p className="text-2xl font-extrabold">Tất cả người dùng</p>
                    <button className="bg-[#219ce4] text-white px-4 py-2 rounded-lg" onClick={() => setShowAddModal(true)}>
                        Thêm người dùng
                    </button>
                </div>
                <div className="my-2 flex flex-col items-start gap-2 w-full h-[calc(100vh-240px)] overflow-y-auto scrollbar-hide">
                    {users.map((user, index) => (
                        <UserItem key={index} user={user} />
                    ))}
                </div>
            </div>
        </div>
    );
}
