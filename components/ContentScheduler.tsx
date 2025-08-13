import React from 'react';
import type { ScheduledPost } from '../types';
import { Card, CardContent } from './Card';
import { PublishedIcon } from './Icons';

interface ContentSchedulerProps {
  posts: ScheduledPost[];
}

const StatusIndicator = ({
  status,
  publishedAt,
}: {
  status: ScheduledPost['status'];
  publishedAt?: string;
}) => {
  if (status === 'published') {
    return (
      <div className="flex items-center justify-end gap-1 text-green-400">
        <PublishedIcon />
        <div className="text-right">
          <span className="text-xs font-bold block">Published</span>
          <span className="text-xs text-gray-500 block">{publishedAt}</span>
        </div>
      </div>
    );
  }
  if (status === 'publishing') {
    return (
      <div className="flex items-center justify-end gap-1 text-yellow-400 animate-pulse">
        <span className="text-xs font-bold">Publishing...</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-end gap-1 text-gray-400">
      <span className="text-xs font-bold">Scheduled</span>
    </div>
  );
};

const ScheduledPostItem = ({ post }: { post: ScheduledPost }) => (
  <div className="flex items-start gap-4 p-4 border-b border-[#333] last:border-b-0">
    <div className="flex-shrink-0 text-[#39FF14] mt-1">{post.icon}</div>
    <div className="flex-grow">
      <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">{post.content}</p>
    </div>
    <div className="flex-shrink-0 text-right w-32">
      <p className="text-xs text-gray-500">{post.platform}</p>
      <p className="text-xs font-semibold text-gray-400 mb-2">{post.scheduledAt}</p>
      <StatusIndicator status={post.status} publishedAt={post.publishedAt} />
    </div>
  </div>
);

export const ContentScheduler = ({ posts }: ContentSchedulerProps): React.ReactNode => {
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.status === 'published' && b.status !== 'published') return 1;
    if (a.status !== 'published' && b.status === 'published') return -1;
    return 0;
  });

  return (
    <Card>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center p-8">
            <p className="font-teko text-2xl text-gray-600 tracking-widest">NO CONTENT SCHEDULED</p>
            <p className="text-xs text-gray-500">
              Use the 'Schedule' button on the marketing cards to add content here.
            </p>
          </div>
        ) : (
          <div>
            {sortedPosts.map((post) => (
              <ScheduledPostItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
