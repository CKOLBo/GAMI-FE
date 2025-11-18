export default function Join() {
  return (
    <body>
      <div className="login">
        <img src="/logo.svg" alt="GAMI 로고" className="logo" />
        <p className="join">
          이미 회원이신가요? <a href="/login/login.html">로그인</a>
        </p>
        <form className="input">
          <input type="text" placeholder="이름" required />
          <input type="text" placeholder="기수" required />
          <div className="sex">
            <button className="male" type="button">
              남자
            </button>
            <button className="female" type="button">
              여자
            </button>
          </div>
          <select className="major" required defaultValue="">
            <option value="" disabled>
              전공
            </option>
            <option value="fe">FrontEnd</option>
            <option value="be">BackEnd</option>
            <option value="ios">iOS</option>
          </select>
          <button className="next" type="submit">
            다음으로
          </button>
        </form>
      </div>
    </body>
  );
}
