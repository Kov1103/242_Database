import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getBookingDetails } from '../../../models/Booking';

export default function BookingDetailModal({ idBooking, onClose }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        // Nếu không có idBooking, không làm gì cả
        if (!idBooking) return;
        console.log('ididid');
        // Gọi API để lấy dữ liệu chi tiết đơn hàng
        const fetchBookingData = async () => {
            try {
                setLoading(true);
                const response = await getBookingDetails(idBooking); // Gọi API lấy dữ liệu đơn hàng
                setData(response.booking); // Lưu trữ dữ liệu vào state
            } catch (err) {
                setError('Lỗi khi tải thông tin đơn hàng');
                console.error('Error fetching booking data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
    }, [idBooking]); // Khi idBooking thay đổi, gọi lại API

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!data) return <div>Không có dữ liệu</div>;

    const bookingInfo = data[0]?.[0];
    const tickets = data[1] || [];
    const payments = data[2] || [];
    const answers = data[3] || [];

    return (
        <div className="fixed text-black inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full overflow-auto max-h-[90vh]">
                <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng #{bookingInfo?.booking_id}</h2>

                {/* 1. Thông tin đặt vé */}
                <section className="mb-6 text-left">
                    <h3 className="text-xl font-bold mb-2 text-left">Thông tin đặt vé</h3>
                    <p><strong>Thời gian:</strong> {new Date(bookingInfo?.booking_time).toLocaleString()}</p>
                    <p><strong>Trạng thái:</strong> {bookingInfo?.booking_status}</p>
                    <p><strong>Số lượng vé:</strong> {bookingInfo?.number_of_ticket}</p>
                    <p><strong>Tổng tiền:</strong> {bookingInfo?.total_cost} VND</p>
                    <p><strong>Mã giảm giá:</strong> {bookingInfo?.discount_code || 'Không có'}</p>
                </section>

                {/* 2. Thông tin vé & sự kiện */}
                <section className="mb-6 text-left">
                    <h3 className="text-xl font-bold mb-2">Thông tin vé và sự kiện</h3>
                    <p><strong>Loại vé:</strong> {bookingInfo?.ticket_type_name}</p>
                    <p><strong>Mô tả:</strong> {bookingInfo?.ticket_description}</p>
                    <p><strong>Giá vé:</strong> {bookingInfo?.unit_price} VND</p>
                    <p><strong>Phiên:</strong> {bookingInfo?.session_name}</p>
                    <p><strong>Thời gian phiên:</strong> {new Date(bookingInfo?.session_time).toLocaleString()}</p>
                    <p><strong>Địa điểm:</strong> {bookingInfo?.session_location}</p>
                    <p><strong>Sự kiện:</strong> {bookingInfo?.event_name}</p>
                </section>

                {/* 3. Trạng thái vé */}
                <section className="mb-6 text-left">
                    <h3 className="text-xl font-bold mb-2">Trạng thái vé</h3>
                    {tickets.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {tickets.map(ticket => (
                                <li key={ticket.ticket_id}>
                                    Vé #{ticket.ticket_id} - {ticket.used_flag === 'T' ? 'Đã sử dụng' : 'Chưa sử dụng'}
                                </li>
                            ))}
                        </ul>
                    ) : <p>Không có thông tin vé</p>}
                </section>

                {/* 4. Thanh toán */}
                <section className="mb-6 text-left">
                    <h3 className="text-xl font-bold mb-2">Thông tin thanh toán</h3>
                    {payments.length > 0 ? payments.map(p => (
                        <div key={p.payment_id}>
                            <p><strong>Thời gian:</strong> {new Date(p.paid_time).toLocaleString()}</p>
                            <p><strong>Ngân hàng:</strong> {p.bank}</p>
                            <p><strong>Số tài khoản:</strong> {p.bank_account_no}</p>
                            <p><strong>Trạng thái:</strong> {p.payment_status}</p>
                        </div>
                    )) : <p>Không có giao dịch nào</p>}
                </section>

                {/* 5. Câu hỏi bổ sung */}
                <section className="mb-6 text-left">
                    <h3 className="text-xl font-bold mb-2">Thông tin bổ sung</h3>
                    {answers.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {answers.map((q, idx) => (
                                <li key={idx}>
                                    <strong>{q.question_content}</strong>: {q.answer}
                                </li>
                            ))}
                        </ul>
                    ) : <p>Không có câu trả lời nào</p>}
                </section>

                <div className="text-right">
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">Đóng</button>
                </div>
            </div>
        </div>
    );
}
