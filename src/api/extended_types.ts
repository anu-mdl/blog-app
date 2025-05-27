import { CommentsRecord, PostsRecord, UsersRecord } from './api_types';

export type UserSocials = {
  twitter?: string;
  github?: string;
};

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

// export type PostsRecordExtended = Omit<PostsRecord, 'author'> & {
//   tableOfContents?: TOCItem[];
//   author: UsersRecord<UserSocials>;
// };

export type PostsRecordExtended = PostsRecord & {
  tableOfContents?: TOCItem[];
  expand?: {
    author?: UsersRecord<UserSocials>;
  };
};

// export type PostsRecordExtended = Omit<PostsRecord, 'author'> & {
//   tableOfContents?: TOCItem[];
//   expand?: {
//     author: UsersRecord<UserSocials>;
//   };
// };

export type CommentsRecordExtended = Omit<CommentsRecord, 'author'> & {
  author: UsersRecord<UserSocials>;
};
