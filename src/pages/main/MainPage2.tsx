import Sidebar from '@/assets/components/Sidebar';
import Post from '@/assets/components/MainPost';
import FindMentor from '@/assets/svg/main/FindMentor.png';
import FireWorks from '@/assets/svg/main/FireWorks.png';
import RightIcon from '@/assets/svg/main/RightIcon';
import { Link } from 'react-router-dom';

export default function MainPage2() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-25">
        <h1 className="text-[40px] font-bold text-[#333D48] mb-16">홈</h1>

        <div className="grid grid-cols-3 gap-12 mb-8">
          <div className="col-span-2 bg-gradient-to-r from-[#BFA9FF] to-[#73A9FF] rounded-2xl p-20 flex items-center justify-between">
            <div className="text-[#ffffff]">
              <h2 className="text-[40px] font-bold mb-8 h-12 flex items-center">
                GAMI에 오신 걸 환영합니다! 양은준님
              </h2>
              <p className="text-[28px] h-8 flex items-center">
                멘토와 멘티를 바로 연결하는 맞춤형 멘토링 서비스에요.
              </p>
            </div>
            <div className="h-44 flex items-center justify-center">
              <img
                src={FireWorks}
                alt="FireWorks"
                className="h-full object-contain"
              />
            </div>
          </div>
          <div className="bg-[#F9F9F9] rounded-2xl p-7">
            <div className="flex justify-between items-center mb-5.5">
              <h2 className="text-[28px] font-bold text-[#333D48]">
                멘토 찾기
              </h2>
              <Link
                to="/mentoring"
                className="text-xl text-[#6D6F79] flex items-center gap-2"
              >
                전체보기
                <RightIcon />
              </Link>
            </div>
            <div className="text-center">
              <div className="h-36 mb-5 flex items-center justify-center">
                <img
                  src={FindMentor}
                  alt="Find Mentor"
                  className="h-full object-contain"
                />
              </div>
              <p className="text-2xl text-[#333D48] mb-9 font-bold">
                나에게 어울리는{' '}
                <span className="text-[#73A9FF] font-bold">멘토</span>를
                찾아볼까요?
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-[#333D48] mb-4">게시글</h2>
          <div className="grid grid-cols-3 gap-12 ">
            <Post
              title="제목"
              content="내용내욘ㅇㄴㅇ랜용ㄴ앰랜ㅇㄹㄴ내용ㄴ앵용냉sodasdoaskdlfj;@@Kfalskjflaksjdfoijasdfdfasdfasdfasdddddddddddddddddddddddddddddddd"
              likeCount={0}
              commentCount={0}
              postId={''}
            />
            <Post
              title="제목"
              content="내용내욘ㅇㄴㅇ랜용ㄴ앰랜ㅇㄹㄴ내용ㄴ앵용냉sodasdoaskdlfj;@@Kfalskjflaksjdfoijasdfdfasdfasdfasdddddddddddddddddddddddddddddddd"
              likeCount={31}
              commentCount={0}
              isLiked={true}
              postId={''}
            />
            <Post
              title="제목"
              content="내용내욘ㅇㄴㅇ랜용ㄴ앰랜ㅇㄹㄴ내용ㄴ앵용냉sodasdoaskdlfj;@@Kfalskjflaksjdfoijasdfdfasdfasdfasdddddddddddddddddddddddddddddddd"
              likeCount={112}
              commentCount={12}
              isLiked={true}
              postId={''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
