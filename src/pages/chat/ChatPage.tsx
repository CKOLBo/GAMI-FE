import Sidebar from '@/assets/components/Sidebar';
import Logo from '@/assets/svg/logo/Logo';
import Profile from '@/assets/svg/profile/Profile';
import SearchIcon from '@/assets/svg/main/SearchIcon';
import Divider from '@/assets/svg/Divider';
import BellIcon from '@/assets/svg/common/BellIcon';
import MentorRequestModal from '@/assets/components/modal/MentorRequestModal';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { instance, baseURL } from '@/assets/shared/lib/axios';
import { getCookie } from '@/assets/shared/lib/cookie';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { API_PATHS } from '@/constants/api';
import SockJS from 'sockjs-client';
import { Client, type IMessage, type IFrame } from '@stomp/stompjs';
import { toast } from 'react-toastify';

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

interface NotificationMessage {
  type:
    | 'MENTORING_REQUEST'
    | 'MENTORING_ACCEPTED'
    | 'MENTORING_REJECTED'
    | 'CHAT_MESSAGE';
  senderName?: string;
  message?: string;
  applyId?: number;
}

interface Subscription {
  id: string;
  unsubscribe: () => void;
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
  const isLoadingMoreRef = useRef<boolean>(false);
  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>([]);
  const currentUserId = user?.id ?? null;

