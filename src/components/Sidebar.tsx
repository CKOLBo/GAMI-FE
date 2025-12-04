import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '@/assets/Logo/Logo';
import HomeIcon from '@/assets/sidebar/HomeIcon';
import MentoringIcon from '@/assets/sidebar/MentoringIcon';
import ChatIcon from '@/assets/sidebar/ChatIcon';
import CommunityIcon from '@/assets/sidebar/CommunityIcon';
import ProfileIcon from '@/assets/sidebar/ProfileIcon';
import LogoutIcon from '@/assets/sidebar/LogoutIcon';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/main', label: '홈', icon: HomeIcon },
    { path: '/mentoring', label: '멘토 찾기', icon: MentoringIcon },
    { path: '/chat', label: '채팅', icon: ChatIcon },
    { path: '/community', label: '익명 게시판', icon: CommunityIcon },
    { path: '/myprofile', label: '마이페이지', icon: ProfileIcon },
  ];

  return (
    <div className="w-[180px] h-screen bg-[#FFFFFF] border-r border-[#B7BCC8] flex flex-col">
      <Link to="/main" className="p-[20px] flex justify-center cursor-pointer">
        <div className="w-[116px] justify-center flex">
          <Logo size="sm" />
        </div>
      </Link>

      <nav className="flex flex-col gap-[12px] px-[12px] mt-[80px]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-[16px] px-[8px] py-[8px] rounded-[12px]
                text-[14px] font-[600] no-underline transition-colors
                ${
                  isActive
                    ? 'bg-[#F1ECFF] text-[#BFA9FF]'
                    : 'text-[#333D48] hover:bg-[#F5F5F5]'
                }
              `}
            >
              <Icon
                className={isActive ? 'text-[#BFA9FF]' : 'text-[#333D48]'}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-[16px] px-[8px] py-[8px] rounded-[12px] text-[14px] font-[600] text-[#333D48] hover:bg-[#F5F5F5] transition-colors bg-transparent border-0 cursor-pointer text-left w-full"
        >
          <LogoutIcon className="text-[#333D48]" />
          <span>로그아웃</span>
        </button>
      </nav>
    </div>
  );
}
