import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 폼 검증 로직 추가 가능
    navigate('/join');
  };

  return (
    <body>
      <div className="회원가입페이지">
        <img src="/logo.svg" alt="GAMI 로고" className="logo" />

        <p className="로그인">
          이미 회원이신가요? <Link to="/login">로그인하기</Link>
        </p>

        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="비밀번호" required />
          <input type="password" placeholder="비밀번호 확인" required />

          <div className="약관박스">
            <label>
              <input type="checkbox" /> 전체 약관 동의
            </label>
          </div>

          <label className="필수항목">
            <input type="checkbox" required /> [필수] GAMI 이용 약관에 동의
          </label>
          <label className="필수항목">
            <input type="checkbox" required /> [필수] 개인정보 수집 및 이용에
            동의
          </label>

          <button type="submit">다음으로</button>
        </form>
      </div>
    </body>
  );
}
