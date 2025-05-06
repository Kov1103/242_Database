import express from 'express';
import { db } from '../db.js';
const router = express.Router();

// GET /api/bookings - Lấy toàn bộ booking
router.get('/', (req, res) => {
    db.query('SELECT * FROM `booking` ORDER BY booking_time DESC', (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn booking:', err.message);
            return res.status(500).json({ message: 'Lỗi server' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không có đơn đặt nào' });
        }

        // Format dữ liệu nếu cần
        const bookings = results.map(b => ({
            id: b.booking_id,
            booking_time: b.booking_time,
            status: b.status,
            number_of_ticket: b.number_of_ticket,
            ticket_type_id: b.ticket_type_id,
            buyer_id: b.buyer_id,
            total_cost: parseFloat(b.total_cost),
            discount_code: b.discount_code
        }));

        res.json({
            message: 'Lấy danh sách đơn đặt thành công',
            bookings,
        });
    });
});

router.get('/:id', (req, res) => {
    const bookingId = parseInt(req.params.id, 10);

    if (isNaN(bookingId)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    db.query('CALL get_booking_detail(?)', [bookingId], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn booking detail:', err.message);
            return res.status(500).json({ message: 'Lỗi server khi lấy booking' });
        }

        const data = results; // Kết quả trả về là mảng lồng

        if (!data) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        res.json({ message: 'Lấy đơn hàng thành công', booking: data });
    });
});

export default router;
