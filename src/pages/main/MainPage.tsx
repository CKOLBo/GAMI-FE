import Sidebar from '@/assets/components/Sidebar';
import Post from '@/assets/components/MainPost';
import FindMentor from '@/assets/svg/main/FindMentor.png';
import FireWorks from '@/assets/svg/main/FireWorks.png';
import RightIcon from '@/assets/svg/main/RightIcon';
import { Link } from 'react-router-dom';

export default function MainPage() {
  const posts = [
    {
      postId: '1',
      title: '제목',
      content:
        '내용내욘ㅇㄴㅇ랜용ㄴ앰랜ㅇㄹㄴ내용ㄴ앵용냉sodasdoaskdlfj;@@Kfalskjflaksjdfoijasdfdfasdfasdfasdddddddddddddddddddddddddddddddd',
      commentCount: 0,
    },
    {
      postId: '2',
      title: '제목',
      content:
        '내용내욘ㅇㄴㅇ랜용ㄴ앰랜ㅇㄹㄴ내용ㄴ앵용냉sodasdoaskdlfj;@@Kfalskjflaksjdfoijasdfdfasdfasdfasdddddddddddddddddddddddddddddddd',
      commentCount: 0,
    },
    {
      postId: '3',
      title: '제목',
      content:
        '내용내욘ㅇㄴㅇ랜용ㄴ앰랜ㅇㄹㄴ내ㅝㅈ우배ㅜ애ㅑㅂ저엊뱌ㅐㅓ애ㅑㅂ저애ㅑㅂ재ㅑ엊배ㅓ애벚야ㅐ벚애ㅑㅓㅈ용ㄴ앵용냉sodasdoaskdlfj;@@Kfalskjflaksjdfoijasdfdfasdfasdfasdddddddddddddddddddddddddddddddd',
      commentCount: 12,
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 2xl:p-12 ml-45 2xl:ml-55">
        <h1 className="text-3xl 2xl:text-[40px] font-bold text-gray-1 mb-8">
          홈
        </h1>

        <div className="grid grid-cols-3 gap-8 2xl:gap-12 mb-6 2xl:mb-8">
          <div className="col-span-2 bg-gradient-to-r from-main-2 to-main-1 rounded-2xl 2xl:py-15 px-12 2xl:px-20 flex items-center justify-between shadow-GAMI">
            <div className="text-white">
              <h2 className="text-3xl 2xl:text-4xl font-bold mb-3 2xl:mb-6 h-8 2xl:h-12 flex items-center">
                GAMI에 오신 걸 환영합니다! 양은준님
              </h2>
              <p className="text-xl 2xl:text-2xl h-8 flex items-center">
                멘토와 멘티를 바로 연결하는 맞춤형 멘토링 서비스에요.
              </p>
            </div>
            <div className="h-32 2xl:h-44 flex items-center justify-center">
              <img
                src={FireWorks}
                alt="FireWorks"
                className="h-full object-contain"
              />
            </div>
          </div>
          <div className="bg-white shadow-GAMI rounded-2xl p-6 2xl:p-7">
            <div className="flex justify-between items-center mb-2 2xl:mb-5.5">
              <h2 className="text-xl 2xl:text-2xl font-bold text-gray-1">
                멘토 찾기
              </h2>
              <Link
                to="/mentoring"
                className="text-lg 2xl:text-2xl  text-gray-3 flex items-center gap-2"
              >
                전체보기
                <RightIcon />
              </Link>
            </div>
            <div className="text-center">
              <div className="h-28 2xl:h-36 mb-6 flex items-center justify-center">
                <img
                  src={FindMentor}
                  alt="Find Mentor"
                  className="h-full object-contain"
                />
              </div>
              <p className="text-lg 2xl:text-2xl text-gray-1 mb-1 2xl:mb-3 font-bold">
                나에게 어울리는{' '}
                <span className="text-main-1 font-bold">멘토</span>를
                찾아볼까요?
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl 2xl:text-4xl font-bold text-gray-1 mb-4">
            게시글
          </h2>
          <div className="grid grid-cols-3 gap-8 2xl:gap-12">
            {posts.map((post) => (
              <Post
                key={post.postId}
                title={post.title}
                content={post.content}
                commentCount={post.commentCount}
                postId={post.postId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
