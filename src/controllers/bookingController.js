import { getAllBooking } from '../models/Booking';

export const fetchAllBooking = async () => {
    const data = await getAllBooking();
    return data.bookings
};