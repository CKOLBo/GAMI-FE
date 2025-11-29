import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/Logo/Logo';
import CategoryButton from '@/assets/components/CategoryButton';
import NextButton from '@/assets/components/NextButton';

export default function Step2() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/signup3');
  };

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <Logo />

      <p className="font-[500] mb-8 text-center">
        자신의{' '}
        <span className="text-[#73A9FF] font-[700] no-underline">전공</span>을
        선택해 주세요.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
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
}
