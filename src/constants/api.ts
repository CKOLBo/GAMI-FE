export const API_PATHS = {
  SEND_CODE: '/api/auth/email/send-code',
  VERIFY_CODE: '/api/auth/email/verification-code',
  RESET_PASSWORD: '/api/auth/password',
  MENTORING_APPLY_SENT: '/api/mentoring/apply/sent',
  MENTORING_APPLY_RECEIVED: '/api/mentoring/apply/received',
  MENTORING_APPLY: (mentorId: number) => `/api/mentoring/apply/${mentorId}`,
  MENTORING_APPLY_UPDATE: (id: number) => `/api/mentoring/apply/${id}`,
};
