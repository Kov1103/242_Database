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

export default router;
