import Sidebar from '@/assets/components/Sidebar';
import Logo from '@/assets/svg/logo/Logo';
import Profile from '@/assets/svg/profile/Profile';
import BellIcon from '@/assets/svg/common/BellIcon';
import SearchIcon from '@/assets/svg/main/SearchIcon';
import Divider from '@/assets/svg/Divider';
import MentorRequestModal from '@/assets/components/modal/MentorRequestModal';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { instance } from '@/assets/shared/lib/axios';
import { Link } from 'react-router-dom';

interface ChatItem {
  id: number;
  name: string;
  lastMessage: string;
  major: string;
  generation: number;
}

interface ChatRoomDetail {
  roomId: number;
  name: string;
  major: string;
  generation: number;
}

interface ChatMessage {
  messageId: number;
  message: string;
  createdAt: string;
  senderId: number;
  senderName: string;
}

interface ChatMessagesResponse {
  roomId: number;
  messages: ChatMessage[];
  nextCursor: number;
  hasMore: boolean;
  roomStatus: string;
  currentMemberLeft: boolean;
}

const mentorRequests = [
  { applyId: 1, name: '양은준', applyStatus: 'PENDING' },
  { applyId: 2, name: '한국', applyStatus: 'PENDING' },
  { applyId: 3, name: '양은준', applyStatus: 'PENDING' },
  { applyId: 4, name: '한국', applyStatus: 'PENDING' },
  { applyId: 5, name: '양은준', applyStatus: 'PENDING' },
  { applyId: 6, name: '한국', applyStatus: 'PENDING' },
];


