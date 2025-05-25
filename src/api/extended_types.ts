import { PostsRecord, UsersRecord } from './api_types';

export type PostsRecordExtended = Omit<PostsRecord, 'author'> & {
  author: UsersRecord;
};

export type PostsRecordExpanded = PostsRecord & {
  expand: {
    author: UsersRecord;
  };
};
