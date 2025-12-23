export interface ActionButton {
  icon: React.ReactNode;
  onClick: () => void;
  count?: number;
  showCount?: boolean;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  memberId: number;
  createdAt: string;
  updatedAt: string;
  images: string[];
}

export interface PostListResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Post[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  last: boolean;
  first: boolean;
  empty: boolean;
}
