import ModalWrapper from '@/assets/shared/Modal';
import X from '@/assets/svg/X';

interface PrivacyModalProps {
  onClose: () => void;
}

export default function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
    <ModalWrapper className="px-10 py-8">
      <div className="w-[1350px] h-[750px] flex flex-col text-gray-1">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">
            GAMI 개인정보 수집·이용 동의서
          </h2>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-4 mt-6 space-y-10">
          <section className="text-[18px] font-medium leading-relaxed">
            서비스명: GAMI
            <br />
            개인정보처리자(운영주체): 팀 CKLOB
            <br />
            문의: cklob.gami@gmail.com
            <br />
            동의서 버전: v1 / 시행일: 2025.12.01
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">
              1. 개인정보 수집·이용에 관한 안내(고지)
            </h3>
            <p className="text-[18px] font-medium leading-relaxed">
              운영팀은 회원가입 및 서비스 제공을 위해 아래와 같이 개인정보를
              수집·이용합니다.
              <br />
              (동의 시 목적, 항목, 보유·이용 기간, 동의 거부권 및 불이익을
              고지해야 함)
            </p>
          </section>
          <section>
            <h3 className="text-lg font-semibold mb-2">
              [필수] 수집·이용 내역
            </h3>
            <div className="border border-gray-2 rounded-xl overflow-hidden text-[17px] font-medium">
              <div className="grid grid-cols-2 bg-[#F9F9F9] px-4 py-3">
                <span>구분</span>
                <span>내용</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-3 border-t">
                <span>수집·이용 목적</span>
                <span>
                  회원가입 및 회원관리, 서비스 제공
                  <br />
                  (멘토 찾기/채팅/익명게시판), 공지 및 문의 응대
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-3 border-t">
                <span>수집 항목</span>
                <span>이름, 성별, 기수, 전공, 교내 이메일</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-3 border-t">
                <span>보유·이용 기간</span>
                <span>회원 탈퇴 시까지</span>
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">
              2. 동의 거부 권리 및 동의 거부 시 불이익
            </h3>
            <p className="text-[18px] font-medium leading-relaxed">
              • 귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
              <br />• 다만, 개인정보는 회원가입 및 서비스 제공에 필수적인
              항목이므로 동의를 거부할 경우 회원가입 및 서비스 이용이 제한될 수
              있습니다.
            </p>
          </section>
          <section>
            <p className="text-[17px] font-medium leading-relaxed">
              ※ 본 동의는 이용약관 동의 등 다른 동의와 구분하여 받습니다.
            </p>
          </section>
        </div>
      </div>
    </ModalWrapper>
  );
}
