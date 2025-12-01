import Show from '@/assets/svg/password/show';
import Hide from '@/assets/svg/password/hide';
import { useState } from 'react';

interface InputPasswordProps {
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputPassword({
  placeholder = '비밀번호',
  name = 'password',
  value,
  onChange,
}: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full h-[52px] px-5 pr-14 border border-[#B7BCC8] rounded-lg text-sm text-[#3D3D48] placeholder:text-[#6D6F79] focus:outline-none focus:border-[#73A9FF]"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer"
      >
        {showPassword ? <Show /> : <Hide />}
      </button>
    </div>
  );
}
