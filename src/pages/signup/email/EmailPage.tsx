import { Link, useNavigate } from 'react-router-dom';

export default function Email() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <body>
      <div className="login">
        <img src="/logo.svg" alt="GAMI 로고" className="logo" />
        <p className="join">
          이미 회원이신가요? <Link to="/login">로그인하기</Link>
        </p>
        <form className="input" onSubmit={handleSubmit}>
          <div className="auth">
            <input type="email" placeholder="이메일" required />
            <button type="button" className="auth-button">
              인증하기
            </button>
          </div>

          <div className="auth-check">
            <input type="text" placeholder="인증번호" required />
            <button type="button" className="check-button">
              확인
            </button>
          </div>

          <button type="submit" className="next">
            가입완료
          </button>
        </form>
      </div>
    </body>
  );
}