export default function ChatPage() {
  const { user } = useAuth();
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [roomDetail, setRoomDetail] = useState<ChatRoomDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isMentorRequestModalOpen, setIsMentorRequestModalOpen] =
    useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const currentUserId = user?.id ?? null;

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    setRoomsLoading(true);
    try {
      const response = await instance.get<ChatItem[]>('/api/chat/rooms');
      if (Array.isArray(response.data)) {
        setChatList(response.data);
      }
    } catch (error) {
      console.error('채팅방 목록 로드 실패:', error);
    } finally {
      setRoomsLoading(false);
    }
  };

  const filteredChatList = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery === '') {
      return chatList;
    }
    return chatList.filter(
      (chat) =>
        chat.name.toLowerCase().includes(trimmedQuery) ||
        chat.major.toLowerCase().includes(trimmedQuery) ||
        chat.lastMessage.toLowerCase().includes(trimmedQuery)
    );
  }, [searchQuery, chatList]);

  const handleChatClick = async (roomId: number) => {
    setSelectedRoomId(roomId);
    setLoading(true);
    setNextCursor(null);
    setHasMore(false);

    try {
      const [roomResponse, messagesResponse] = await Promise.all([
        instance.get<ChatRoomDetail>(`/api/chat/${roomId}`),
        instance.get<ChatMessagesResponse>(`/api/chat/${roomId}/messages`),
      ]);

      setRoomDetail(roomResponse.data);
      if (
        messagesResponse.data &&
        Array.isArray(messagesResponse.data.messages)
      ) {
        setMessages(messagesResponse.data.messages);
        setNextCursor(messagesResponse.data.nextCursor);
        setHasMore(messagesResponse.data.hasMore);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('채팅방 정보 로드 실패:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!selectedRoomId || !nextCursor || !hasMore || loading) return;

    setLoading(true);
    try {
      const response = await instance.get<ChatMessagesResponse>(
        `/api/chat/${selectedRoomId}/messages`,
        {
          params: { cursor: nextCursor },
        }
      );

      if (
        response.data &&
        Array.isArray(response.data.messages) &&
        response.data.messages.length > 0
      ) {
        setMessages((prev) => [...response.data.messages, ...prev]);
        setNextCursor(response.data.nextCursor);
        setHasMore(response.data.hasMore);
      }
    } catch (error) {
      console.error('메시지 추가 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedRoomId) return;

    try {
      await instance.post(`/api/chat/${selectedRoomId}/messages`, {
        message: messageInput,
      });
      setMessageInput('');

      const messagesResponse = await instance.get<ChatMessagesResponse>(
        `/api/chat/${selectedRoomId}/messages`
      );
      if (
        messagesResponse.data &&
        Array.isArray(messagesResponse.data.messages)
      ) {
        setMessages(messagesResponse.data.messages);
        setNextCursor(messagesResponse.data.nextCursor);
        setHasMore(messagesResponse.data.hasMore);
      }

      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  const handleExit = async () => {
    if (!selectedRoomId) return;

    try {
      await instance.delete(`/api/chat/rooms/${selectedRoomId}/leave`);
      setSelectedRoomId(null);
      setRoomDetail(null);
      setMessages([]);
      setNextCursor(null);
      setHasMore(false);
      fetchChatRooms();
    } catch (error) {
      console.error('채팅방 나가기 실패:', error);
      alert('채팅방 나가기에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleAcceptMentor = (applyId: number) => {
    console.log(`멘토 신청 수락: ${applyId}`);
  };

  const handleRejectMentor = (applyId: number) => {
    console.log(`멘토 신청 거절: ${applyId}`);
  };

  const handleBellClick = () => {
    setIsMentorRequestModalOpen(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-45 2xl:ml-55 flex min-h-screen">
        <div className="w-96 2xl:w-[480px] border-r border-gray-2 bg-white flex flex-col min-h-screen">
          <div className="px-7 2xl:px-15 pt-7 2xl:pt-15 pb-4 2xl:pb-5">
            <div className="flex items-center justify-between mb-4 2xl:mb-5">
              <h1 className="flex items-center gap-4 text-[40px] font-bold">
                <span className="text-3xl 2xl:text-[40px] text-gray-1 font-bold">채팅</span>
                <Divider className="flex-shrink-0" />
                <Link
                  to="/chat-apply"
                  className="text-3xl 2xl:text-[40px] text-gray-2 font-bold hover:text-gray-1 transition-colors cursor-pointer"
                >
                  요청
                </Link>
              </h1>
              <button
                onClick={handleBellClick}
                className="relative p-1 cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent"
                type="button"
              >
                <BellIcon className="text-gray-3 pointer-events-none" />
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                <SearchIcon />
              </div>
              <input
                  type="text"
                  placeholder="검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 2xl:h-14 rounded-full bg-white-1 border border-gray-4 pl-14 2xl:pl-14 pr-4 py-1 text-base 2xl:text-[24px] text-gray-1 placeholder:text-gray-3 focus:outline-main-1 font-bold"
                />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {roomsLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-base 2xl:text-lg text-gray-3">로딩 중...</p>
              </div>
            ) : filteredChatList.length > 0 ? (
              filteredChatList.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className={`mb-2 px-4 2xl:px-6 py-4 2xl:py-5 rounded-lg hover:bg-white-1 cursor-pointer transition-colors ${
                    selectedRoomId === chat.id ? 'bg-white-1' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 2xl:gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 2xl:w-14 h-12 2xl:h-14 rounded-full flex items-center justify-center">
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
            ) : searchQuery.trim() !== '' ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-base 2xl:text-lg text-gray-3">
                  검색 결과가 없습니다
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-base 2xl:text-lg text-gray-3">
                  채팅 목록이 없습니다
                </p>
              </div>
            )}
          </div>
        </div>

        {selectedRoomId && roomDetail ? (
          <div className="flex-1 flex flex-col bg-white">
            <div className="px-6 2xl:px-8 py-4 2xl:py-6 border-b border-gray-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 2xl:gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 2xl:w-14 h-12 2xl:h-14 rounded-full flex items-center justify-center">
                      <Profile width={40} height={40} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg 2xl:text-xl font-bold text-gray-1 mb-1">
                      {roomDetail.name}
                    </h2>
                    <div className="flex gap-2">
                      <span className="rounded-md px-3 py-0.5 text-white text-sm font-semibold bg-main-1">
                        {roomDetail.generation}기
                      </span>
                      <span className="rounded-md px-3 py-0.5 text-white text-sm font-semibold bg-main-2">
                        {roomDetail.major}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleExit}
                  className="bg-main-3 px-4 py-2 text-white font-semibold rounded-lg transition-colors w-[120px] h-[52px] text-[20px]"
                >
                  나가기
                </button>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-6 2xl:px-8 py-4 2xl:py-6"
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                if (target.scrollTop === 0 && hasMore && !loading) {
                  loadMoreMessages();
                }
              }}
            >
              {loading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-base 2xl:text-lg text-gray-3">
                    로딩 중...
                  </p>
                </div>
              ) : Array.isArray(messages) && messages.length > 0 ? (
                <div className="space-y-4">
                  {hasMore && (
                    <div className="flex justify-center">
                      <button
                        onClick={loadMoreMessages}
                        disabled={loading}
                        className="text-sm text-gray-3 hover:text-gray-1 disabled:opacity-50"
                      >
                        {loading ? '로딩 중...' : '이전 메시지 더보기'}
                      </button>
                    </div>
                  )}
                  {messages.map((message, index) => {
                    const isMyMessage = message.senderId === currentUserId;
                    const prevMessage = index > 0 ? messages[index - 1] : null;
                    const currentDate = formatMessageDate(message.createdAt);
                    const prevDate = prevMessage
                      ? formatMessageDate(prevMessage.createdAt)
                      : null;
                    const showDate = currentDate !== prevDate;

                    return (
                      <div key={message.messageId}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="text-sm text-gray-3">
                              {currentDate}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`flex flex-col max-w-[70%] ${
                              isMyMessage ? 'items-end' : 'items-start'
                            }`}
                          >
                            {!isMyMessage && (
                              <span className="text-sm font-semibold text-gray-1 mb-1">
                                {message.senderName}
                              </span>
                            )}
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                isMyMessage
                                  ? 'bg-main-1 text-white'
                                  : 'bg-white-1 text-gray-1'
                              }`}
                            >
                              <p className="text-base">{message.message}</p>
                            </div>
                            <span className="text-xs text-gray-3 mt-1">
                              {formatMessageTime(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-base 2xl:text-lg text-gray-3">
                    메시지가 없습니다
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 2xl:px-8 py-4 2xl:py-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="메시지 입력..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  className="w-full px-4 py-3 pr-20 border border-gray-2 rounded-full focus:outline-none focus:border-main-1"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-main-1 font-semibold hover:text-main-1-hover transition-colors bg-transparent border-none cursor-pointer"
                >
                  보내기
                </button>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </div>
      {isMentorRequestModalOpen && (
        <MentorRequestModal
          onClose={() => setIsMentorRequestModalOpen(false)}
          onAccept={handleAcceptMentor}
          onReject={handleRejectMentor}
          requests={mentorRequests}
        />
      )}
    </div>
  );
}
