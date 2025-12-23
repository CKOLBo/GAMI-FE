import Sidebar from '@/assets/components/Sidebar';
import Logo from '@/assets/svg/logo/Logo';
import Profile from '@/assets/svg/profile/Profile';
import SearchIcon from '@/assets/svg/main/SearchIcon';
import Divider from '@/assets/svg/Divider';
import MentorRequestModal from '@/assets/components/modal/MentorRequestModal';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { instance, baseURL } from '@/assets/shared/lib/axios';
import { getCookie } from '@/assets/shared/lib/cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_PATHS } from '@/constants/api';
import SockJS from 'sockjs-client';
import { Client, type IMessage } from '@stomp/stompjs';

type MajorType =
  | 'FRONTEND'
  | 'BACKEND'
  | 'IOS'
  | 'AI'
  | 'ANDROID'
  | 'DESIGN'
  | 'DEVOPS'
  | 'GAME_DEVELOP'
  | 'CLOUD_COMPUTING'
  | 'IT_NETWORK'
  | 'MOBILE_ROBOTICS'
  | 'CYBER_SECURITY'
  | 'FLUTTER';

type RoomStatusType = 'ACTIVE' | 'ENDED';

type MessageType = 'CHAT' | 'USER_LEFT' | 'ROOM_ENDED' | 'SYSTEM';

interface ChatItem {
  id: number;
  name: string;
  lastMessage: string;
  major: MajorType;
  generation: number;
}

interface ChatRoomDetail {
  roomId: number;
  name: string;
  major: MajorType;
  generation: number;
}

interface ChatMessage {
  messageId: number;
  message: string;
  createdAt: string;
  senderId: number;
  senderName: string;
  messageType?: MessageType;
}

interface ChatMessagesResponse {
  roomId: number;
  messages: ChatMessage[];
  nextCursor: number;
  hasMore: boolean;
  roomStatus: RoomStatusType;
  currentMemberLeft: boolean;
}

