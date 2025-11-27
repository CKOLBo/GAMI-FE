import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/assets/Logo/Logo';

export default function JoinPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/signup/email');
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
            로그인
          </Link>
        </p>
        <form className="flex flex-col gap-[20px]" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="이름"
            required
            className="p-[16px] border-[1px] border-[solid] border-[#ddd] rounded-[6px] text-[14px] outline-none"
          />
          <div className="flex gap-[2%]">
            <button
              type="button"
              className="bg-[white] border-[1px] border-[solid] border-[#ddd] rounded-[6px] text-[14px] text-[#858486] font-[500] p-[16px] w-[49%] cursor-pointer transition-all duration-[300ms] hover:border-[#91bbff] hover:text-[#91bbff] outline-none"
            >
              남자
            </button>
            <button
              type="button"
              className="bg-[white] border-[1px] border-[solid] border-[#ddd] rounded-[6px] text-[14px] text-[#858486] font-[500] p-[16px] w-[49%] cursor-pointer transition-all duration-[300ms] hover:border-[#91bbff] hover:text-[#91bbff] outline-none"
            >
              여자
            </button>
          </div>
          <select
            required
            defaultValue=""
            className="bg-[white] border-[1px] border-[solid] border-[#ddd] rounded-[6px] text-[14px] text-[#858486] font-[500] p-[16px] w-[100%] cursor-pointer appearance-none outline-none"
          >
            <option value="" disabled>
              기수
            </option>
            <option value="7기">7기</option>
            <option value="8기">8기</option>
            <option value="9기">9기</option>
          </select>
          <button
            type="submit"
            className="p-[16px] bg-[#cebeff] text-[white] text-[15px] border-none rounded-[6px] cursor-pointer transition-all duration-[300ms] mt-[10px] font-[600] hover:bg-[#bbaaf5] outline-none"
          >
            다음으로
          </button>
        </form>
      </div>
    </div>
  );
}
