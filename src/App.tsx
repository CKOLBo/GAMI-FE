import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SigninPage from './pages/signin/SigninPage';
import Password from '@/pages/signup/signup2/SignupPasswordPage';
import JoinPage from './pages/signup/signup1/SignupJoinPage';
import EmailPage from './pages/signup/signup3/SignupEmailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup/join" element={<JoinPage />} />
        <Route path="/signup/email" element={<EmailPage />} />
        <Route path="/signup/password" element={<Password />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
