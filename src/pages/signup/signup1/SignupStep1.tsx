import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '@/assets/Logo/Logo';
import NextButton from '@/assets/components/NextButton';

export default function Step1() {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/signup2');
  };

  return (
    <div className="bg-[white] min-h-[100vh] flex justify-center items-center">
      <div className="text-center max-w-[320px] w-[100%]">
        <div className="w-[120px] mb-[28px] mx-auto">
          <Logo />
        </div>
        <p className="text-[14px] font-[500] text-[#333D48] mb-[36px]">
          이미 회원이신가요?{' '}
          <Link to="/login" className="text-[#73A9FF] font-[700] no-underline">
            로그인
          </Link>
        </p>
        <form className="flex flex-col gap-[16px]" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="이름"
            required
            className="p-[16px] border border-[1px] border-[solid] border-[#B7BCC8] rounded-[6px] placeholder:text-[#6D6F79] text-[#6D6F79] text-[14px] outline-none focus:outline-none focus:border-[#73A9FF]"
          />
          <div className="flex gap-[2%]">
            <button
              type="button"
              onClick={() => setSelectedGender('male')}
              className={`border-[1px] border-[solid] rounded-[6px] text-[14px] font-[500] p-[16px] w-[49%] cursor-pointer transition-all duration-[300ms] outline-none ${
                selectedGender === 'male'
                  ? 'bg-[#BFA9FF] text-[white] border-[#BFA9FF]'
                  : 'bg-[white] border-[#B7BCC8] text-[#6D6F79] hover:border-[#BFA9FF] hover:text-[#BFA9FF]'
              }`}
            >
              남자
            </button>
            <button
              type="button"
              onClick={() => setSelectedGender('female')}
              className={`border-[1px] border-[solid] rounded-[6px] text-[14px] font-[500] p-[16px] w-[49%] cursor-pointer transition-all duration-[300ms] outline-none ${
                selectedGender === 'female'
                  ? 'bg-[#BFA9FF] text-[white] border-[#BFA9FF]'
                  : 'bg-[white] border-[#B7BCC8] text-[#6D6F79] hover:border-[#BFA9FF] hover:text-[#BFA9FF]'
              }`}
            >
              여자
            </button>
          </div>
          <select
            required
            defaultValue=""
            className="bg-[white] border-[1px] border-[solid] border-[#B7BCC8] rounded-[6px] text-[14px] text-[#6D6F79] font-[500] p-[16px] w-[100%] cursor-pointer appearance-none outline-none"
          >
            <option value="" disabled>
              기수
            </option>
            <option value="7기">7기</option>
            <option value="8기">8기</option>
            <option value="9기">9기</option>
          </select>
          <NextButton />
        </form>
      </div>
    </div>
  );
}
