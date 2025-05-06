import { getData } from '../services/api';

export const getAllBooking = async (params = {}) => {
    return getData('/booking', params); // Gọi API lấy tất cả sự kiện
};

export const getBookingDetails = async (bookingId) => {
    try {
        // Gọi API để lấy thông tin chi tiết của đơn hàng
        const bookingData = await getData(`/booking/${bookingId}`);
        console.log('Thông tin đơn hàng:', bookingData);
        return bookingData;

        // Bạn có thể xử lý dữ liệu ở đây, ví dụ như cập nhật state trong React
        // setBooking(bookingData.booking);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
    }
};