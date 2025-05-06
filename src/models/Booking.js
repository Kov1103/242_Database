import { getData } from '../services/api';

export const getAllBooking = async (params = {}) => {
    return getData('/booking', params); // Gọi API lấy tất cả sự kiện
};