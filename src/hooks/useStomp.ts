import { useRef, useCallback } from 'react';
import { Client, type IMessage, type IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getCookie } from '@/assets/shared/lib/cookie';
import { baseURL } from '@/assets/shared/lib/axios';

interface Subscription {
  id: string;
  unsubscribe: () => void;
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

interface UseStompOptions<TRoomMessage = unknown> {
  onNotification?: (notification: NotificationMessage) => void;
  enableRoomSubscription?: boolean;
  onRoomMessage?: (message: TRoomMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoReconnect?: boolean;
}

export function useStomp<TRoomMessage = unknown>(
  options: UseStompOptions<TRoomMessage> = {}
) {
  const {
    onNotification,
    enableRoomSubscription = false,
    onRoomMessage,
    onConnect,
    onDisconnect,
    autoReconnect = true,
  } = options;

  const stompClientRef = useRef<Client | null>(null);
  const notificationSubscriptionRef = useRef<Subscription | null>(null);
  const roomSubscriptionRef = useRef<Subscription | null>(null);
  const isConnectingRef = useRef<boolean>(false);
  const isSubscribedRef = useRef<boolean>(false);
  const connectionTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const currentRoomIdRef = useRef<number | null>(null);

  const subscribeToNotifications = useCallback(() => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      return;
    }

    if (notificationSubscriptionRef.current) {
      try {
        notificationSubscriptionRef.current.unsubscribe();
      } catch (e) {
        console.error('알림 구독 해제 실패:', e);
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
            if (onNotification) {
              onNotification(notification);
            }
          } catch (e) {
            console.error('알림 파싱 오류:', e);
          }
        }
      );
    } catch (e) {
      console.error('알림 구독 실패:', e);
    }
  }, [onNotification]);

  const subscribeToRoom = useCallback(
    (roomId: number, retryCount = 0) => {
      const attempt = (rId: number, rc = 0) => {
        if (!stompClientRef.current) {
          if (rc < 5) {
            setTimeout(() => attempt(rId, rc + 1), 500);
          }
          return;
        }

        if (!stompClientRef.current.connected) {
          if (rc < 5) {
            setTimeout(() => attempt(rId, rc + 1), 500);
          }
          return;
        }

        if (roomSubscriptionRef.current) {
          try {
            roomSubscriptionRef.current.unsubscribe();
          } catch (e) {
            console.error('방 구독 해제 실패:', e);
          }
          roomSubscriptionRef.current = null;
        }

        isSubscribedRef.current = false;
        currentRoomIdRef.current = rId;

        const topic = `/topic/room/${rId}`;

        try {
          roomSubscriptionRef.current = stompClientRef.current!.subscribe(
            topic,
            (message: IMessage) => {
              try {
                const msg = JSON.parse(message.body);
                if (onRoomMessage) {
                  onRoomMessage(msg);
                }
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

      attempt(roomId, retryCount);
    },
    [onRoomMessage]
  );

  const unsubscribeFromRoom = useCallback(() => {
    if (roomSubscriptionRef.current) {
      try {
        roomSubscriptionRef.current.unsubscribe();
      } catch {
        // 구독 해제 실패 무시
      }
      roomSubscriptionRef.current = null;
    }
    isSubscribedRef.current = false;
    currentRoomIdRef.current = null;
  }, []);

  const connectWebSocket = useCallback(() => {
    const attemptConnect = () => {
      const token = getCookie('accessToken');
      if (!token) {
        return;
      }

      if (isConnectingRef.current) {
        return;
      }

      if (stompClientRef.current) {
        if (stompClientRef.current.connected) {
          subscribeToNotifications();
          if (enableRoomSubscription && currentRoomIdRef.current) {
            setTimeout(() => {
              subscribeToRoom(currentRoomIdRef.current!);
            }, 100);
          }
          return;
        }

        if (stompClientRef.current.active) {
          return;
        }

        try {
          if (notificationSubscriptionRef.current) {
            try {
              notificationSubscriptionRef.current.unsubscribe();
            } catch {
              // 구독 해제 실패 무시
            }
            notificationSubscriptionRef.current = null;
          }
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
      const backendOriginRaw =
        baseURL && baseURL !== '' ? baseURL : window.location.origin;
      let backendOrigin = String(backendOriginRaw);

      if (backendOrigin.startsWith('ws:')) {
        backendOrigin = backendOrigin.replace(/^ws:/, 'http:');
      } else if (backendOrigin.startsWith('wss:')) {
        backendOrigin = backendOrigin.replace(/^wss:/, 'https:');
      }

      const sockjsUrl = backendOrigin.endsWith('/')
        ? backendOrigin + 'ws'
        : backendOrigin + '/ws';

      if (connectionTimeoutIdRef.current) {
        clearTimeout(connectionTimeoutIdRef.current);
        connectionTimeoutIdRef.current = null;
      }

      const client = new Client({
        // SockJS 인스턴스를 webSocketFactory에서 직접 생성해서 반환합니다.
        webSocketFactory: () => new SockJS(sockjsUrl),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        // 재접속 지연을 두어 반복 연결 시도를 완화합니다.
        reconnectDelay: 2000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectionTimeout: 10000,
        logRawCommunication: false,
        beforeConnect: () => {
          if (!isConnectingRef.current || stompClientRef.current !== client) {
            try {
              client.deactivate();
            } catch (e) {
              console.error('beforeConnect - client.deactivate 실패:', e);
            }
            return;
          }
        },
        onDisconnect: () => {
          isSubscribedRef.current = false;
          isConnectingRef.current = false;
          if (connectionTimeoutIdRef.current) {
            clearTimeout(connectionTimeoutIdRef.current);
            connectionTimeoutIdRef.current = null;
          }
          if (onDisconnect) {
            onDisconnect();
          }
        },
        onConnect: () => {
          isConnectingRef.current = false;
          if (connectionTimeoutIdRef.current) {
            clearTimeout(connectionTimeoutIdRef.current);
            connectionTimeoutIdRef.current = null;
          }

          subscribeToNotifications();

          if (enableRoomSubscription && currentRoomIdRef.current) {
            setTimeout(() => {
              subscribeToRoom(currentRoomIdRef.current!);
            }, 100);
          }

          if (onConnect) {
            onConnect();
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

            if (
              enableRoomSubscription &&
              currentRoomIdRef.current &&
              stompClientRef.current
            ) {
              setTimeout(() => {
                if (stompClientRef.current?.connected) {
                  subscribeToRoom(currentRoomIdRef.current!);
                }
              }, 1000);
            }
          }
        },
        onWebSocketClose: () => {
          isSubscribedRef.current = false;
          isConnectingRef.current = false;

          if (
            autoReconnect &&
            enableRoomSubscription &&
            currentRoomIdRef.current
          ) {
            if (!stompClientRef.current?.active) {
              setTimeout(() => {
                attemptConnect();
              }, 2000);
            }
          }
        },
      });

      connectionTimeoutIdRef.current = setTimeout(() => {
        if (!client.connected && isConnectingRef.current) {
          isConnectingRef.current = false;
          try {
            client.deactivate();
          } catch (e) {
            console.error('connection timeout - client.deactivate 실패:', e);
          }
        }
      }, 10000);

      stompClientRef.current = client;
      client.activate();
    };

    attemptConnect();
  }, [
    subscribeToNotifications,
    subscribeToRoom,
    enableRoomSubscription,
    onConnect,
    onDisconnect,
    autoReconnect,
  ]);

  const disconnectWebSocket = useCallback(() => {
    if (roomSubscriptionRef.current) {
      try {
        roomSubscriptionRef.current.unsubscribe();
      } catch (e) {
        console.error('방 구독 해제 실패:', e);
      }
      roomSubscriptionRef.current = null;
    }

    if (notificationSubscriptionRef.current) {
      try {
        notificationSubscriptionRef.current.unsubscribe();
      } catch (e) {
        console.error('알림 구독 해제 실패:', e);
      }
      notificationSubscriptionRef.current = null;
    }

    isSubscribedRef.current = false;
    isConnectingRef.current = false;

    if (connectionTimeoutIdRef.current) {
      clearTimeout(connectionTimeoutIdRef.current);
      connectionTimeoutIdRef.current = null;
    }

    if (stompClientRef.current) {
      try {
        if (stompClientRef.current.connected || stompClientRef.current.active) {
          stompClientRef.current.deactivate();
        }
      } catch (e) {
        console.error('stompClient deactivate 실패:', e);
      }
      stompClientRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(
    (
      destination: string,
      body: string,
      headers: Record<string, string> = {}
    ) => {
      if (!stompClientRef.current || !stompClientRef.current.connected) {
        throw new Error('WebSocket이 연결되지 않았습니다.');
      }

      stompClientRef.current.publish({
        destination,
        headers,
        body,
      });
    },
    []
  );

  return {
    connectWebSocket,
    disconnectWebSocket,
    subscribeToRoom,
    unsubscribeFromRoom,
    sendMessage,
    isConnected: () => stompClientRef.current?.connected ?? false,
    isSubscribed: () => isSubscribedRef.current,
    getClient: () => stompClientRef.current,
  };
}
