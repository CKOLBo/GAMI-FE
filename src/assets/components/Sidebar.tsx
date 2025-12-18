import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '@/assets/svg/logo/Logo';
import HomeIcon from '@/assets/svg/sidebar/HomeIcon';
import MentoringIcon from '@/assets/svg/sidebar/MentoringIcon';
import ChatIcon from '@/assets/svg/sidebar/ChatIcon';
import PostIcon from '@/assets/svg/sidebar/PostIcon';
import ProfileIcon from '@/assets/svg/sidebar/ProfileIcon';
import LogoutIcon from '@/assets/svg/sidebar/LogoutIcon';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const menuItems = [
    { path: '/main', label: '홈', icon: HomeIcon },
    { path: '/mentoring', label: '멘토링', icon: MentoringIcon },
    { path: '/chat', label: '채팅', icon: ChatIcon },
    { path: '/post', label: '익명 게시판', icon: PostIcon },
    { path: '/my-page', label: '마이페이지', icon: ProfileIcon },
  ];

  return (
    <div className="w-45 2xl:w-55 h-screen bg-white border-r border-gray-2 flex flex-col">
      <Link
        to="/main"
        className="pt-6 2xl:pt-7 flex justify-center cursor-pointer"
      >
        <div className="w-22 2xl:w-29 justify-center flex">
          <Logo size="md" />
        </div>
      </Link>

      <nav className="flex flex-col gap-3 2xl:gap-4 px-3 2xl:px-4 mt-20 2xl:mt-25">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-5.5 px-2.5 py-2.5 rounded-xl
                text-base font-semibold no-underline transition-colors
                ${
                  isActive
                    ? 'bg-[#F1ECFF] text-main-2'
                    : 'text-gray-1 hover:bg-[#F5F5F5]'
                }
              `}
            >
              <Icon className={isActive ? 'text-main-2' : 'text-gray-1'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-5.5 px-2.5 py-2.5 rounded-xl text-base font-semibold text-gray-1 hover:bg-[#F5F5F5] transition-colors bg-transparent border-0 cursor-pointer text-left w-full"
        >
          <LogoutIcon className="text-gray-1" />
          <span>로그아웃</span>
        </button>
      </nav>
    </div>
  );
}
