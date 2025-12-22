import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signin from '@/pages/signin/SigninPage';
import Signup from '@/pages/signup/SignupPage';
import Main from '@/pages/main/MainPage';
import Post from '@/pages/post/PostPage';
import PostContent from './pages/post/PostContent';
import PostWrite from './pages/post/PostWrite';
import MyPost from './pages/post/MyPost';
import Password from '@/pages/password/PasswordPage';
import Mentoring from '@/pages/mentoring/MentoringPage';
import RandomMentoring from '@/pages/mentoring/RandomMentoring';
import MyPage from '@/pages/myPage/MyPage';
import ChatPage from '@/pages/chat/ChatPage';
import ChatApplyPage from '@/pages/chat/ChatApplyPage';
import Admin from './pages/admin/AdminPage';
import NotFound from './pages/404/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={<Main />} />
          <Route path="/post" element={<Post />} />
          <Route path="/post-content" element={<PostContent />} />
          <Route path="/post-write" element={<PostWrite />} />
          <Route path="/my-post" element={<MyPost />} />
          <Route path="/password" element={<Password />} />
          <Route path="/mentoring" element={<Mentoring />} />
          <Route path="/mentoring-random" element={<RandomMentoring />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat-apply" element={<ChatApplyPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
