import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/assets/svg/logo/Logo';
import Show from '@/assets/svg/password/show';
import Hide from '@/assets/svg/password/hide';

export default function SigninPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
        login(
          {
            id: 1,
            email: email,
            name: '테스트 사용자',
          },
          'mock-token'
        );
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
    <div className="bg-white h-screen flex justify-center items-center p-5 overflow-hidden">
      <div className="text-center max-w-xs w-full">
        <div className="w-60 mb-6 2xl:mb-10 mx-auto flex justify-center">
          <Logo size="md" />
        </div>
        <p className="text-sm 2xl:text-base text-gray-1 mb-8 2xl:mb-11">
          <span className="font-medium">GAMI가 처음이라면?</span>{' '}
          <Link to="/signup" className="text-main-1 font-bold no-underline">
            회원가입하기
          </Link>
        </p>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="이메일"
            className="w-full h-13 2xl:h-15 px-5 border border-gray-2 rounded-[10px] 2xl:rounded-[12px] text-sm text-gray-1 placeholder:text-gray-3 placeholder:font-medium focus:outline-none focus:border-main-1 mb-4 2xl:mb-5"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="비밀번호"
              className="w-full h-13 2xl:h-15 px-5 border border-gray-2 rounded-[10px] 2xl:rounded-[12px] text-sm text-gray-1 placeholder:text-gray-3 placeholder:font-medium focus:outline-none focus:border-main-1 pr-12 2xl:pr-14 "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer"
            >
              {showPassword ? <Show /> : <Hide />}
            </button>
          </div>
          <div className="h-6 mb-3 2xl:mb-4">
            {(errors.email || errors.password) && (
              <p className="text-xs text-main-3 text-left m-0 mt-1 2xl:mt-2">
                {errors.email || errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full h-13 2xl:h-15 bg-main-2 text-white text-base rounded-[10px] 2xl:rounded-[12px] transition-all duration-300 font-bold hover:bg-main-2-hover border-0 cursor-pointer"
          >
            로그인
          </button>
        </form>

        <div className="mt-2 2xl:mt-3 text-right">
          <Link
            to="/password"
            className="font-medium text-sm text-gray-1 no-underline"
          >
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
