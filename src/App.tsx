import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DriverLoginPage } from './pages/DriverLogin';
import { PassengerLoginPage } from './pages/PassengerLogin';
import { DriverRegisterPage } from './pages/DriverRegister';
import { PassengerRegisterPage } from './pages/PassengerRegister';
import { PassengerHomePage } from './pages/PassengerHome';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/passenger-home" element={<PassengerHomePage />} />
        <Route path="/driver-login" element={<DriverLoginPage />} />
        <Route path="/login" element={<PassengerLoginPage />} />
        <Route path="/driver-register" element={<DriverRegisterPage />} />
        <Route path="/passenger-register" element={<PassengerRegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        {/* /passenger и /driver — защищённые маршруты */}
      </Routes>
    </BrowserRouter>
  );
}