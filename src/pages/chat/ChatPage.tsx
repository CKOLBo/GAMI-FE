import Sidebar from '@/assets/components/Sidebar';
import Logo from '@/assets/svg/logo/Logo';
import Profile from '@/assets/svg/profile/Profile';
import BellIcon from '@/assets/svg/common/BellIcon';
import SearchIcon from '@/assets/svg/main/SearchIcon';
import Divider from '@/assets/svg/Divider';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
}

export default function ChatPage() {
  const chatList: ChatItem[] = [];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-45 2xl:ml-55 flex min-h-screen">
        <div className="w-96 2xl:w-[480px] border-r border-gray-2 bg-white flex flex-col min-h-screen">
          <div className="px-6 2xl:px-8 pt-6 2xl:pt-8 pb-4 2xl:pb-5">
            <div className="flex items-center justify-between mb-4 2xl:mb-5">
              <h1 className="flex items-center gap-4 text-[40px] font-bold text-gray-1">
                <span className="text-[40px] text-gray-1 font-bold">
                  채팅
                </span>
                <Divider className="flex-shrink-0" />
                <span className="text-[32px] text-gray-2 font-bold">
                  요청
                </span>
              </h1>
              <BellIcon className="text-gray-3" />
            </div>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="검색"
                className="w-full h-12 2xl:h-14 rounded-full bg-white-1 border border-gray-4 pl-12 2xl:pl-14 pr-4 py-2 text-base 2xl:text-lg text-gray-1 placeholder:text-gray-3 focus:outline-main-1 font-bold"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatList.length > 0 ? (
              chatList.map((chat) => (
                <div
                  key={chat.id}
                  className="px-6 2xl:px-8 py-4 2xl:py-5 border-b border-gray-2 hover:bg-[#F9F9F9] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4 2xl:gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 2xl:w-14 h-12 2xl:h-14 rounded-full bg-gray-2 flex items-center justify-center">
                        <Profile width={40} height={40} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base 2xl:text-lg font-semibold text-gray-1 mb-1 truncate">
                        {chat.name}
                      </h3>
                      <p className="text-sm 2xl:text-base text-gray-3 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-base 2xl:text-lg text-gray-3">
                  채팅 목록이 없습니다
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="mb-8 2xl:mb-12 flex justify-center">
              <Logo size="lg" />
            </div>
            <p className="text-2xl 2xl:text-3xl font-bold text-gray-3">
              <span className="text-main-2">멘토</span>와{' '}
              <span className="text-main-1">멘티</span>를 바로 연결하는
              <br />
                맞춤형 멘토링 서비스
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

