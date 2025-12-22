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
import ProtectedRoute from '@/assets/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <Post />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-content"
            element={
              <ProtectedRoute>
                <PostContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-write"
            element={
              <ProtectedRoute>
                <PostWrite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-post"
            element={
              <ProtectedRoute>
                <MyPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/password"
            element={
              <ProtectedRoute>
                <Password />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentoring"
            element={
              <ProtectedRoute>
                <Mentoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentoring-random"
            element={
              <ProtectedRoute>
                <RandomMentoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-page"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat-apply"
            element={
              <ProtectedRoute>
                <ChatApplyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
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