interface MentorRequest {
  applyId: number;
  menteeId?: number;
  name: string;
  applyStatus: string;
}


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
  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>([]);
  const currentUserId = user?.id ?? null;
  const stompClientRef = useRef<Client | null>(null);
  const roomSubscriptionRef = useRef<any>(null);
  const isSubscribedRef = useRef<boolean>(false);

  useEffect(() => {
    fetchChatRooms();
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const fetchMentorRequests = async () => {
    try {
      const response = await instance.get<MentorRequest[]>(
        API_PATHS.MENTORING_APPLY_RECEIVED
      );
      if (Array.isArray(response.data)) {
        setMentorRequests(response.data);
      }
    } catch (error) {
      console.error('받은 요청 목록 로드 실패:', error);
    }
  };

  useEffect(() => {
    if (isMentorRequestModalOpen) {
      fetchMentorRequests();
    }
  }, [isMentorRequestModalOpen]);

  const fetchChatRooms = async () => {
    setRoomsLoading(true);
    try {
      const response = await instance.get<ChatItem[]>('/api/chat/rooms');
      if (Array.isArray(response.data)) {
        setChatList(response.data);
      }
    } catch (error) {
      console.error('채팅방 목록 로드 실패:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert('인증이 필요합니다. 다시 로그인해주세요.');
      }
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

  const connectWebSocket = () => {
    const token = getCookie('accessToken');
    if (!token) {
      console.warn('토큰이 없어 WebSocket 연결을 건너뜁니다.');
      return;
    }

    const backendUrl = import.meta.env.DEV
      ? 'https://port-0-gami-server-mj0rdvda8d11523e.sel3.cloudtype.app'
      : baseURL;
    const wsUrl = `${backendUrl}/ws`;
    const socket = new SockJS(wsUrl, null, {
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
    });
    const client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectionTimeout: 10000,
      logRawCommunication: true,
      debug: (str) => {
        console.log('STOMP:', str);
      },
      onDisconnect: () => {
        console.log('STOMP 연결 해제됨');
        isSubscribedRef.current = false;
      },
      onConnect: (frame) => {
        console.log('✅ WebSocket 연결 성공', frame);
        
        if (selectedRoomId) {
          setTimeout(() => {
            subscribeToRoom(selectedRoomId);
          }, 100);
        }
      },
      onWebSocketError: (event) => {
        console.error('WebSocket 오류:', event);
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 오류:', frame);
        const errorMessage = frame.headers['message'] || frame.headers['error'] || '알 수 없는 오류';
        console.error('오류 메시지:', errorMessage);
        
        if (errorMessage.includes('Failed to send message')) {
          console.warn('서버 연결 문제가 발생했습니다.');
          isSubscribedRef.current = false;
          
          if (selectedRoomId && stompClientRef.current) {
            setTimeout(() => {
              if (stompClientRef.current?.connected) {
                console.log('구독 재시도 중...');
                subscribeToRoom(selectedRoomId);
              }
            }, 1000);
          }
        }
      },
      onWebSocketClose: () => {
        console.log('WebSocket 연결 종료');
        isSubscribedRef.current = false;
        
        if (selectedRoomId) {
          setTimeout(() => {
            console.log('WebSocket 재연결 시도...');
            connectWebSocket();
          }, 2000);
        }
      },
    });

    client.activate();
    stompClientRef.current = client;
  };

  const disconnectWebSocket = () => {
    if (roomSubscriptionRef.current) {
      try {
        roomSubscriptionRef.current.unsubscribe();
      } catch (e) {
        console.warn('구독 해제 오류:', e);
      }
      roomSubscriptionRef.current = null;
    }

    if (stompClientRef.current) {
      try {
        stompClientRef.current.deactivate();
      } catch (e) {
        console.warn('WebSocket 연결 해제 오류:', e);
      }
      stompClientRef.current = null;
    }
  };

  const subscribeToRoom = (roomId: number, retryCount = 0) => {
    if (!stompClientRef.current) {
      console.warn('WebSocket 클라이언트가 없습니다.');
      if (retryCount < 5) {
        setTimeout(() => subscribeToRoom(roomId, retryCount + 1), 500);
      }
      return;
    }

    if (!stompClientRef.current.connected) {
      console.warn('WebSocket이 연결되지 않았습니다. 재시도 중...');
      if (retryCount < 5) {
        setTimeout(() => subscribeToRoom(roomId, retryCount + 1), 500);
      }
      return;
    }

    if (roomSubscriptionRef.current) {
      try {
        roomSubscriptionRef.current.unsubscribe();
      } catch (e) {
        console.warn('이전 구독 해제 오류:', e);
      }
      roomSubscriptionRef.current = null;
    }

    isSubscribedRef.current = false;

    const topic = `/topic/room/${roomId}`;
    console.log('🔔 구독 시도:', topic);

    try {
      roomSubscriptionRef.current = stompClientRef.current.subscribe(
        topic,
        (message: IMessage) => {
          try {
            const msg = JSON.parse(message.body) as ChatMessage;
            console.log('📨 메시지 수신:', msg);
            setMessages((prev) => [...prev, msg]);
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } catch (e) {
            console.error('메시지 파싱 오류:', e);
          }
        }
      );

      isSubscribedRef.current = true;
      console.log('✅ 구독 완료:', topic, '구독 ID:', roomSubscriptionRef.current?.id);
    } catch (e) {
      console.error('구독 실패:', e);
      isSubscribedRef.current = false;
    }
  };

  const handleChatClick = async (roomId: number) => {
    setSelectedRoomId(roomId);
    setLoading(true);
    setNextCursor(null);
    setHasMore(false);

    try {
      const [roomResponse, messagesResponse] = await Promise.all([
        instance.get<ChatRoomDetail>(`/api/chat/rooms/${roomId}`),
        instance.get<ChatMessagesResponse>(`/api/chat/rooms/${roomId}/messages`),
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

      subscribeToRoom(roomId);
    } catch (error) {
      console.error('채팅방 정보 로드 실패:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('인증이 필요합니다. 다시 로그인해주세요.');
        } else if (error.response?.status === 404) {
          alert('채팅방을 찾을 수 없습니다.');
        }
      }
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
        `/api/chat/rooms/${selectedRoomId}/messages`,
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
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('인증이 필요합니다. 다시 로그인해주세요.');
        } else if (error.response?.status === 404) {
          alert('채팅방을 찾을 수 없습니다.');
        }
      }
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

  const handleSendMessage = () => {
    const message = messageInput.trim();
    if (!message || !selectedRoomId) {
      return;
    }

    if (!stompClientRef.current) {
      alert('WebSocket이 연결되지 않았습니다.');
      return;
    }

    if (!stompClientRef.current.connected) {
      alert('WebSocket이 연결되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (!isSubscribedRef.current || !roomSubscriptionRef.current) {
      console.warn('구독 상태 확인:', {
        isSubscribed: isSubscribedRef.current,
        subscription: roomSubscriptionRef.current ? '있음' : '없음'
      });
      
      if (selectedRoomId) {
        console.log('구독 재시도 중...');
        subscribeToRoom(selectedRoomId);
      }
      
      alert('채팅방 구독이 완료되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const token = getCookie('accessToken');
    if (!token) {
      alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    const destination = `/app/rooms/${selectedRoomId}/send`;
    const payload = JSON.stringify({
      message: message,
    });

    console.log('📤 메시지 전송:', { 
      destination, 
      message, 
      token: token ? '있음' : '없음',
      subscribed: isSubscribedRef.current,
      subscriptionId: roomSubscriptionRef.current?.id
    });

    try {
      if (!stompClientRef.current.connected) {
        alert('WebSocket 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      stompClientRef.current.publish({
        destination,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
        skipContentLengthHeader: true,
      });

      console.log('✅ 메시지 전송 완료');
      setMessageInput('');
    } catch (error) {
      console.error('❌ 메시지 전송 오류:', error);
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleExit = async () => {
    if (!selectedRoomId) return;

    if (roomSubscriptionRef.current) {
      try {
        roomSubscriptionRef.current.unsubscribe();
      } catch (e) {
        console.warn('구독 해제 오류:', e);
      }
      roomSubscriptionRef.current = null;
    }

    isSubscribedRef.current = false;

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
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('인증이 필요합니다. 다시 로그인해주세요.');
        } else if (error.response?.status === 404) {
          alert('채팅방을 찾을 수 없습니다.');
        } else {
          alert('채팅방 나가기에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        alert('채팅방 나가기에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleAcceptMentor = async (applyId: number) => {
    try {
      await instance.patch(API_PATHS.MENTORING_APPLY_UPDATE(applyId), {
        applyStatus: 'ACCEPTED',
      });
      await fetchMentorRequests();
    } catch (error) {
      console.error('멘토 신청 수락 실패:', error);
    }
  };

  const handleRejectMentor = async (applyId: number) => {
    try {
      await instance.patch(API_PATHS.MENTORING_APPLY_UPDATE(applyId), {
        applyStatus: 'REJECTED',
      });
      await fetchMentorRequests();
    } catch (error) {
      console.error('멘토 신청 거절 실패:', error);
    }
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
