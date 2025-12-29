import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Logo from '@/assets/svg/logo/Logo';
import NextButton from '@/assets/components/Button/NextButton';
import GenderButton from '@/assets/components/Button/GenderButton';
import Arrow from '@/assets/svg/Arrow';
import CategoryButton from '@/assets/components/Button/CategoryButton';
import InputPassword from '@/assets/components/Input/InputPassword';
import ToSModal from '@/assets/components/modal/ToSModal';
import PrivacyModal from '@/assets/components/modal/PrivacyModal';
import { instance } from '@/assets/shared/lib/axios';

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [generation, setGeneration] = useState<string>('');
  const [isGenOpen, setIsGenOpen] = useState<boolean>(false);

  const [interests, setInterests] = useState<string[]>([]);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isToSModalOpen, setIsToSModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleToSClick = () => {
    setIsToSModalOpen(true);
  };

  const handlePrivacyClick = () => {
    setIsPrivacyModalOpen(true);
  };

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeService(checked);
    setAgreePrivacy(checked);
  };

  const handleAgreeItem = (type: 'service' | 'privacy', checked: boolean) => {
    if (type === 'service') setAgreeService(checked);
    if (type === 'privacy') setAgreePrivacy(checked);

    setAgreeAll(
      (type === 'service' ? checked : agreeService) &&
        (type === 'privacy' ? checked : agreePrivacy)
    );
  };

  const generations = ['7기', '8기', '9기'];
  const interestList = [
    { id: 'FRONTEND', label: 'FE' },
    { id: 'BACKEND', label: 'BE' },
    { id: 'IOS', label: 'iOS' },
    { id: 'MOBILE_ROBOTICS', label: 'Mobile Robotics' },
    { id: 'ANDROID', label: 'Android' },
    { id: 'DESIGN', label: 'Design' },
    { id: 'DEVOPS', label: 'DevOps' },
    { id: 'AI', label: 'AI' },
    { id: 'IT_NETWORK', label: 'IT Network' },
    { id: 'FLUTTER', label: 'Flutter' },
    { id: 'CYBER_SECURITY', label: 'Cyber Security' },
    { id: 'GAME_DEVELOP', label: 'Game Development' },
    { id: 'CLOUD_COMPUTING', label: 'Cloud Computing' },
  ];

  const toggleInterest = (id: string) => {
    setInterests((prev) => (prev.includes(id) ? [] : [id]));
  };

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
      await instance.post('/api/auth/email/send-code', {
        email,
        verificationType: 'SIGN_UP',
      });

      setIsCodeSent(true);
      toast.success('인증 코드가 발송되었습니다. 이메일을 확인해주세요.');
    } catch (error: unknown) {
      console.error('인증 코드 발송 실패:', error);
      if ((error as { code?: string }).code === 'ECONNABORTED') {
        toast.error('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
      } else if (
        (error as { response?: { status?: number } }).response?.status === 429
      ) {
        toast.error('요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (
        (error as { response?: { status?: number } }).response?.status === 400
      ) {
        toast.error(
          (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message || '입력값에 오류가 있습니다.'
        );
      } else {
        toast.error('인증 코드 발송에 실패했습니다. 다시 시도해주세요.');
      }
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
      await instance.post('/api/auth/email/verification-code', {
        email,
        code,
      });

      setIsCodeVerified(true);
      toast.success('이메일 인증이 완료되었습니다.');
    } catch (error: unknown) {
      console.error('인증 코드 검증 실패:', error);
      if (
        (error as { response?: { status?: number } }).response?.status === 400
      ) {
        toast.error('잘못된 인증 코드입니다. 다시 확인해주세요.');
      } else if (
        (error as { response?: { status?: number } }).response?.status === 429
      ) {
        toast.error('요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        toast.error('인증 코드 검증에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !gender || !generation) {
      toast.error('모든 항목을 입력해주세요.');
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (interests.length === 0) {
      toast.error('최소 1개 이상의 전공을 선택해주세요.');
      return;
    }
    setStep(3);
  };

  const handleStep3Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreeService || !agreePrivacy) {
      toast.error('필수 약관에 모두 동의해주세요.');
      return;
    }

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
      const generationNumber = parseInt(generation.replace(/[^0-9]/g, ''));

      await instance.post('/api/auth/signup', {
        email,
        password,
        name,
        generation: generationNumber,
        gender: gender.toUpperCase(),
        major: interests[0],
      });

      toast.success('회원가입이 완료되었습니다!');
      navigate('/signin');
    } catch (error: unknown) {
      console.error('회원가입 실패:', error);
      if (
        (error as { response?: { status?: number } }).response?.status === 400
      ) {
        toast.error('입력값에 오류가 있습니다. 다시 확인해주세요.');
      } else {
        toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="bg-white min-h-screen flex justify-center items-center">
      <div className="text-center max-w-94 w-full">
        <div className="w-[120px] mb-7 mx-auto">
          <Logo />
        </div>
        <p className="font-medium text-gray-1 mb-9">
          이미 회원이신가요?{' '}
          <Link to="/signin" className="text-main-1 font-bold no-underline">
            로그인
          </Link>
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleStep1Submit}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-15 p-4 border border-solid border-gray-2 rounded-xl placeholder:text-gray-3 placeholder:font-medium text-gray-1 outline-none focus:outline-none focus:border-main-1"
          />
          <div className="h-15 flex gap-[2%]">
            <GenderButton
              gender="male"
              label="남자"
              isSelected={gender === 'male'}
              onClick={() => setGender('male')}
            />
            <GenderButton
              gender="female"
              label="여자"
              isSelected={gender === 'female'}
              onClick={() => setGender('female')}
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsGenOpen(!isGenOpen)}
              className="bg-white border border-solid h-15 border-gray-2 rounded-xl font-medium p-4 w-full cursor-pointer outline-none text-left flex justify-between items-center"
            >
              <span className={generation ? 'text-gray-1' : 'text-gray-3'}>
                {generation || '기수'}
              </span>
              <Arrow
                className={`transition-transform duration-300 ${isGenOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isGenOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-solid border-gray-2 rounded-xl overflow-hidden z-10">
                {generations.map((gen) => (
                  <button
                    key={gen}
                    type="button"
                    onClick={() => {
                      setGeneration(gen);
                      setIsGenOpen(false);
                    }}
                    className="w-full p-4 text-left font-medium text-gray-1 bg-white hover:bg-[#F5F6F8] transition-colors duration-200 border-none cursor-pointer"
                  >
                    {gen}
                  </button>
                ))}
              </div>
            )}
          </div>

          <NextButton />
        </form>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-[120px] mb-7 mx-auto">
        <Logo />
      </div>

      <p className="font-medium mb-9 text-center">
        자신의 <span className="text-main-1 font-bold no-underline">전공</span>
        을 선택해 주세요.
      </p>

      <form
        onSubmit={handleStep2Submit}
        className="max-w-94 w-full flex flex-col items-center"
      >
        <div className="flex flex-wrap justify-center gap-2.5 max-w-94 mb-8">
          {interestList.map((interest) => (
            <CategoryButton
              key={interest.id}
              label={interest.label}
              isSelected={interests.includes(interest.id)}
              onClick={() => toggleInterest(interest.id)}
            />
          ))}
        </div>
        <NextButton />
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-base bg-white min-h-screen flex justify-center">
      <div className="text-center flex flex-col justify-center max-w-94 w-full">
        <div className="w-[120px] mb-7 mx-auto">
          <Logo />
        </div>

        <p className="font-medium text-gray-1 mb-9">
          이미 회원이신가요?{' '}
          <Link className="text-main-1 font-bold no-underline" to="/signin">
            로그인하기
          </Link>
        </p>

        <form onSubmit={handleStep3Submit} className="flex flex-col gap-5">
          <div className="flex gap-2.5 h-15 items-stretch">
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
              className="flex-1 p-4 border border-solid text-gray-1 border-gray-2 placeholder:text-gray-3 placeholder:font-medium rounded-xl outline-none focus:border-main-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={isLoading || isCodeVerified}
              className="p-4 bg-main-1 text-white border-none rounded-xl cursor-pointer transition-all duration-300 font-semibold whitespace-nowrap min-w-[90px] hover:bg-[#7a9fe6] outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? '발송 중...' : isCodeSent ? '재발송' : '번호 발송'}
            </button>
          </div>

          {isCodeSent && (
            <div className="flex gap-2.5 h-15 items-stretch">
              <input
                type="text"
                placeholder="인증번호"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={isCodeVerified}
                className="flex-1 p-4 border border-solid text-gray-1 placeholder:font-medium border-gray-2 placeholder:text-gray-3 rounded-xl outline-none focus:border-main-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={isLoading || isCodeVerified}
                className="p-4 bg-main-1 text-white border-none rounded-xl cursor-pointer transition-all duration-300 font-semibold whitespace-nowrap min-w-[90px] hover:bg-[#7a9fe6] outline-none disabled:bg-green-500"
              >
                {isCodeVerified
                  ? '인증완료'
                  : isLoading
                    ? '인증 중...'
                    : '인증하기'}
              </button>
            </div>
          )}

          <InputPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputPassword
            placeholder="비밀번호 확인"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />

          <div className="flex flex-col gap-5 mt-5 mb-5 text-left">
            <label className="bg-[#F9F9F9] h-15 rounded-lg p-4 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeAll}
                onChange={(e) => handleAgreeAll(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="font-medium text-gray-3">전체 약관 동의</span>
            </label>

            <div className="flex justify-between ml-2 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeService}
                  onChange={(e) => handleAgreeItem('service', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-gray-1">[필수] GAMI 이용 약관 동의</span>
              </label>
              <button
                type="button"
                onClick={handleToSClick}
                className="cursor-pointer bg-transparent border-none"
              >
                <Arrow className="w-6 h-6 text-gray-3" />
              </button>
            </div>

            <div className="flex justify-between ml-2 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => handleAgreeItem('privacy', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-gray-1">
                  [필수] 개인정보 수집 및 이용 동의
                </span>
              </label>
              <button
                type="button"
                onClick={handlePrivacyClick}
                className="cursor-pointer bg-transparent border-none"
              >
                <Arrow className="w-6 h-6 text-gray-3" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isCodeVerified}
            className="h-16 p-4 bg-main-2 text-white border-none text-xl rounded-xl cursor-pointer font-bold transition-all hover:bg-main-2-hover outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? '처리 중...' : '회원가입'}
          </button>
        </form>
      </div>
      {isToSModalOpen && <ToSModal onClose={() => setIsToSModalOpen(false)} />}
      {isPrivacyModalOpen && (
        <PrivacyModal onClose={() => setIsPrivacyModalOpen(false)} />
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return renderCurrentStep();
}
