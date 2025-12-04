import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '@/assets/svg/Logo/Logo';
import Show from '@/assets/svg/password/show';
import Hide from '@/assets/svg/password/hide';

export default function SigninPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!email.endsWith('@gsm.hs.kr')) {
      newErrors.email = '학교 계정만 가능합니다.';
    }
    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      if (email === 'test@gsm.hs.kr' && password === '1234') {
        navigate('/main');
      } else {
        setErrors({
          email: '',
          password: '이메일 또는 비밀번호가 일치하지 않습니다.',
        });
      }
    }
  };

  return (
    <div className="bg-[#ffffff] h-screen flex justify-center items-center p-[20px] overflow-hidden">
      <div className="text-center max-w-[320px] w-full">
        <div className="w-[100px] mb-[30px] mx-auto">
          <Logo />
        </div>
        <p className="text-[14px] text-[#3D3D48] mb-[40px]">
          <span className="font-[500]">GAMI가 처음이라면?</span>{' '}
          <Link
            to="/signup"
            className="text-[#73A9FF] font-[700] no-underline"
          >
            회원가입하기
          </Link>
        </p>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="이메일"
            className="w-full h-[52px] px-[20px] border border-[#B7BCC8] rounded-[8px] text-[14px] text-[#3D3D48] placeholder:text-[#6D6F79] focus:outline-none focus:border-[#73A9FF] mb-[14px]"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="비밀번호"
              className="w-full h-[52px] px-[20px] pr-14 border border-[#B7BCC8] rounded-[8px] text-[14px] text-[#3D3D48] placeholder:text-[#6D6F79] focus:outline-none focus:border-[#73A9FF]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[10px] top-1/2 -translate-y-1/2 flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer"
            >
              {showPassword ? <Show /> : <Hide />}
            </button>
          </div>
          <div className="h-[22px] mb-[14px]">
            {(errors.email || errors.password) && (
              <p className="text-[12px] text-[#FF6B6B] text-left m-0 mt-[4px]">
                {errors.email || errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full h-[52px] bg-[#BFA9FF] text-[#FFFFFF] text-[16px] rounded-[8px] transition-all duration-300 font-[700] hover:bg-[#AA8EFF] border-0 cursor-pointer"
          >
            로그인
          </button>
        </form>

        <div className="mt-[8px] text-right">
          <Link
            to="/signin"
            className="font-[500] text-[14px] text-[#3D3D48] no-underline"
          >
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
