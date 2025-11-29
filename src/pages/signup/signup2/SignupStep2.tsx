import { useState } from 'react';
import Logo from '@/assets/Logo/Logo';
import CategoryButton from '@/assets/components/CategoryButton';

export default function Step2() {
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

      <div className="flex flex-wrap justify-center gap-[10px] max-w-2xl mb-8">
        {interests.map((interest) => (
          <CategoryButton
            key={interest.id}
            label={interest.label}
            isSelected={selectedInterests.includes(interest.id)}
            onClick={() => toggleInterest(interest.id)}
          />
        ))}
      </div>

      <button className="bg-purple-400 text-white text-lg font-medium px-32 py-4 rounded-2xl hover:bg-purple-500 transition-colors duration-200">
        다음으로
      </button>
    </div>
  );
}
