import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SigninPage from '@/pages/signin/SigninPage';
import Signup from '@/pages/signup/SignupPage';
import Main from '@/pages/main/MainPage';
import Main2 from '@/pages/main/MainPage2';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<Main />} />
        <Route path="/main2" element={<Main2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
