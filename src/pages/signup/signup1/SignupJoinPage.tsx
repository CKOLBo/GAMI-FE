import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/assets/Logo/Logo';
import '@/pages/signup/signup1/SignupJoinPage.css';

export default function JoinPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/signup/email');
  };

  return (
    <div className="join-page">
      <div className="join-container">
        <Logo />
        <p className="login-link">
          이미 회원이신가요? <Link to="/login">로그인</Link>
        </p>
        <form className="join-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="이름" required />
          <div className="gender-buttons">
            <button className="gender-button male" type="button">
              남자
            </button>
            <button className="gender-button female" type="button">
              여자
            </button>
          </div>
          <select className="major-select" required defaultValue="">
            <option value="" disabled>
              기수
            </option>
            <option value="7기">7기</option>
            <option value="8기">8기</option>
            <option value="9기">9기</option>
          </select>
          <button className="submit-button" type="submit">
            다음으로
          </button>
        </form>
      </div>
    </div>
  );
}
