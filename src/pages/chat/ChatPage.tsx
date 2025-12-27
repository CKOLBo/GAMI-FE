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
import { Link, useSearchParams } from 'react-router-dom';
import { API_PATHS } from '@/constants/api';
import SockJS from 'sockjs-client';
import { Client, type IMessage, type IFrame } from '@stomp/stompjs';

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
  lastMessageTime?: string;
  updatedAt?: string;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(() => {
    const roomIdParam = searchParams.get('roomId');
    return roomIdParam ? Number(roomIdParam) : null;
  });
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
  
  // 토큰에서 사용자 ID 추출 (currentUserId가 null일 때 사용)
  const actualUserId = useMemo(() => {
    if (currentUserId) return currentUserId;
    const token = getCookie('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.userId || payload.id || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [currentUserId]);
  
  const stompClientRef = useRef<Client | null>(null);
  const roomSubscriptionRef = useRef<any>(null);
  const isSubscribedRef = useRef<boolean>(false);
  const isConnectingRef = useRef<boolean>(false);

  useEffect(() => {
    fetchChatRooms();
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    const roomIdParam = searchParams.get('roomId');
    if (roomIdParam && chatList.length > 0) {
      const roomId = Number(roomIdParam);
      if (!isNaN(roomId)) {
        if (roomId !== selectedRoomId || (roomId === selectedRoomId && !roomDetail)) {
          handleChatClick(roomId);
        }
      }
    }
  }, [chatList.length, searchParams]);

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

  // 채팅방을 목록 상단으로 이동 (메시지 전송/수신 시)
  const moveChatToTop = (roomId: number) => {
    setChatList((prevList) => {
      const roomIndex = prevList.findIndex((chat) => chat.id === roomId);
      if (roomIndex === -1 || roomIndex === 0) {
        return prevList;
      }
      const newList = [...prevList];
      const [room] = newList.splice(roomIndex, 1);
      newList.unshift(room);
      return newList;
    });
  };

  const fetchChatRooms = async () => {
    setRoomsLoading(true);
    try {
      const response = await instance.get<ChatItem[]>('/api/chat/rooms');
      if (Array.isArray(response.data)) {
        // 백엔드가 보내는 순서대로 유지 (정렬하지 않음)
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

    if (isConnectingRef.current) {
      console.log('WebSocket 연결이 이미 진행 중입니다.');
      return;
    }

    if (stompClientRef.current) {
      if (stompClientRef.current.connected) {
        console.log('WebSocket이 이미 연결되어 있습니다.');
        return;
      }
      
      if (stompClientRef.current.active) {
        console.log('WebSocket 클라이언트가 이미 활성화되어 있습니다.');
        return;
      }

      try {
        if (roomSubscriptionRef.current) {
          try {
            roomSubscriptionRef.current.unsubscribe();
          } catch (e) {
            console.warn('구독 해제 오류:', e);
          }
          roomSubscriptionRef.current = null;
        }
        stompClientRef.current.deactivate();
      } catch (e) {
        console.warn('기존 클라이언트 정리 중 오류:', e);
      }
      stompClientRef.current = null;
    }

    isConnectingRef.current = true;

    const backendUrl = import.meta.env.DEV
      ? 'https://port-0-gami-server-mj0rdvda8d11523e.sel3.cloudtype.app'
      : baseURL;
    const wsUrl = `${backendUrl}/ws`;
    
    let connectionTimeoutId: ReturnType<typeof setTimeout> | null = null;
    
    const socket = new SockJS(wsUrl, null, {
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
    });
    
    const isDev = import.meta.env.DEV;
    
    socket.onopen = () => {
      // 성공적인 연결은 로그 없이 처리
    };
    
    socket.onerror = (error: Event) => {
      console.error('❌ SockJS 오류:', error);
      isConnectingRef.current = false;
      if (connectionTimeoutId) {
        clearTimeout(connectionTimeoutId);
      }
    };
    
    socket.onclose = (event: CloseEvent) => {
      if (isDev) {
        console.log('🔌 SockJS 연결 종료:', event.code, event.reason);
      }
      isConnectingRef.current = false;
      if (connectionTimeoutId) {
        clearTimeout(connectionTimeoutId);
      }
    };
    
    const client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 0,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectionTimeout: 10000,
      logRawCommunication: false,
      debug: isDev
        ? (str: string) => {
            // 성공적인 연결 과정 로그는 숨김
            const successMessages = [
              'Opening Web Socket',
              'Web Socket Opened',
              '>>> CONNECT',
              '<<< CONNECTED',
              'connected to server',
              'Client has been marked inactive'
            ];
            
            const isSuccessMessage = successMessages.some(msg => str.includes(msg));
            
            // 오류나 경고만 표시
            if (!isSuccessMessage && (str.includes('error') || str.includes('Error') || str.includes('ERROR') || str.includes('failed') || str.includes('Failed'))) {
              console.error('STOMP:', str);
            } else if (!isSuccessMessage && (str.includes('warn') || str.includes('Warn') || str.includes('WARNING'))) {
              console.warn('STOMP:', str);
            }
          }
        : undefined,
      beforeConnect: () => {
        if (!isConnectingRef.current || stompClientRef.current !== client) {
          if (isDev) {
            console.warn('⚠️ 연결이 이미 진행 중이거나 다른 클라이언트가 존재합니다.');
          }
          try {
            client.deactivate();
          } catch (e) {
            if (isDev) {
              console.warn('클라이언트 비활성화 오류:', e);
            }
          }
          return;
        }
      },
      onDisconnect: () => {
        if (isDev) {
          console.log('STOMP 연결 해제됨');
        }
        isSubscribedRef.current = false;
        isConnectingRef.current = false;
        if (connectionTimeoutId) {
          clearTimeout(connectionTimeoutId);
        }
      },
      onConnect: () => {
        isConnectingRef.current = false;
        if (connectionTimeoutId) {
          clearTimeout(connectionTimeoutId);
        }
        
        if (selectedRoomId) {
          setTimeout(() => {
            subscribeToRoom(selectedRoomId);
          }, 100);
        }
      },
      onWebSocketError: (event: Event) => {
        console.error('WebSocket 오류:', event);
        isConnectingRef.current = false;
      },
      onStompError: (frame: IFrame) => {
        console.error('❌ STOMP 오류:', frame);
        isConnectingRef.current = false;
        const errorMessage = frame.headers['message'] || frame.headers['error'] || '알 수 없는 오류';
        console.error('오류 메시지:', errorMessage);
        
        if (errorMessage.includes('Failed to send message')) {
          if (isDev) {
            console.warn('서버 연결 문제가 발생했습니다.');
          }
          isSubscribedRef.current = false;
          
          if (selectedRoomId && stompClientRef.current) {
            setTimeout(() => {
              if (stompClientRef.current?.connected) {
                subscribeToRoom(selectedRoomId);
              }
            }, 1000);
          }
        }
      },
      onWebSocketClose: () => {
        if (isDev) {
          console.log('WebSocket 연결 종료');
        }
        isSubscribedRef.current = false;
        isConnectingRef.current = false;
        
        if (selectedRoomId && !stompClientRef.current?.active) {
          setTimeout(() => {
            connectWebSocket();
          }, 2000);
        }
      },
    });

    connectionTimeoutId = setTimeout(() => {
      if (!client.connected && isConnectingRef.current) {
        console.warn('⚠️ WebSocket 연결 타임아웃 (10초)');
        isConnectingRef.current = false;
        try {
          client.deactivate();
        } catch (e) {
          if (isDev) {
            console.warn('타임아웃 후 클라이언트 비활성화 오류:', e);
          }
        }
      }
    }, 10000);

    stompClientRef.current = client;
    client.activate();
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

    isSubscribedRef.current = false;
    isConnectingRef.current = false;

    if (stompClientRef.current) {
      try {
        if (stompClientRef.current.connected || stompClientRef.current.active) {
          stompClientRef.current.deactivate();
        }
      } catch (e) {
        console.warn('WebSocket 연결 해제 오류:', e);
      }
      stompClientRef.current = null;
    }
  };

  const subscribeToRoom = (roomId: number, retryCount = 0) => {
    const isDev = import.meta.env.DEV;
    
    if (!stompClientRef.current) {
      if (isDev) {
        console.warn('WebSocket 클라이언트가 없습니다.');
      }
      if (retryCount < 5) {
        setTimeout(() => subscribeToRoom(roomId, retryCount + 1), 500);
      }
      return;
    }

    if (!stompClientRef.current.connected) {
      if (isDev) {
        console.warn('WebSocket이 연결되지 않았습니다. 재시도 중...');
      }
      if (retryCount < 5) {
        setTimeout(() => subscribeToRoom(roomId, retryCount + 1), 500);
      }
      return;
    }

    if (roomSubscriptionRef.current) {
      try {
        roomSubscriptionRef.current.unsubscribe();
      } catch (e) {
        if (isDev) {
          console.warn('이전 구독 해제 오류:', e);
        }
      }
      roomSubscriptionRef.current = null;
    }

    isSubscribedRef.current = false;

    const topic = `/topic/room/${roomId}`;
    if (isDev) {
      console.log('🔔 구독 시도:', topic);
    }

    try {
      roomSubscriptionRef.current = stompClientRef.current.subscribe(
        topic,
        (message: IMessage) => {
          try {
            const msg = JSON.parse(message.body) as ChatMessage;
            if (isDev) {
              console.log('📨 메시지 수신:', msg);
            }
            setMessages((prev) => [...prev, msg]);
            // 메시지 수신 시 해당 채팅방을 상단으로 이동
            moveChatToTop(roomId);
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } catch (e) {
            console.error('메시지 파싱 오류:', e);
          }
        }
      );

      isSubscribedRef.current = true;
      if (isDev) {
        console.log('✅ 구독 완료:', topic);
      }
    } catch (e) {
      console.error('구독 실패:', e);
      isSubscribedRef.current = false;
    }
  };

  const handleChatClick = async (roomId: number) => {
    setSelectedRoomId(roomId);
    // URL 업데이트 (이미 같은 roomId가 아니면)
    const currentRoomId = searchParams.get('roomId');
    if (currentRoomId !== roomId.toString()) {
      setSearchParams({ roomId: roomId.toString() });
    }
    setLoading(true);
    setNextCursor(null);
    setHasMore(false);

    const token = getCookie('accessToken');
    
    // 토큰에서 사용자 ID 추출 시도
    let userIdFromToken: number | null = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userIdFromToken = payload.sub || payload.userId || payload.id || null;
      } catch (e) {
        // 토큰 파싱 실패
      }
    }
    
    // 토큰 만료 시간 확인
    const checkTokenExpiry = (token: string) => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // JWT exp는 초 단위
        const now = Date.now();
        const isExpired = now >= exp;
        const timeUntilExpiry = exp - now;
        return {
          isExpired,
          expiresAt: new Date(exp),
          timeUntilExpiry: timeUntilExpiry > 0 ? Math.floor(timeUntilExpiry / 1000) : 0, // 초 단위
        };
      } catch (e) {
        return null;
      }
    };
    
    if (import.meta.env.DEV && token) {
      const tokenInfo = checkTokenExpiry(token);
      console.log('채팅방 접근 시도:', {
        roomId,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : '없음',
        tokenExpiry: tokenInfo ? {
          isExpired: tokenInfo.isExpired,
          expiresAt: tokenInfo.expiresAt.toLocaleString('ko-KR'),
          timeUntilExpiry: tokenInfo.isExpired ? '만료됨' : `${tokenInfo.timeUntilExpiry}초 남음`,
        } : '토큰 파싱 실패',
      });
      
      if (tokenInfo?.isExpired) {
        console.warn('⚠️ 토큰이 만료되었습니다!');
      }
    }

    try {
      if (import.meta.env.DEV) {
        const token = getCookie('accessToken');
        console.log('🔍 요청 전송 전:', {
          roomId,
          token: token ? `${token.substring(0, 20)}...` : '없음',
          url1: `/api/chat/${roomId}`,
          url2: `/api/chat/${roomId}/messages`,
        });
      }
      
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

      subscribeToRoom(roomId);
      
      if (import.meta.env.DEV) {
        // 메시지에서 상대방 아이디 찾기
        const otherUserId = messagesResponse.data?.messages?.find(
          (msg) => msg.senderId !== currentUserId
        )?.senderId || null;
        
        console.log('✅ 채팅방 멤버 확인: 맞음', {
          roomId,
          roomName: roomResponse.data?.name || '알 수 없음',
          myUserId: currentUserId || userIdFromToken,
          myUserInfo: user ? { id: user.id, email: user.email, name: user.name } : null,
          userIdFromToken: userIdFromToken,
          fullUserObject: user,
          otherUserId: otherUserId,
        });
      }
    } catch (error) {
      console.error('채팅방 정보 로드 실패:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;
        
        const authHeader = error.config?.headers?.Authorization || error.config?.headers?.authorization;
        const responseData = error.response?.data;
        const serverMessage = responseData?.message || responseData?.error || errorMessage;
        
        console.error('에러 상세:', {
          status,
          message: errorMessage,
          serverMessage,
          url: error.config?.url,
          hasAuthHeader: !!authHeader,
          authHeaderPreview: authHeader ? (typeof authHeader === 'string' ? `${authHeader.substring(0, 30)}...` : '있음') : '없음',
          responseData,
          fullHeaders: error.config?.headers,
        });
        
        if (status === 401) {
          alert('인증이 필요합니다. 다시 로그인해주세요.');
        } else if (status === 403) {
          // 토큰 만료 확인
          const token = getCookie('accessToken');
          let tokenExpired = false;
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const exp = payload.exp * 1000;
              tokenExpired = Date.now() >= exp;
            } catch (e) {
              // 토큰 파싱 실패
            }
          }
          
          const alertMessage = tokenExpired 
            ? '토큰이 만료되었습니다. 다시 로그인해주세요.'
            : `이 채팅방의 멤버가 아닙니다.\n채팅방에 참여한 후 다시 시도해주세요.`;
          
          if (import.meta.env.DEV) {
            // 채팅방 목록에서 상대방 정보 찾기 시도
            const chatRoom = chatList.find((room) => room.id === roomId);
            
            console.log('❌ 채팅방 멤버 확인: 아님', {
              roomId,
              myUserId: currentUserId || userIdFromToken,
              myUserInfo: user ? { id: user.id, email: user.email, name: user.name } : null,
              userIdFromToken: userIdFromToken,
              fullUserObject: user,
              otherUserId: chatRoom ? '채팅방 목록에서 확인 불가' : '알 수 없음',
              reason: tokenExpired ? '토큰 만료' : '멤버가 아님',
              tokenExpired,
            });
          }
          
          alert(alertMessage);
          
          // 채팅방 선택 해제
          setSelectedRoomId(null);
          setRoomDetail(null);
          setMessages([]);
          // URL에서 roomId 제거
          setSearchParams({});
          console.error('403 오류 상세:', {
            serverResponse: responseData,
            serverMessage,
            tokenExpired,
            possibleReasons: tokenExpired 
              ? ['토큰이 만료되었습니다 - 다시 로그인 필요']
              : [
                  '해당 채팅방의 멤버가 아닐 수 있습니다',
                  '서버 측 권한 체크 실패',
                  '토큰은 유효하지만 권한이 부족합니다'
                ]
          });
        } else if (status === 404) {
          alert('채팅방을 찾을 수 없습니다.');
        } else {
          alert(`채팅방 정보를 불러오는데 실패했습니다. (${status || '알 수 없는 오류'})`);
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
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          alert('인증이 필요합니다. 다시 로그인해주세요.');
        } else if (status === 403) {
          alert('이 채팅방에 접근할 권한이 없습니다.');
        } else if (status === 404) {
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
      if (import.meta.env.DEV) {
        console.warn('구독 상태 확인:', {
          isSubscribed: isSubscribedRef.current,
          subscription: roomSubscriptionRef.current ? '있음' : '없음'
        });
      }
      
      if (selectedRoomId) {
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

    if (import.meta.env.DEV) {
      console.log('📤 메시지 전송:', { 
        destination, 
        message, 
        token: token ? '있음' : '없음',
        subscribed: isSubscribedRef.current,
        subscriptionId: roomSubscriptionRef.current?.id
      });
    }

    try {
      if (!stompClientRef.current.connected) {
        alert('WebSocket 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      stompClientRef.current.publish({
        destination: `/app/rooms/${selectedRoomId}/send`,
        headers: {},
        body: payload,
      });

      setMessageInput('');
      // 메시지 전송 후 해당 채팅방을 상단으로 이동
      if (selectedRoomId) {
        moveChatToTop(selectedRoomId);
      }
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
      await instance.delete(`/api/chat/${selectedRoomId}/leave`);
      setSelectedRoomId(null);
      setRoomDetail(null);
      setMessages([]);
      // URL에서 roomId 제거
      setSearchParams({});
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-45 2xl:ml-55 flex h-screen overflow-hidden">
        {/* 왼쪽: 채팅방 목록 */}
        <div className="w-96 2xl:w-[480px] border-r border-gray-2 bg-white flex flex-col h-full overflow-hidden">
          {/* 채팅방 목록 헤더 (제목, 검색) */}
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

          {/* 채팅방 목록 */}
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

        {/* 오른쪽: 채팅방 내용 */}
        {selectedRoomId && roomDetail ? (
          <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
            {/* 메시지 스크롤 영역 */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto min-h-0"
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                if (target.scrollTop === 0 && hasMore && !loading) {
                  loadMoreMessages();
                }
              }}
            >
              {/* 채팅방 헤더 (이름, 전공, 나가기 버튼) - sticky로 고정 */}
              <div className="sticky top-0 z-10 bg-white px-6 2xl:px-8 py-4 2xl:py-6 border-b border-gray-2">
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
                    className="bg-white border border-main-3 px-4 py-2 text-main-3 font-semibold rounded-lg transition-colors w-[120px] h-[52px] text-[20px] hover:bg-red-50"
                  >
                    나가기
                  </button>
                </div>
              </div>

              {/* 메시지 목록 */}
              <div className="px-6 2xl:px-8 py-4 2xl:py-6">
              {loading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-base 2xl:text-lg text-gray-3">
                    로딩 중...
                  </p>
                </div>
              ) : Array.isArray(messages) && messages.length > 0 ? (
                <div className="space-y-1">
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
                    // 타입 변환하여 비교 (null 체크 포함)
                    const senderId = message.senderId != null ? Number(message.senderId) : null;
                    const myUserId = actualUserId != null ? Number(actualUserId) : null;
                    const isMyMessage = senderId !== null && myUserId !== null && senderId === myUserId;
                    
                    if (import.meta.env.DEV && index === 0) {
                      console.log('🔍 메시지 판단:', {
                        messageSenderId: message.senderId,
                        senderId,
                        senderIdType: typeof message.senderId,
                        actualUserId,
                        myUserId,
                        myUserIdType: typeof actualUserId,
                        isMyMessage,
                        currentUserId,
                        comparison: `${senderId} === ${myUserId}`,
                      });
                    }
                    
                    const prevMessage = index > 0 ? messages[index - 1] : null;
                    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
                    const currentDate = formatMessageDate(message.createdAt);
                    const prevDate = prevMessage
                      ? formatMessageDate(prevMessage.createdAt)
                      : null;
                    const showDate = currentDate !== prevDate;

                    // 시간 비교 함수 (같은 분 단위면 같은 시간으로 간주)
                    const getTimeKey = (dateString: string) => {
                      const date = new Date(dateString);
                      return `${date.getHours()}:${date.getMinutes()}`;
                    };

                    const currentTime = getTimeKey(message.createdAt);
                    const nextTime = nextMessage ? getTimeKey(nextMessage.createdAt) : null;
                    const nextSenderId = nextMessage ? (nextMessage.senderId != null ? Number(nextMessage.senderId) : null) : null;
                    const isNextSameSender = nextMessage && senderId !== null && nextSenderId !== null && senderId === nextSenderId;
                    const isNextSameTime = nextTime === currentTime;
                    
                    // 다음 메시지가 있고, 같은 발신자이고, 같은 시간이면 시간 숨김 (마지막 메시지만 시간 표시)
                    const showTime = !(isNextSameSender && isNextSameTime);

                    return (
                      <div key={message.messageId} className="mb-1">
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
                          <div className="flex items-end gap-2">
                            {isMyMessage && showTime && (
                              <span className="text-xs text-gray-3 whitespace-nowrap">
                                {formatMessageTime(message.createdAt)}
                              </span>
                            )}
                            <div
                              className={`px-4 py-2 rounded-full break-words ${
                                isMyMessage
                                  ? 'bg-main-1 text-white'
                                  : 'bg-white-1 text-gray-1'
                              }`}
                            >
                              <p className="text-base whitespace-normal break-words">{message.message}</p>
                            </div>
                            {!isMyMessage && showTime && (
                              <span className="text-xs text-gray-3 whitespace-nowrap">
                                {formatMessageTime(message.createdAt)}
                              </span>
                            )}
                          </div>
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
            </div>

            {/* 메시지 입력 영역 */}
            <div className="flex-shrink-0 px-6 2xl:px-8 py-4 2xl:py-6 border-t border-gray-2">
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
