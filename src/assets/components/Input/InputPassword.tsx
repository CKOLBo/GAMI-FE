import Show from '@/assets/svg/password/show';
import Hide from '@/assets/svg/password/hide';
import { useState } from 'react';

interface InputPasswordProps {
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function InputPassword({
  placeholder = '비밀번호',
  name = 'password',
  value,
  onChange,
  disabled = false,
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
        disabled={disabled}
        className="w-full h-13 2xl:h-15 px-5 pr-12 2xl:pr-14 border placeholder:font-medium border-gray-2 rounded-xl text-sm text-gray-1 placeholder:text-gray-3 focus:outline-none focus:border-main-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer"
      >
        {showPassword ? <Show /> : <Hide />}
      </button>
    </div>
  );
}
