export default function Signup() {
  return (
    <body>
      <div className="회원가입페이지">
        <img src="/logo.svg" alt="GAMI 로고" className="logo" />

        <p className="로그인">
          이미 회원이신가요? <a href="/login/login.html">로그인하기</a>
        </p>

        <form className="">
          <input type="password" placeholder="비밀번호" required />
          <input type="password" placeholder="비밀번호 확인" required />

          <div className="약관박스">
            <label>
              <input type="checkbox" /> 전체 약관 동의
            </label>
          </div>

          <label className="필수항목">
            <input type="checkbox" /> [필수] GAMI 이용 약관에 동의
          </label>
          <label className="필수항목">
            <input type="checkbox" /> [필수] 개인정보 수집 및 이용에 동의
          </label>

          <button type="submit">가입하기</button>
        </form>
      </div>
    </body>
  );
}
