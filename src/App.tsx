import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
