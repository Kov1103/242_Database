import UserList from './components/UserList';
import Login from './components/Login';
import Home from './components/home';
import Header from './components/ui/shared/header';
import TicketDetails from './components/ticket-details';
import Booking from './components/Booking';
import AddEvent from './components/AddEvent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Admin from './components/admin/admin';
import ManageEvents from './components/admin/manage-events';
import ManageUsers from './components/admin/manage-users';
import EventDetail from './components/EventDetail';
import ChangeInfo from './components/ChangeInfo';
import MyEvents from './components/my-events/my-events';
import Manage from './components/my-events/manage-events';
import Staff from './components/my-events/staff';
import Discount from './components/my-events/discount';
import TicketsList from './components/TicketsList';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import ManagerBooking from './components/admin/manage-booking';

const App = () => {
  return (
    <div className='relative h-full w-full min-h-[100dvh]'>
      <Router>
        <Header />
        <div className='relative w-full'>
          <ToastContainer
            className='text-start'
            position="bottom-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
          />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/ticket-details/:id" element={<TicketDetails />} /> */}
            <Route path="/ticket-details/:id" element={<EventDetail />} />
            <Route path="/booking/:event_id/:show_id" element={<Booking />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/change-info" element={<ChangeInfo />} />
            <Route path="/my-tickets" element={<TicketsList />} />
            <Route path="/user-list" element={<UserList />} />
            <Route path="/login" element={<Login />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/admin/manage-events' element={<ManageEvents />} />
            <Route path='/admin/manage-users' element={<ManageUsers />} />
            <Route path='/admin/manage-booking' element={<ManagerBooking />} />
            <Route path='/my-events' element={<MyEvents />} />
            <Route path='/my-events/manage' element={<Manage />} />
            <Route path='/my-events/staff' element={<Staff />} />
            <Route path='/my-events/discount' element={<Discount />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
