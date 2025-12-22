import ModalWrapper from '@/assets/shared/Modal';
import X from '@/assets/svg/X';

interface ToSModalProps {
  onClose: () => void;
}

export default function ToSModal({ onClose }: ToSModalProps) {
  return (
    <ModalWrapper className="px-10 py-8">
      <div className="w-[1350px] h-[750px] flex flex-col text-gray-1">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">GAMI 이용약관</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 mt-6 space-y-10">
          <section className="text-[20px] font-medium leading-relaxed">
            환영합니다.
            <br />
            <br />
            GAMI를 이용해주셔서 감사합니다.
            <br />
            서비스를 이용하시거나 회원으로 가입하실 경우 본 약관에 동의하시게
            되므로, 잠시 시간을 내셔서 주의 깊게 살펴봐 주시기 바랍니다.
            <br />
            <br />
            <strong>GAMI 이용약관(요약본)</strong>
            <br />
            시행일: 2025.12.01
            <br />
            운영주체: 팀 CKLOB
            <br />
            문의: cklob.gami@gmail.com
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">제1조(목적)</h3>
            <p className="text-[20px] font-medium leading-relaxed">
              본 약관은 팀 CKLOB(이하 “운영팀”)이 제공하는 GAMI 서비스 이용과
              관련된 기본 사항을 정합니다.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">제2조(대상 및 가입)</h3>
            <p className="text-[20px] font-medium leading-relaxed">
              1. 서비스 이용 대상은 광주소프트웨어마이스터고 재학생입니다.
              <br />
              2. 회원가입 시 다음 정보를 입력합니다: 이름, 성별, 기수, 전공,
              교내 이메일
              <br />
              3. 회원은 이용약관에 동의해야 하며, 개인정보 수집·이용 동의는
              별도로 진행합니다.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">제3조(서비스 내용)</h3>
            <p className="text-[20px] font-medium leading-relaxed">
              • 멘토 찾기
              <br />
              • 회원 간 채팅
              <br />
              • 익명게시판
              <br />
              <br />
              서비스는 무료이며 유료 플랜은 없습니다.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">
              제4조(게시판 운영 및 게시물 조치)
            </h3>
            <p className="text-[20px] font-medium leading-relaxed">
              1. 익명게시판은 익명으로 게시물을 작성할 수 있는 공간입니다.
              <br />
              2. 운영팀은 아래에 해당하는 게시물을 사전 통지 없이 삭제할 수
              있습니다.
              <br />
              - 광고·홍보·스팸
              <br />
              - 욕설·비하·혐오 표현
              <br />
              - 개인정보 노출
              <br />
              - 음란·불쾌한 내용
              <br />- 게시판 목적과 맞지 않는 내용
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">제5조(금지행위)</h3>
            <p className="text-[20px] font-medium leading-relaxed">
              1. 광고·홍보·스팸 게시 또는 유도
              <br />
              2. 욕설·비하·혐오 표현 등 타인에게 불쾌감을 주는 행위
              <br />
              3. 개인정보 노출·수집·유포
              <br />
              4. 음란하거나 선정적인 내용 게시
              <br />
              5. 반복 게시, 분란 조장
              <br />
              6. 서비스 운영 방해(과도한 요청, 악성 이용 등)
              <br />
              7. 계정 도용 또는 제3자의 가장 가입·이용
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">
              제6조(이용제한 및 탈퇴)
            </h3>
            <p className="text-[20px] font-medium leading-relaxed">
              1. 운영팀은 약관 위반 시 이용을 제한할 수 있습니다.
              <br />
              2. 게시물 삭제 / 일정 기간 이용 제한 / 계정 이용 정지 또는 탈퇴
              처리
              <br />
              3. 회원은 서비스 내 방법 또는 운영팀 안내에 따라 탈퇴를 요청할 수
              있습니다.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">
              제7조(서비스 변경·중단)
            </h3>
            <p className="text-[20px] font-medium leading-relaxed">
              운영팀은 점검, 유지보수, 시스템 장애, 약관 위반 확인 시<br />
              서비스의 전부 또는 일부를 제한하거나 중단할 수 있으며,
              <br />
              가능한 범위 내에서 사전 안내합니다.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">제8조(책임 제한)</h3>
            <p className="text-[20px] font-medium leading-relaxed">
              1. 운영팀은 서비스의 안정적 제공을 위해 노력합니다.
              <br />
              2. 회원의 귀책 사유로 발생한 문제에 대해서는 책임을 지지 않습니다.
              <br />
              3. 회원 간 이용 과정에서 발생한 손해에 대해서 책임을 제한합니다.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">제9조(약관 개정)</h3>
            <p className="text-[20px] font-medium leading-relaxed">
              운영팀은 필요 시 약관을 개정할 수 있으며,
              <br />
              개정 사항은 서비스 내 공지 등 합리적인 방법으로 안내합니다.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">부칙</h3>
            <p className="text-[20px] font-medium leading-relaxed">
              본 약관은 2025년 12월 1일부터 시행합니다.
            </p>
          </section>
        </div>
      </div>
    </ModalWrapper>
  );
}
