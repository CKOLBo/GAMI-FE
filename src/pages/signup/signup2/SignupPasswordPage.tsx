import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/assets/Logo/Logo';

export default function Password() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="bg-[white] min-h-[100vh] flex justify-center items-start pt-[100px]">
      <div className="text-center max-w-[320px] w-[100%]">
        <div className="w-[120px] mb-[20px] mx-auto">
          <Logo />
        </div>

        <p className="text-[14px] text-[#5c5c5c] mb-[40px]">
          이미 회원이신가요?
          <Link className="text-[#91bbff] font-[bold] no-underline" to="/login">
            로그인하기
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
          <input
            type="password"
            placeholder="비밀번호"
            required
            className="p-[16px] border-[1px] border-[solid] border-[#ddd] rounded-[7px] text-[14px] outline-none"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            required
            className="p-[16px] border-[1px] border-[solid] border-[#ddd] rounded-[7px] text-[14px] outline-none"
          />

          <div className="bg-[#f6f6f8] p-[16px] rounded-[7px] text-[14px] text-left text-[#858486]">
            <label className="flex items-center gap-[8px] cursor-pointer">
              <input type="checkbox" className="cursor-pointer" /> 전체 약관
              동의
            </label>
          </div>

          <label className="text-left text-[14px] text-[#858486] flex items-center gap-[8px] cursor-pointer">
            <input type="checkbox" required className="cursor-pointer" /> [필수]
            GAMI 이용 약관에 동의
          </label>
          <label className="text-left text-[14px] text-[#858486] flex items-center gap-[8px] cursor-pointer">
            <input type="checkbox" required className="cursor-pointer" /> [필수]
            개인정보 수집 및 이용에 동의
          </label>

          <button
            type="submit"
            className="p-[14px] bg-[#cebeff] text-[white] text-[15px] border-none rounded-[7px] cursor-pointer transition-all duration-[300ms] mt-[10px] font-[600] hover:bg-[#bbaaf5] outline-none"
          >
            다음으로
          </button>
        </form>
      </div>
    </div>
  );
}
