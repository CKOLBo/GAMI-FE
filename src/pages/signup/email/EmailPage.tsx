import { Link, useNavigate } from 'react-router-dom';
import './EmailPage.css';

export default function EmailPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="email-page">
      <div className="email-container">
        <img src="/logo.svg" alt="GAMI 로고" className="logo" />
        <p className="login-link">
          이미 회원이신가요? <Link to="/login">로그인하기</Link>
        </p>
        <form className="email-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input type="email" placeholder="이메일" required />
            <button type="button" className="auth-button">
              인증하기
            </button>
          </div>

          <div className="auth-check-group">
            <input type="text" placeholder="인증번호" required />
            <button type="button" className="check-button">
              확인
            </button>
          </div>

          <button type="submit" className="submit-button">
            가입완료
          </button>
        </form>
      </div>
    </div>
  );
}
