import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/assets/Logo/Logo';
import InputPassword from '@/assets/components/InputPassword';

export default function Step2() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="text-[14px] bg-[white] min-h-[100vh] flex justify-center items-start pt-[100px]">
      <div className="text-center max-w-[320px] w-[100%]">
        <div className="w-[120px] mb-[28px] mx-auto">
          <Logo />
        </div>

        <p className="font-[500] text-[#333D48] mb-[36px]">
          이미 회원이신가요?{' '}
          <Link className="text-[#73A9FF] font-[700] no-underline" to="/login">
            로그인하기
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
          <div className="flex gap-[10px] items-stretch">
            <input
              type="email"
              placeholder="이메일"
              required
              className="flex-[1] p-[16px] border-[1px] border-[solid] border-[#B7BCC8] rounded-[6px] text-[14px] outline-none"
            />
            <button
              type="button"
              className="p-[16px] bg-[#73A9FF] text-[white] text-[14px] border-none rounded-[6px] cursor-pointer transition-all duration-[300ms] font-[600] whitespace-nowrap min-w-[90px] hover:bg-[#7a9fe6] outline-none"
            >
              번호 발송
            </button>
          </div>

          <div className="flex gap-[10px] items-stretch">
            <input
              type="text"
              placeholder="인증번호"
              required
              className="flex-[1] p-[16px] border-[1px] border-[solid] border-[#B7BCC8] rounded-[6px] text-[14px] outline-none"
            />
            <button
              type="button"
              className="p-[16px] bg-[#73A9FF] text-[white] text-[14px] border-none rounded-[6px] cursor-pointer transition-all duration-[300ms] font-[600] whitespace-nowrap min-w-[90px] hover:bg-[#7a9fe6] outline-none"
            >
              인증하기
            </button>
          </div>
          <InputPassword />
          <InputPassword placeholder="비밀번호 확인" />

          <button
            type="submit"
            className="p-[16px] bg-[#BFA9FF] text-[white] text-[16px] border-none rounded-[7px] cursor-pointer transition-all duration-[300ms] mt-[10px] font-[700] hover:bg-[#AA8EFF] outline-none"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
