import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/assets/Logo/Logo';
import './PasswordPage.css';

export default function Password() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/join');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <Logo />

        <p className="login-link">
          이미 회원이신가요? <Link to="/login">로그인하기</Link>
        </p>

        <form onSubmit={handleSubmit} className="signup-form">
          <input type="password" placeholder="비밀번호" required />
          <input type="password" placeholder="비밀번호 확인" required />

          <div className="terms-box">
            <label>
              <input type="checkbox" /> 전체 약관 동의
            </label>
          </div>

          <label className="required-term">
            <input type="checkbox" required /> [필수] GAMI 이용 약관에 동의
          </label>
          <label className="required-term">
            <input type="checkbox" required /> [필수] 개인정보 수집 및 이용에
            동의
          </label>

          <button type="submit">다음으로</button>
        </form>
      </div>
    </div>
  );
}
