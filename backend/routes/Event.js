import express from 'express';
const router = express.Router();
import { db } from '../db.js';

router.get('/', async (req, res) => {
  const {
    keyword = null,
    category_id = null,
    start_time = null,
    end_time = null,
    min_price = null,
    max_price = null,
  } = req.query;

  const query = "CALL get_filtered_events(?, ?, ?, ?, ?, ?)";
  const params = [
    keyword,
    category_id,
    start_time,
    end_time,
    min_price,
    max_price
  ];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ Error calling stored procedure:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Trả về mảng kết quả đầu tiên từ stored procedure
    const events = results[0].map(event => ({
      id: event.event_id,
      title: event.event_name,
      image: event.image,
      description: event.description,
      min_price: parseFloat(event.min_price),
      max_price: parseFloat(event.max_price),
      first_session_time: event.first_session_time,
      last_session_time: event.last_session_time,
      category: event.categories, // bạn có thể split(',') nếu muốn dạng mảng
      status: event.status.toLowerCase(),
      // Optional: thêm các trường khác theo format Supabase nếu có
    }));

    res.json(events);
  });
});

router.post('/update', async (req, res) => {
  const { event_id, status, approver_id } = req.body;

  if (!event_id || !status || !approver_id) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const query = "CALL update_event_status(?, ?, ?)";
  const params = [event_id, status, approver_id];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ Error calling stored procedure:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Kiểm tra kết quả trả về từ stored procedure nếu cần
    const response = results[0];

    res.json({
      message: 'Event status updated successfully',
      result: response
    });
  });
});

export default router;
