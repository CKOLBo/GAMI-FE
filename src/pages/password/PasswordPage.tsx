import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '@/assets/svg/logo/Logo';
import InputPassword from '@/assets/components/Input/InputPassword';

export default function PasswordPage() {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPw) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    navigate('/signin');
  };

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  return (
    <div className="bg-white h-screen flex justify-center items-center p-5 overflow-hidden">
      <div className="text-center max-w-xs w-full">
        <div className="w-60 mb-6 2xl:mb-10 mx-auto flex justify-center">
          <Logo size="md" className="block 2xl:hidden" />
          <Logo size="lg" className="hidden 2xl:block" />
        </div>

        <p className="text-sm 2xl:text-base text-gray-1 mb-8 2xl:mb-11">
          <span className="font-medium">비밀번호가 기억나셨나요?</span>{' '}
          <Link to="/signin" className="text-main-1 font-bold no-underline">
            로그인하기
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex gap-2 mb-4 2xl:mb-5">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-13 2xl:h-15 px-5 border border-gray-2 rounded-[10px] 2xl:rounded-[12px] text-sm text-gray-1 placeholder:text-gray-3 placeholder:font-medium focus:outline-none focus:border-main-1"
            />
            <button
              type="button"
              className="min-w-[90px] h-13 2xl:h-15 bg-main-1 text-white text-sm rounded-[10px] 2xl:rounded-[12px] font-semibold transition-all hover:bg-main-1-hover"
            >
              번호 발송
            </button>
          </div>

          <div className="flex gap-2 mb-4 2xl:mb-5">
            <input
              type="text"
              placeholder="인증번호"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="flex-1 h-13 2xl:h-15 px-5 border border-gray-2 rounded-[10px] 2xl:rounded-[12px] text-sm text-gray-1 placeholder:text-gray-3 placeholder:font-medium focus:outline-none focus:border-main-1"
            />
            <button
              type="button"
              className="min-w-[90px] h-13 2xl:h-15 bg-main-1 text-white text-sm rounded-[10px] 2xl:rounded-[12px] font-semibold transition-all hover:bg-main-1-hover"
            >
              인증하기
            </button>
          </div>
          <InputPassword
            placeholder="새 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="h-4" />
          <InputPassword
            placeholder="비밀번호 확인"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />
          <div className="h-6 2xl:h-8" />

          <button
            type="submit"
            className="w-full h-13 2xl:h-15 bg-main-2 text-white text-base rounded-[10px] 2xl:rounded-[12px] font-bold hover:bg-main-2-hover transition-all mt-3"
          >
            비밀번호 변경
          </button>
        </form>
      </div>
    </div>
  );
}
