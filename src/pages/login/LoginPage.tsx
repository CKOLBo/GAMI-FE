import { Link } from 'react-router-dom';
import './LoginPage.css';
import Logo from '@/assets/Logo/Logo';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo">
          <Logo />
        </div>

        <p className="signup-link">
          GAMI가 처음이라면? <Link to="/signup1">회원가입하기</Link>
        </p>
        <form className="login-form">
          <input type="email" placeholder="이메일" required />
          <input type="password" placeholder="비밀번호" required />
          <button type="submit">로그인</button>
        </form>
        <div className="password-reset">
          <Link to="/login" className="reset-link">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
