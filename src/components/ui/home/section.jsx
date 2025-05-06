import { useState, useEffect } from 'react';
import EventCard from './event-card';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { fetchAllEvents, updateEvents } from '../../../controllers/eventController';
import { getUser } from '../../../controllers/authController';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function CategoryButton({ category, onClick, isActive }) {
    return (
        <button
            className={`flex px-4 py-2 items-center rounded-[32px] border border-black ${isActive ? 'bg-[#1b1b1b] text-[#fafafa]' : 'bg-[#fafafa] text-[#1b1b1b]'}`}
            onClick={onClick}
        >
            {category}
        </button>
    );
}

function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

export default function Section({ title, categoryItems, maxCards }) {
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [filters, setFilters] = useState({
        keyword: '',
        category_id: '',
        min_price: '',
        max_price: '',
        start_time: '',
        end_time: '',
    });
    const [events, setEvents] = useState([]);

    // fetch events from database with category filtering
    // useEffect(() => {
    //     const fetchEvents = async () => {
    //         const categoryFilter = activeCategory === 'Tất cả' ? {} : { category: activeCategory };
    //         const { data, error } = await supabase
    //             .from('events')
    //             .select('*')
    //             .match({ ...categoryFilter, approveStatus: 'approved' });
    //         if (error) {
    //             console.error('Error fetching events:', error.message);
    //         } else {
    //             setEvents(data);
    //         }
    //     };
    //     fetchEvents();
    // }, [activeCategory]);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await fetchAllEvents(filters); // Truyền filters
                console.log(data);
                setEvents(data);
            } catch (err) {
                console.error("Lỗi lấy sự kiện:", err.message);
            }
        };
        fetchEvents();
    }, [filters]);

    useEffect(() => {
        if (categoryItems.length > 0) {
            setActiveCategory(categoryItems[0]);
        }
    }, [categoryItems]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const eventsToDisplay = events.slice(0, maxCards);
    const chunkedEvents = chunkArray(eventsToDisplay, 3);

    const onApprove = async (eventId) => {
        try {
            const session = await getUser()
          const updatedEvent = await updateEvents(eventId, 'APPROVED', session.user.id);
          // Bạn có thể cập nhật lại sự kiện trong state sau khi cập nhật thành công
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === eventId ? { ...event, status: 'approved' } : event
            )
          );
          console.log('Sự kiện đã được phê duyệt:', updatedEvent);
        } catch (err) {
          console.error('Lỗi khi phê duyệt sự kiện:', err);
        }
      };

      const onReject = async (eventId) => {
        try {
            const session = await getUser()
          const updatedEvent = await updateEvents(eventId, 'CANCEL', session.user.id);
          // Bạn có thể cập nhật lại sự kiện trong state sau khi cập nhật thành công
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === eventId ? { ...event, status: 'cancel' } : event
            )
          );
          console.log('Sự kiện đã được phê duyệt:', updatedEvent);
        } catch (err) {
          console.error('Lỗi khi phê duyệt sự kiện:', err);
        }
      };

    return (
        <div className='max-w-screen'>
            <div className="flex flex-col items-center gap-12 py-16 relative mx-auto w-full max-w-7xl px-4 lg:px-8">
                <div className="flex flex-col items-start gap-2 w-full overflow-hidden">
                    <p className="text-5xl leading-[64px] text-[#1b1b1b] font-extrabold">{title}</p>
                    <div className="flex flex-row items-center gap-2 text-gray-600">
                        {/* {categoryItems.map((category, index) => (
                            <CategoryButton
                                key={index}
                                category={category}
                                isActive={category === activeCategory}
                                onClick={() => setActiveCategory(category)}
                            />
                        ))} */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <input
                                type="text"
                                name="keyword"
                                value={filters.keyword}
                                placeholder="Tìm kiếm"
                                onChange={handleFilterChange}
                                className="border px-2 py-1 w-full sm:w-[180px]"
                            />
                            <select
                                name="category_id"
                                value={filters.category_id}
                                onChange={handleFilterChange}
                                className="border px-2 py-1 w-full sm:w-[180px]"
                            >
                                <option value="">Tất cả danh mục</option>
                                <option value="Khoa học">Khoa học</option>
                                <option value="Nghiên cứu">Nghiên cứu</option>
                                <option value="Thể thao">Thể thao</option>
                                <option value="Âm nhạc">Âm nhạc</option>
                                <option value="Hướng nghiệp">Hướng nghiệp</option>
                                <option value="Tình nguyện">Tình nguyện</option>
                                <option value="Tuyển dụng">Tuyển dụng</option>
                                <option value="Học thuật">Học thuật</option>
                                <option value="Xã hội">Xã hội</option>
                            </select>
                            <input
                                type="number"
                                name="min_price"
                                value={filters.min_price}
                                placeholder="Giá tối thiểu"
                                onChange={handleFilterChange}
                                className="border px-2 py-1 w-full sm:w-[180px]"
                            />
                            <input
                                type="number"
                                name="max_price"
                                value={filters.max_price}
                                placeholder="Giá tối đa"
                                onChange={handleFilterChange}
                                className="border px-2 py-1 w-full sm:w-[180px]"
                            />
                            <input
                                type="date"
                                name="start_time"
                                value={filters.start_time}
                                onChange={handleFilterChange}
                                className="border px-2 py-1 w-full sm:w-[180px]"
                            />
                            <input
                                type="date"
                                name="end_time"
                                value={filters.end_time}
                                onChange={handleFilterChange}
                                className="border px-2 py-1 w-full sm:w-[180px]"
                            />
                        </div>
                    </div>
                </div>
                <div className="my-2 flex flex-col items-start gap-2 w-full h-[calc(100vh-400px)] overflow-y-auto scrollbar-hide">

                    {chunkedEvents.length === 0 && (
                        <p className="text-black w-full text-left">Không có sự kiện nào.</p>
                    )}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {chunkedEvents.map((row, rowIndex) =>
                            row.map((item) => (
                                <div key={item.id} className="w-full">
                                    <EventCard
                                        event={item}
                                        onClick={() => {
                                            // window.scrollTo(0, 0);
                                            // navigate(`/ticket-details/${item.id}`);
                                        }}
                                        onApprove={() => onApprove(item.id)}
                                        onReject={() => onReject(item.id)}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}