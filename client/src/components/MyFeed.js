import React, { useState, useEffect } from "react";
import "./MyFeed.css";

const dummyPosts = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  imageUrl: `https://via.placeholder.com/150?text=Post+${index + 1}`,
  content: `This is the content of post ${index + 1}`,
}));

function MyFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(dummyPosts); // 더미 데이터로 상태 업데이트
  }, []);

  return (
    <div className="myfeed-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <img
            src={post.imageUrl}
            alt={`Post ${post.id}`}
            className="post-image"
          />
          <div className="post-content">
            <p>{post.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyFeed;
