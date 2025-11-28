import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/login/LoginPage';
import Password from '@/pages/signup/signup2/SignupPasswordPage';
import JoinPage from '@/pages/signup/signup1/SignupJoinPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/join" element={<JoinPage />} />
        <Route path="/signup/password" element={<Password />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
