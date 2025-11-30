import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '@/assets/svg/Logo/Logo';
import NextButton from '@/assets/components/NextButton';
import GenderButton from '@/assets/components/GenderButton';
import Arrow from '@/assets/svg/Arrow';
import CategoryButton from '@/assets/components/CategoryButton';
import InputPassword from '@/assets/components/InputPassword';

export default function Signup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [name, setName] = useState('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | ''>(
    ''
  );
  const [selectedGeneration, setSelectedGeneration] = useState<string>('');
  const [isGenerationOpen, setIsGenerationOpen] = useState<boolean>(false);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const generations = ['7기', '8기', '9기'];
  const interests = [
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
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStep1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      name,
      selectedGender,
      selectedGeneration,
      selectedInterests,
      email,
      password,
    });
    navigate('/login');
  };

  const renderStep1 = () => (
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
        <form className="flex flex-col gap-[16px]" onSubmit={handleStep1Submit}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-[16px] border border-[1px] border-[solid] border-[#B7BCC8] rounded-[6px] placeholder:text-[#6D6F79] text-[#6D6F79] text-[14px] outline-none focus:outline-none focus:border-[#73A9FF]"
          />
          <div className="flex gap-[2%]">
            <GenderButton
              gender="male"
              label="남자"
              isSelected={selectedGender === 'male'}
              onClick={() => setSelectedGender('male')}
            />
            <GenderButton
              gender="female"
              label="여자"
              isSelected={selectedGender === 'female'}
              onClick={() => setSelectedGender('female')}
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsGenerationOpen(!isGenerationOpen)}
              className="bg-[white] border-[1px] border-[solid] border-[#B7BCC8] rounded-[6px] text-[14px] font-[500] p-[16px] w-[100%] cursor-pointer outline-none text-left flex justify-between items-center"
            >
              <span
                className={
                  selectedGeneration ? 'text-[#333D48]' : 'text-[#6D6F79]'
                }
              >
                {selectedGeneration || '기수'}
              </span>
              <Arrow
                className={`transition-transform duration-[300ms] ${isGenerationOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isGenerationOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 w-[100%] bg-[white] border-[1px] border-[solid] border-[#B7BCC8] rounded-[6px] overflow-hidden z-10">
                {generations.map((gen) => (
                  <button
                    key={gen}
                    type="button"
                    onClick={() => {
                      setSelectedGeneration(gen);
                      setIsGenerationOpen(false);
                    }}
                    className="w-[100%] p-[16px] text-left text-[14px] font-[500] text-[#333D48] bg-[white] hover:bg-[#F5F6F8] transition-colors duration-[200ms] border-none cursor-pointer"
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
      <div className="w-[120px] mb-[28px] mx-auto">
        <Logo />
      </div>

      <p className="text-[14px] font-[500] mb-[36px] text-center">
        자신의{' '}
        <span className="text-[#73A9FF] font-[700] no-underline">전공</span>을
        선택해 주세요.
      </p>

      <form onSubmit={handleStep2Submit} className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-[10px] max-w-[320px] mb-[32px]">
          {interests.map((interest) => (
            <CategoryButton
              key={interest.id}
              label={interest.label}
              isSelected={selectedInterests.includes(interest.id)}
              onClick={() => toggleInterest(interest.id)}
            />
          ))}
        </div>
        <NextButton />
      </form>
    </div>
  );

  const renderStep3 = () => (
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

        <form onSubmit={handleStep3Submit} className="flex flex-col gap-[20px]">
          <div className="flex gap-[10px] items-stretch">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-[1] p-[16px] border-[1px] border-[solid] border-[#B7BCC8] rounded-[6px] text-[14px] outline-none focus:border-[#73A9FF]"
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
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="flex-[1] p-[16px] border-[1px] border-[solid] border-[#B7BCC8] rounded-[6px] text-[14px] outline-none focus:border-[#73A9FF]"
            />
            <button
              type="button"
              className="p-[16px] bg-[#73A9FF] text-[white] text-[14px] border-none rounded-[6px] cursor-pointer transition-all duration-[300ms] font-[600] whitespace-nowrap min-w-[90px] hover:bg-[#7a9fe6] outline-none"
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
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

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

  const renderCurrentStep = () => {
    switch (currentStep) {
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
