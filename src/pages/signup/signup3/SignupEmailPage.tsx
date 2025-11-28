import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/assets/Logo/Logo';

export default function EmailPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/signup/password');
  };

  return (
    <div className="bg-[white] min-h-[100vh] flex justify-center items-start pt-[100px]">
      <div className="text-center max-w-[320px] w-[100%]">
        <div className="w-[120px] mb-[20px] mx-auto">
          <Logo />
        </div>
        <p className="text-[14px] text-[#5c5c5c] mb-[40px]">
          이미 회원이신가요?{' '}
          <Link to="/login" className="text-[#91bbff] font-[bold] no-underline">
            로그인하기
          </Link>
        </p>
        <form className="flex flex-col gap-[20px]" onSubmit={handleSubmit}>
          <div className="flex gap-[10px] items-stretch">
            <input
              type="email"
              placeholder="이메일"
              required
              className="flex-[1] p-[16px] border-[1px] border-[solid] border-[#ddd] rounded-[6px] text-[14px] outline-none"
            />
            <button
              type="button"
              className="p-[16px] bg-[#91bbff] text-[white] text-[14px] border-none rounded-[6px] cursor-pointer transition-all duration-[300ms] font-[600] whitespace-nowrap min-w-[90px] hover:bg-[#7a9fe6] outline-none"
            >
              인증하기
            </button>
          </div>

          <div className="flex gap-[10px] items-stretch">
            <input
              type="text"
              placeholder="인증번호"
              required
              className="flex-[1] p-[16px] border-[1px] border-[solid] border-[#ddd] rounded-[6px] text-[14px] outline-none"
            />
            <button
              type="button"
              className="p-[16px] bg-[#91bbff] text-[white] text-[14px] border-none rounded-[6px] cursor-pointer transition-all duration-[300ms] font-[600] whitespace-nowrap min-w-[90px] hover:bg-[#7a9fe6] outline-none"
            >
              확인
            </button>
          </div>

          <button
            type="submit"
            className="p-[14px] bg-[#cebeff] text-[white] text-[15px] border-none rounded-[6px] cursor-pointer transition-all duration-[300ms] mt-[10px] font-[600] hover:bg-[#bbaaf5] outline-none"
          >
            가입완료
          </button>
        </form>
      </div>
    </div>
  );
}
