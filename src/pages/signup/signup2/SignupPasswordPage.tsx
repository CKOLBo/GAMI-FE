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

        <p className="text-[14px] text-[#333D48] mb-[40px]">
          이미 회원이신가요?{' '}
          <Link className="text-[#73A9FF] font-[700] no-underline" to="/login">
            로그인하기
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
          <input
            type="password"
            placeholder="비밀번호"
            required
            className="p-[16px] border-[1px] border-[solid] border-[#B7BCC8] rounded-[7px] text-[14px] outline-none"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            required
            className="p-[16px] border-[1px] border-[solid] border-[#B7BCC8] rounded-[7px] text-[14px] outline-none"
          />

          <button
            type="submit"
            className="p-[16px] bg-[#BFA9FF] text-[white] text-[16px] border-none rounded-[7px] cursor-pointer transition-all duration-[300ms] mt-[10px] font-[700] hover:bg-[#bbaaf5] outline-none"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
