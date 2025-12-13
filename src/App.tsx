import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SigninPage from '@/pages/signin/SigninPage';
import Signup from '@/pages/signup/SignupPage';
import Main from '@/pages/main/MainPage';
import Post from '@/pages/post/PostPage';
import PostContent from './pages/post/PostContent';
import PostWrite from './pages/post/PostWrite';
import MyPost from './pages/post/MyPost';
import Password from './pages/password/PasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<Main />} />
        <Route path="/post" element={<Post />} />
        <Route path="/post-content" element={<PostContent />} />
        <Route path="/post-write" element={<PostWrite />} />
        <Route path="/my-post" element={<MyPost />} />
        <Route path="/password" element={<Password />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
