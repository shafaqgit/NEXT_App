import React from 'react';

function UserPostsCard({ post }) {
  return (
    <div className="shadow-md rounded overflow-hidden bg-white mb-4">
      <div className="p-5">
        <p className="text-lg font-medium">{post.title}</p>
        <p className="text-gray-600">{post.content}</p>
      </div>
    </div>
  );
}

export default UserPostsCard;
