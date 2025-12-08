interface HartProps {
  isSelect: boolean;
}

export default function Hart({ isSelect }: HartProps) {
  return (
    <svg
      width="35"
      height="31"
      viewBox="0 0 35 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 4.95579C14.3011 1.27877 8.9556 0.142417 4.94752 3.50946C0.93943 6.8765 0.375145 12.506 3.52272 16.4882C6.13972 19.7991 14.0597 26.7822 16.6554 29.0424C16.9457 29.2953 17.0909 29.4217 17.2604 29.4713C17.4081 29.5146 17.5699 29.5146 17.7178 29.4713C17.8872 29.4217 18.0323 29.2953 18.3228 29.0424C20.9185 26.7822 28.8383 19.7991 31.4554 16.4882C34.603 12.506 34.1075 6.84108 30.0305 3.50946C25.9535 0.177837 20.6989 1.27877 17.5 4.95579Z"
        fill={isSelect ? '#FF6B6B' : 'none'}
        stroke="#333D48"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
