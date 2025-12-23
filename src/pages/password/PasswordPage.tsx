import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Logo from '@/assets/svg/logo/Logo';
import InputPassword from '@/assets/components/Input/InputPassword';
import { instance, TokenRefreshError } from '@/assets/shared/lib/axios';
import { API_PATHS } from '@/constants/api';
import { handleApiError } from '@/utils/handleApiError';

export default function PasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setIsLoading(true);
    try {
      await instance.post(API_PATHS.SEND_CODE, {
        email,
        verificationType: 'RESET_PASSWORD',
      });

      setIsCodeSent(true);
      setIsCodeVerified(false);
      setCode('');
      toast.success('인증 코드가 발송되었습니다. 이메일을 확인해주세요.');
    } catch (error: unknown) {
      if (error instanceof TokenRefreshError) {
        navigate('/signin');
        return;
      }
      console.error('인증 코드 발송 실패:', error);
      handleApiError(
        error,
        '인증 코드 발송에 실패했습니다. 다시 시도해주세요.',
        {
          400: '잘못된 요청입니다. 이메일 형식을 확인해주세요.',
          404: '해당 이메일로 등록된 사용자가 존재하지 않습니다.',
          409: '이미 유효한 인증번호가 전송된 상태입니다. 잠시 후 다시 시도해주세요.',
          429: '인증번호 전송 요청 횟수 제한을 초과했습니다. 잠시 후 다시 시도해주세요.',
          500: '서버 에러로 인해 이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.',
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      toast.error('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await instance.post(API_PATHS.VERIFY_CODE, {
        email,
        code,
      });

      setIsCodeVerified(true);
      toast.success('이메일 인증이 완료되었습니다.');
    } catch (error: unknown) {
      if (error instanceof TokenRefreshError) {
        navigate('/signin');
        return;
      }
      console.error('인증 코드 검증 실패:', error);
      handleApiError(
        error,
        '인증 코드 검증에 실패했습니다. 다시 시도해주세요.',
        {
          400: '잘못된 인증 코드입니다. 다시 확인해주세요.',
          429: '요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.',
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isCodeVerified) {
      toast.error('이메일 인증을 완료해주세요.');
      return;
    }

    if (password !== confirmPw) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      toast.error('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      await instance.patch(API_PATHS.RESET_PASSWORD, {
        email,
        newPassword: password,
      });

      toast.success('비밀번호가 변경되었습니다.');
      navigate('/signin');
    } catch (error: unknown) {
      if (error instanceof TokenRefreshError) {
        navigate('/signin');
        return;
      }
      console.error('비밀번호 변경 실패:', error);
      handleApiError(
        error,
        '비밀번호 변경에 실패했습니다. 다시 시도해주세요.',
        {
          401: '인증이 필요합니다. 다시 시도해주세요.',
          400: '입력값에 오류가 있습니다. 다시 확인해주세요.',
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white h-screen flex justify-center items-center p-5 overflow-hidden">
      <div className="text-center max-w-xs w-full">
        <div className="w-60 mb-6 2xl:mb-10 mx-auto flex justify-center">
          <Logo size="md" />
        </div>
        <p className="text-sm 2xl:text-base text-gray-1 mb-8 2xl:mb-11">
          <span className="font-medium">비밀번호가 기억나셨나요?</span>{' '}
          <Link to="/signin" className="text-main-1 font-bold no-underline">
            로그인하기
          </Link>
        </p>

        <div className="flex flex-col w-full 2xl:items-center">
          <form
            className="flex flex-col w-full 2xl:items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-2 w-full 2xl:w-[376px] mb-4 2xl:mb-5">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsCodeSent(false);
                  setIsCodeVerified(false);
                }}
                required
                disabled={isCodeVerified}
                className="flex-1 h-13 2xl:h-15 px-5 border border-gray-2 rounded-xl text-sm text-gray-1 placeholder:text-gray-3 placeholder:font-medium focus:outline-none focus:border-main-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading || isCodeVerified}
                className="min-w-[90px] h-13 2xl:h-15 bg-main-1 text-white rounded-[10px] 2xl:rounded-[12px] text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-main-1-hover outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? '발송 중...' : isCodeSent ? '재발송' : '번호 발송'}
              </button>
            </div>

            {isCodeSent && (
              <div className="flex gap-2 w-full 2xl:w-[376px] mb-4 2xl:mb-5">
                <input
                  type="text"
                  placeholder="인증번호"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={isCodeVerified}
                  className="flex-1 h-13 2xl:h-15 px-5 border border-gray-2 rounded-xl text-sm text-gray-1 placeholder:text-gray-3 placeholder:font-medium focus:outline-none focus:border-main-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isLoading || isCodeVerified}
                  className={`min-w-[90px] h-13 2xl:h-15 rounded-[10px] 2xl:rounded-[12px] text-sm font-semibold cursor-pointer transition-all duration-300 outline-none ${
                    isCodeVerified
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-main-1 text-white hover:bg-main-1-hover disabled:bg-gray-300 disabled:cursor-not-allowed'
                  }`}
                >
                  {isCodeVerified
                    ? '인증완료'
                    : isLoading
                      ? '인증 중...'
                      : '인증하기'}
                </button>
              </div>
            )}

            <div className="w-full 2xl:w-[376px] mb-4 2xl:mb-5">
              <InputPassword
                placeholder="새 비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!isCodeVerified}
              />
            </div>

            <div className="w-full 2xl:w-[376px] mb-4 2xl:mb-5">
              <InputPassword
                placeholder="비밀번호 확인"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                disabled={!isCodeVerified}
              />
            </div>

            <div className="h-6 mb-3 2xl:mb-4"></div>

            <button
              type="submit"
              disabled={isLoading || !isCodeVerified}
              className="w-full 2xl:w-[376px] h-13 2xl:h-15 bg-main-2 text-white text-base rounded-[10px] 2xl:rounded-[12px] transition-all duration-300 font-bold hover:bg-main-2-hover border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
