import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '@/assets/svg/logo/Logo';
import NextButton from '@/assets/components/Button/NextButton';
import GenderButton from '@/assets/components/Button/GenderButton';
import Arrow from '@/assets/svg/Arrow';
import CategoryButton from '@/assets/components/Button/CategoryButton';
import InputPassword from '@/assets/components/Input/InputPassword';

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

  const generations = ['7기', '8기', '9기'];
  const interestList = [
    { id: 'FE', label: 'FE' },
    { id: 'BE', label: 'BE' },
    { id: 'iOS', label: 'iOS' },
    { id: 'Mobile Robotics', label: 'Mobile Robotics' },
    { id: 'Android', label: 'Android' },
    { id: 'Design', label: 'Design' },
    { id: 'DevOps', label: 'DevOps' },
    { id: 'AI', label: 'AI' },
    { id: 'IT Network', label: 'IT Network' },
    { id: 'Flutter', label: 'Flutter' },
    { id: 'Cyber Security', label: 'Cyber Security' },
    { id: 'Game Development', label: 'Game Development' },
    { id: 'Cloud Computing', label: 'Cloud Computing' },
  ];

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStep1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPw) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log({
      name,
      gender,
      generation,
      interests,
      email,
      password,
    });
    navigate('/signin');
  };

  const renderStep1 = () => (
    <div className="bg-white min-h-screen flex justify-center items-center">
      <div className="text-center max-w-80 w-full">
        <div className="w-[120px] mb-7 mx-auto">
          <Logo />
        </div>
        <p className="text-sm font-medium text-gray-1 mb-9">
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
            className="p-4 border border-solid border-gray-2 rounded-lg placeholder:text-gray-3 placeholder:font-medium text-gray-1 text-sm outline-none focus:outline-none focus:border-main-1"
          />
          <div className="flex gap-[2%]">
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
              className="bg-white border border-solid border-gray-2 rounded-lg text-sm font-medium p-4 w-full cursor-pointer outline-none text-left flex justify-between items-center"
            >
              <span
                className={generation ? 'text-gray-1' : 'text-gray-3'}
              >
                {generation || '기수'}
              </span>
              <Arrow
                className={`transition-transform duration-300 ${isGenOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isGenOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-solid border-gray-2 rounded-lg overflow-hidden z-10">
                {generations.map((gen) => (
                  <button
                    key={gen}
                    type="button"
                    onClick={() => {
                      setGeneration(gen);
                      setIsGenOpen(false);
                    }}
                    className="w-full p-4 text-left text-sm font-medium text-gray-1 bg-white hover:bg-[#F5F6F8] transition-colors duration-200 border-none cursor-pointer"
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

      <p className="text-sm font-medium mb-9 text-center">
        자신의{' '}
        <span className="text-main-1 font-bold no-underline">전공</span>을
        선택해 주세요.
      </p>

      <form onSubmit={handleStep2Submit} className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-2.5 max-w-80 mb-8">
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
    <div className="text-sm bg-white min-h-screen flex justify-center">
      <div className="text-center flex flex-col justify-center max-w-80 w-full">
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
          <div className="flex gap-2.5 items-stretch">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 p-4 border border-solid border-gray-2 placeholder:text-gray-3 placeholder:font-medium rounded-lg text-sm outline-none focus:border-main-1"
            />
            <button
              type="button"
              className="p-4 bg-main-1 text-white text-sm border-none rounded-lg cursor-pointer transition-all duration-300 font-semibold whitespace-nowrap min-w-[90px] hover:bg-main-1-hover outline-none"
            >
              번호 발송
            </button>
          </div>

          <div className="flex gap-2.5 items-stretch">
            <input
              type="text"
              placeholder="인증번호"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="flex-1 p-4 border border-solid placeholder:font-medium border-gray-2 placeholder:text-gray-3 rounded-lg text-sm outline-none focus:border-main-1"
            />
            <button
              type="button"
              className="p-4 bg-main-1 text-white text-sm border-none rounded-lg cursor-pointer transition-all duration-300 font-semibold whitespace-nowrap min-w-[90px] hover:bg-main-1-hover outline-none"
            >
              인증하기
            </button>
          </div>
          <InputPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputPassword
            placeholder="비밀번호 확인"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />

          <button
            type="submit"
            className="p-4 bg-main-2 text-white text-base border-none rounded-lg cursor-pointer transition-all duration-300 mt-2.5 font-bold hover:bg-main-2-hover outline-none"
          >
            회원가입
          </button>
        </form>
      </div>
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