  const actualUserId = useMemo(() => {
    if (currentUserId) return currentUserId;
    const token = getCookie('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.userId || payload.id || null;
      } catch {
        return null;
      }
    }
    return null;
  }, [currentUserId]);

  const stompClientRef = useRef<Client | null>(null);
  const roomSubscriptionRef = useRef<Subscription | null>(null);
  const notificationSubscriptionRef = useRef<Subscription | null>(null);
  const isSubscribedRef = useRef<boolean>(false);
  const isConnectingRef = useRef<boolean>(false);

  useEffect(() => {
    fetchChatRooms();
    connectWebSocket();
    fetchMentorRequests();

    return () => {
      disconnectWebSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const roomIdParam = searchParams.get('roomId');
    if (roomIdParam && chatList.length > 0) {
      const roomId = Number(roomIdParam);
      if (!isNaN(roomId)) {
        if (
          roomId !== selectedRoomId ||
          (roomId === selectedRoomId && !roomDetail)
        ) {
          handleChatClick(roomId);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatList.length, searchParams]);

  useEffect(() => {
    if (
      !loading &&
      messages.length > 0 &&
      messagesContainerRef.current &&
      !isLoadingMoreRef.current
    ) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
    }
  }, [messages, loading]);

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
        setChatList(response.data);
      }
    } catch (error) {
      console.error('채팅방 목록 로드 실패:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('인증이 필요합니다. 다시 로그인해주세요.');
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
      return;
    }

    if (isConnectingRef.current) {
      return;
    }

    if (stompClientRef.current) {
      if (stompClientRef.current.connected) {
        return;
      }

      if (stompClientRef.current.active) {
        return;
      }

      try {
        if (roomSubscriptionRef.current) {
          try {
            roomSubscriptionRef.current.unsubscribe();
          } catch {
            // 구독 해제 실패 무시
          }
          roomSubscriptionRef.current = null;
        }
        stompClientRef.current.deactivate();
      } catch {
        // 연결 해제 실패 무시
      }
      stompClientRef.current = null;
    }

    isConnectingRef.current = true;

    const backendUrl = baseURL;
    const wsUrl = `${backendUrl}/ws`;

    let connectionTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const socket = new SockJS(wsUrl, null, {
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
    });

    socket.onerror = (error: Event) => {
      console.error('SockJS 오류:', error);
      isConnectingRef.current = false;
      if (connectionTimeoutId) {
        clearTimeout(connectionTimeoutId);
      }
    };

    socket.onclose = () => {
      isConnectingRef.current = false;
      if (connectionTimeoutId) {
        clearTimeout(connectionTimeoutId);
      }
    };

    const client = new Client({
      webSocketFactory: () => socket as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 0,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectionTimeout: 10000,
      logRawCommunication: false,
      beforeConnect: () => {
        if (!isConnectingRef.current || stompClientRef.current !== client) {
          try {
            client.deactivate();
          } catch {
            // 연결 해제 실패 무시
          }
          return;
        }
      },
      onDisconnect: () => {
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

        subscribeToNotifications();

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
        console.error('STOMP 오류:', frame);
        isConnectingRef.current = false;
        const errorMessage =
          frame.headers['message'] ||
          frame.headers['error'] ||
          '알 수 없는 오류';

        if (errorMessage.includes('Failed to send message')) {
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
        isConnectingRef.current = false;
        try {
          client.deactivate();
        } catch {
          // 연결 해제 실패 무시
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
      } catch {
        // 구독 해제 실패 무시
      }
      roomSubscriptionRef.current = null;
    }

    if (notificationSubscriptionRef.current) {
      try {
        notificationSubscriptionRef.current.unsubscribe();
      } catch {
        // 구독 해제 실패 무시
      }
      notificationSubscriptionRef.current = null;
    }

    isSubscribedRef.current = false;
    isConnectingRef.current = false;

    if (stompClientRef.current) {
      try {
        if (stompClientRef.current.connected || stompClientRef.current.active) {
          stompClientRef.current.deactivate();
        }
      } catch {
        // 연결 해제 실패 무시
      }
      stompClientRef.current = null;
    }
  };

  const subscribeToNotifications = () => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      return;
    }

    if (notificationSubscriptionRef.current) {
      try {
        notificationSubscriptionRef.current.unsubscribe();
      } catch {
        // 구독 해제 실패 무시
      }
      notificationSubscriptionRef.current = null;
    }

    const notificationTopic = '/user/queue/notifications';

    try {
      notificationSubscriptionRef.current = stompClientRef.current.subscribe(
        notificationTopic,
        (message: IMessage) => {
          try {
            const notification = JSON.parse(
              message.body
            ) as NotificationMessage;

            if (
              notification.type === 'MENTORING_REQUEST' &&
              notification.senderName
            ) {
              toast.info(`${notification.senderName}님한테 요청이 왔어요`);
              fetchMentorRequests();
            }
          } catch (e) {
            console.error('알림 파싱 오류:', e);
          }
        }
      );
    } catch (e) {
      console.error('알림 구독 실패:', e);
    }
  };

  const subscribeToRoom = (roomId: number, retryCount = 0) => {
    if (!stompClientRef.current) {
      if (retryCount < 5) {
        setTimeout(() => subscribeToRoom(roomId, retryCount + 1), 500);
      }
      return;
    }

    if (!stompClientRef.current.connected) {
      if (retryCount < 5) {
        setTimeout(() => subscribeToRoom(roomId, retryCount + 1), 500);
      }
      return;
    }

    if (roomSubscriptionRef.current) {
      try {
        roomSubscriptionRef.current.unsubscribe();
      } catch {
        // 구독 해제 실패 무시
      }
      roomSubscriptionRef.current = null;
    }

    isSubscribedRef.current = false;

    const topic = `/topic/room/${roomId}`;

    try {
      roomSubscriptionRef.current = stompClientRef.current.subscribe(
        topic,
        (message: IMessage) => {
          try {
            const msg = JSON.parse(message.body) as ChatMessage;
            setMessages((prev) => [...prev, msg]);
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
    } catch (e) {
      console.error('구독 실패:', e);
      isSubscribedRef.current = false;
    }
  };

  const handleChatClick = async (roomId: number) => {
    setSelectedRoomId(roomId);
    const currentRoomId = searchParams.get('roomId');
    if (currentRoomId !== roomId.toString()) {
      setSearchParams({ roomId: roomId.toString() });
    }
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

      subscribeToRoom(roomId);
    } catch (error) {
      console.error('채팅방 정보 로드 실패:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401) {
          toast.error('인증이 필요합니다. 다시 로그인해주세요.');
        } else if (status === 403) {
          const token = getCookie('accessToken');
          let tokenExpired = false;
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const exp = payload.exp * 1000;
              tokenExpired = Date.now() >= exp;
            } catch {
              // 토큰 파싱 실패 무시
            }
          }

          const toastMessage = tokenExpired
            ? '토큰이 만료되었습니다. 다시 로그인해주세요.'
            : '이 채팅방의 멤버가 아닙니다. 채팅방에 참여한 후 다시 시도해주세요.';

          toast.error(toastMessage);

          setSelectedRoomId(null);
          setRoomDetail(null);
          setMessages([]);
          setSearchParams({});
        } else if (status === 404) {
          toast.error('채팅방을 찾을 수 없습니다.');
        } else {
          toast.error(
            `채팅방 정보를 불러오는데 실패했습니다. (${status || '알 수 없는 오류'})`
          );
        }
      }
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!selectedRoomId || !nextCursor || !hasMore || loading) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    const previousScrollHeight = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    isLoadingMoreRef.current = true;
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

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              const heightDifference = newScrollHeight - previousScrollHeight;
              if (heightDifference > 0) {
                container.scrollTop = previousScrollTop + heightDifference;
              }
            }
            isLoadingMoreRef.current = false;
            setLoading(false);
          });
        });
      } else {
        isLoadingMoreRef.current = false;
        setLoading(false);
      }
    } catch (error) {
      console.error('메시지 추가 로드 실패:', error);
      isLoadingMoreRef.current = false;
      setLoading(false);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          toast.error('인증이 필요합니다. 다시 로그인해주세요.');
        } else if (status === 403) {
          toast.error('이 채팅방에 접근할 권한이 없습니다.');
        } else if (status === 404) {
          toast.error('채팅방을 찾을 수 없습니다.');
        }
      }
    }
  };

  const formatMessageDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const formatMessageTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, []);

  const handleSendMessage = () => {
    const message = messageInput.trim();
    if (!message || !selectedRoomId) {
      return;
    }

    if (!stompClientRef.current) {
      toast.error('WebSocket이 연결되지 않았습니다.');
      return;
    }

    if (!stompClientRef.current.connected) {
      toast.error(
        'WebSocket이 연결되지 않았습니다. 잠시 후 다시 시도해주세요.'
      );
      return;
    }

    if (!isSubscribedRef.current || !roomSubscriptionRef.current) {
      if (selectedRoomId) {
        subscribeToRoom(selectedRoomId);
      }

      toast.error(
        '채팅방 구독이 완료되지 않았습니다. 잠시 후 다시 시도해주세요.'
      );
      return;
    }

    const token = getCookie('accessToken');
    if (!token) {
      toast.error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    const payload = JSON.stringify({
      message: message,
    });

    try {
      if (!stompClientRef.current.connected) {
        toast.error(
          'WebSocket 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.'
        );
        return;
      }

      stompClientRef.current.publish({
        destination: `/app/rooms/${selectedRoomId}/send`,
        headers: {},
        body: payload,
      });

      setMessageInput('');
      if (selectedRoomId) {
        moveChatToTop(selectedRoomId);
      }
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      toast.error('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleExit = async () => {
    if (!selectedRoomId) return;

    if (roomSubscriptionRef.current) {
      try {
        roomSubscriptionRef.current.unsubscribe();
      } catch {
        // 구독 해제 실패 무시
      }
      roomSubscriptionRef.current = null;
    }

    isSubscribedRef.current = false;

    try {
      await instance.delete(`/api/chat/rooms/${selectedRoomId}/leave`);
      const exitedRoomId = selectedRoomId;
      setSelectedRoomId(null);
      setRoomDetail(null);
      setMessages([]);
      setSearchParams({});
      setNextCursor(null);
      setHasMore(false);
      setChatList((prevList) =>
        prevList.filter((chat) => chat.id !== exitedRoomId)
      );
      fetchChatRooms();
      toast.success('채팅방을 나갔습니다.');
    } catch (error) {
      console.error('채팅방 나가기 실패:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
        const errorData = error.response?.data;

        console.error('상세 에러 정보:', {
          status,
          statusText: error.response?.statusText,
          data: errorData,
          message: errorMessage,
          url: error.config?.url,
          method: error.config?.method,
        });

        if (status === 401) {
          toast.error(`인증이 필요합니다. 다시 로그인해주세요. (${status})`);
        } else if (status === 404) {
          toast.error(`채팅방을 찾을 수 없습니다. (${status})`);
          setSelectedRoomId(null);
          setRoomDetail(null);
          setMessages([]);
          setSearchParams({});
          fetchChatRooms();
        } else if (status === 409) {
          toast.info(errorMessage || '이미 종료된 채팅방입니다.');
          setSelectedRoomId(null);
          setRoomDetail(null);
          setMessages([]);
          setSearchParams({});
          setNextCursor(null);
          setHasMore(false);
          fetchChatRooms();
        } else if (status) {
          const detailMessage = errorMessage ? `: ${errorMessage}` : '';
          toast.error(
            `채팅방 나가기에 실패했습니다. (${status})${detailMessage}`
          );
        } else if (error.request) {
          toast.error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
        } else {
          toast.error(
            `채팅방 나가기에 실패했습니다. ${errorMessage || error.message}`
          );
        }
      } else {
        const errorMsg = error instanceof Error ? error.message : String(error);
        toast.error(`채팅방 나가기에 실패했습니다: ${errorMsg}`);
      }
    }
  };

  const handleAcceptMentor = async (applyId: number) => {
    try {
      const request = mentorRequests.find((req) => req.applyId === applyId);
      const requesterName = request?.name || '상대방';

      await instance.patch(API_PATHS.MENTORING_APPLY_UPDATE(applyId), {
        applyStatus: 'ACCEPTED',
      });

      toast.success(`${requesterName}님의 멘토링을 수락했어요`);
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

  const renderedMessages = useMemo(() => {
    if (!Array.isArray(messages) || messages.length === 0) {
      return null;
    }

    return messages.map((message, index) => {
      const senderId =
        message.senderId != null ? Number(message.senderId) : null;
      const myUserId = actualUserId != null ? Number(actualUserId) : null;
      const isMyMessage =
        senderId !== null && myUserId !== null && senderId === myUserId;

      const prevMessage = index > 0 ? messages[index - 1] : null;
      const nextMessage =
        index < messages.length - 1 ? messages[index + 1] : null;
      const currentDate = formatMessageDate(message.createdAt);
      const prevDate = prevMessage
        ? formatMessageDate(prevMessage.createdAt)
        : null;
      const showDate = currentDate !== prevDate;

      const prevSenderId = prevMessage
        ? prevMessage.senderId != null
          ? Number(prevMessage.senderId)
          : null
        : null;
      const prevIsMyMessage =
        prevSenderId !== null && myUserId !== null && prevSenderId === myUserId;

      const showSenderName = !isMyMessage && (!prevMessage || prevIsMyMessage);

      const getTimeKey = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getHours()}:${date.getMinutes()}`;
      };

      const currentTime = getTimeKey(message.createdAt);
      const nextTime = nextMessage ? getTimeKey(nextMessage.createdAt) : null;
      const nextSenderId = nextMessage
        ? nextMessage.senderId != null
          ? Number(nextMessage.senderId)
          : null
        : null;
      const isNextSameSender =
        nextMessage &&
        senderId !== null &&
        nextSenderId !== null &&
        senderId === nextSenderId;
      const isNextSameTime = nextTime === currentTime;

      const showTime = !(isNextSameSender && isNextSameTime);

      return (
        <div key={message.messageId} className="mb-1">
          {showDate && (
            <div className="flex justify-center my-4">
              <span className="text-sm text-gray-3">{currentDate}</span>
            </div>
          )}
          <div
            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex flex-col ${
                isMyMessage ? 'items-end' : 'items-start'
              }`}
            >
              {showSenderName && (
                <span className="text-sm font-semibold text-gray-1 mb-1">
                  {message.senderName}
                </span>
              )}
              <div className="flex items-end gap-2">
                {isMyMessage && showTime && (
                  <span className="text-xs text-gray-3 whitespace-nowrap flex-shrink-0">
                    {formatMessageTime(message.createdAt)}
                  </span>
                )}
                <div
                  className={`px-4 py-2 rounded-[20px] break-words break-all max-w-[480px] ${
                    isMyMessage
                      ? 'bg-main-1 text-white'
                      : 'bg-white-1 text-gray-1'
                  }`}
                >
                  <p className="text-base whitespace-pre-wrap break-words break-all m-0">
                    {message.message}
                  </p>
                </div>
                {!isMyMessage && showTime && (
                  <span className="text-xs text-gray-3 whitespace-nowrap flex-shrink-0">
                    {formatMessageTime(message.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
  }, [messages, actualUserId, formatMessageDate, formatMessageTime]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-45 2xl:ml-55 flex h-screen overflow-hidden">
        <div className="w-96 2xl:w-[480px] border-r border-gray-2 bg-white flex flex-col h-full overflow-hidden">
          <div className="px-7 2xl:px-15 pt-7 2xl:pt-15 pb-4 2xl:pb-5">
            <div className="flex items-center justify-between mb-4 2xl:mb-5">
              <h1 className="flex items-center gap-4 text-[40px] font-bold">
                <span className="text-3xl 2xl:text-[40px] text-gray-1 font-bold">
                  채팅
                </span>
                <Divider className="flex-shrink-0" />
                <Link
                  to="/chat-apply"
                  className="text-3xl 2xl:text-[40px] text-gray-2 font-bold hover:text-gray-1 transition-colors cursor-pointer"
                >
                  요청
                </Link>
              </h1>
              <button
                onClick={() => setIsMentorRequestModalOpen(true)}
                className="relative p-1 cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent"
                type="button"
              >
                <BellIcon className="text-gray-3 pointer-events-none" />
                {mentorRequests.filter((req) => req.applyStatus === 'PENDING')
                  .length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
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
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto min-h-0 relative"
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                if (target.scrollTop === 0 && hasMore && !loading) {
                  loadMoreMessages();
                }
              }}
            >
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

              <div className="px-6 2xl:px-8 py-4 2xl:py-6">
                {loading && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-base 2xl:text-lg text-gray-3">
                      로딩 중...
                    </p>
                  </div>
                ) : renderedMessages ? (
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
                    {renderedMessages}
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

            <div className="flex-shrink-0 px-6 2xl:px-8 py-4 2xl:py-6 bg-transparent">
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
                  className="w-full px-4 py-3 pr-20 border border-gray-2 rounded-full bg-white focus:outline-none focus:border-main-1"
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
