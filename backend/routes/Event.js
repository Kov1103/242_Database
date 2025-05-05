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
      // Optional: thêm các trường khác theo format Supabase nếu có
    }));

    res.json(events);
  });
});

export default router;
