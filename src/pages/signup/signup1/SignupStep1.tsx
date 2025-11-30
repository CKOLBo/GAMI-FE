import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '@/assets/svg/Logo/Logo';
import NextButton from '@/assets/components/NextButton';
import GenderButton from '@/assets/components/GenderButton';
import Arrow from '@/assets/svg/Arrow';

export default function Step1() {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | ''>(
    ''
  );
  const [selectedGeneration, setSelectedGeneration] = useState<string>('');
  const [isGenerationOpen, setIsGenerationOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/signup2');
  };

  const generations = ['7기', '8기', '9기'];

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
}
