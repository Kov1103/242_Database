import AdminSidebar from "../ui/admin/sidebar";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { fetchAllBooking } from "../../controllers/bookingController";
import BookingDetailModal from "../ui/compoennt/modalBooking";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ManagerBooking() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null); // Lưu thông tin booking đã chọn

    const handleViewDetails = (booking) => {
        console.log(booking);
        setSelectedBooking(booking.id); // Cập nhật thông tin booking vào state
        setShowModal(true); // Hiển thị modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Đóng modal
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await fetchAllBooking(); // Lấy tất cả các booking
                console.log(data);
                setUsers(data);
            } catch (err) {
                console.error("Lỗi lấy người dùng:", err.message);
            }
        };
        fetchUsers();
    }, [users.map(user => user.status).join(',')]);

    function BookingItem({ user }) {
        const UserBadge = ({ role }) => {
            return (
                <div
                    className={`px-4 py-1 rounded-2xl text-xs font-semibold ${role === 'PENDING'
                        ? 'bg-[#f2e5cf] border-2 border-[#f2ae39] text-[#f2ae39]'
                        : role === 'SUCCESS'
                            ? 'bg-[#d4edda] border-2 border-[#28a745] text-[#28a745]'
                            : 'bg-[#fbcccc] border-2 border-[#f87474] text-[#f87474]'
                        }`}
                >
                    {role === 'PENDING'
                        ? 'Đang chờ'
                        : role === 'SUCCESS'
                            ? 'Thành công'
                            : 'Đã hủy'}
                </div>
            );
        };

        const formatDateTime = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        };

        return (
            <div className="w-full flex flex-row items-start justify-between py-5 px-6 rounded-xl border border-black hover:cursor-pointer hover:bg-[#d9d9d9]">
                <div className="flex flex-col items-start gap-1">
                    <p className="font-bold text-lg">ID: {user.id}</p>
                    <p className="font-normal text-base">Thời gian đặt: {formatDateTime(user.booking_time)}</p>
                    <p className="font-normal text-base">Số lượng vé: {user.number_of_ticket} </p>
                    <p className="font-normal text-base">Loại vé: {user.ticket_type_id} </p>
                    <p className="font-normal text-base">Tổng tiền: {user.total_cost} </p>
                </div>
                <div className="flex flex-col items-end gap-4">
                    <UserBadge role={user.status} />
                    <div className="flex flex-row items-center gap-2">
                        <button className="text-white bg-[#1b1b1b] px-4 py-2 rounded-lg" onClick={() => handleViewDetails(user)}>
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 max-h-[calc(100vh-76px)] bg-[#fafafa] w-full flex flex-row gap-5 items-start overflow-hidden">
            <AdminSidebar />
            <div className="flex flex-col items-start gap-3 w-full py-7 px-5 text-[#1b1b1b] overflow-hidden">
                <p className="text-2xl font-extrabold">Hóa đơn</p>
                <div className="my-2 flex flex-col items-start gap-2 w-full h-[calc(100vh-240px)] overflow-y-auto scrollbar-hide">
                    {users?.map((user, index) => (
                        <BookingItem key={index} user={user} />
                    ))}
                </div>
            </div>

            {/* Hiển thị modal khi showModal là true */}
            {showModal && selectedBooking && (
                <BookingDetailModal idBooking={selectedBooking} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
}
