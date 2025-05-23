import Button from "../shared/button";

export default function EventCard({ event, onApprove, onReject, onClick }) {
    const StatusBadge = ({ status }) => {
        return (
            <div
                className={`px-4 py-1 rounded-2xl text-xs font-semibold ${status === 'pending'
                    ? 'bg-[#f2e5cf] border-2 border-[#f2ae39] text-[#f2ae39]'
                    : status === 'approved'
                        ? 'bg-[#cef6d0] border-2 border-[#56d45c] text-[#56d45c]'
                        : 'bg-[#fbcccc] border-2 border-[#f87474] text-[#f87474]'
                    }`}
            >
                {status === 'pending'
                    ? 'Đang chờ'
                    : status === 'approved'
                        ? 'Đã duyệt'
                        : 'Đã từ chối'}
            </div>
        )
    }

    const getSmallestPrice = (shows) => {
        let smallestPrice = Infinity;
        shows.forEach(show => {
            show.ticket_types.forEach(ticket => {
                if (ticket.price < smallestPrice) {
                    smallestPrice = ticket.price;
                }
            });
        });
        return smallestPrice;
    };

    const getRecentDate = (shows) => {
        let recentDate = new Date(0);
        shows.forEach(show => {
            const startDate = new Date(show.start_date);
            if (startDate > recentDate) {
                recentDate = startDate;
            }
        });
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return recentDate.toLocaleDateString(undefined, options);
    };

    // const smallestPrice = getSmallestPrice(event.shows);
    // const recentDate = getRecentDate(event.shows);

    return (
        <div className="flex relative rounded-3xl min-w-[380px] max-w-[405px] min-h-[480px] border border-black bg-[#fafafa]">
            <div className="absolute top-0 inset-x-0 rounded-t-3xl">
                <img src={event.image} alt={event.title} className="w-full h-[240px] object-cover rounded-t-3xl" />
            </div>
            <div className="absolute w-full bottom-0 p-5 flex flex-col gap-10">
                <div className="flex flex-col items-start gap-2 text-[#1b1b1b]">
                <StatusBadge status={event.status} />
                    <p className="text-lg font-bold text-left">{event.title}</p>
                    <div className="flex flex-col items-start gap-1 text-base font-normal">
                        <div className="flex flex-row items-center gap-3">
                            <img src="/assets/icons/ticket.svg" alt="ticket" />
                            {/* <p>{smallestPrice.toLocaleString()} VND</p> */}
                            <p>{event.min_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} - {event.max_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        </div>
                        <div className="flex flex-row items-center gap-3">
                            <img src="/assets/icons/calendar.svg" alt="calendar" />
                            {/* <p>{recentDate}</p> */}
                            {new Date(event.first_session_time).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })} - {new Date(event.last_session_time).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                    </div>
                </div>
                {/* <Button bgColor={'#1b1b1b'} textColor={'#fafafa'} title={'Mua vé'} onClick={onClick} /> */}
                {/* Điều kiện hiển thị nút theo trạng thái */}
                {event.status.toLowerCase() === 'pending' ? (
                    <div className="flex gap-4 w-full">
                        <Button
                            bgColor={'#1b1b1b'}
                            textColor={'#fafafa'}
                            title={'Duyệt'}
                            onClick={onApprove}
                            className="flex-1"
                        />
                        <Button
                            bgColor={'#e57373'}
                            textColor={'#fafafa'}
                            title={'Từ chối'}
                            onClick={onReject}
                            className="flex-1"
                        />
                    </div>
                ) : (
                    <Button
                        bgColor={'#1b1b1b'}
                        textColor={'#fafafa'}
                        title={'Xem thông tin'}
                        onClick={onClick}
                    />
                )}
            </div>
        </div>
    )
}
