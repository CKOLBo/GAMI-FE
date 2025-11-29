import Show from '@/assets/password/show';
import Hide from '@/assets/password/hide';
import { useState } from 'react';

export default function InputPassword() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        placeholder="비밀번호"
        className="w-full h-[52px] px-[20px] pr-14 border border-[#B7BCC8] rounded-[8px] text-[14px] text-[#3D3D48] placeholder:text-[#6D6F79] focus:outline-none focus:border-[#73A9FF]"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-[10px] top-1/2 -translate-y-1/2 flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer"
      >
        {showPassword ? <Show /> : <Hide />}
      </button>
    </div>
  );
}
