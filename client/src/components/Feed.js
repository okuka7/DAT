import React, { useState, useEffect } from "react";
import "./Feed.css";

const dummyPosts = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  imageUrl: `https://via.placeholder.com/${150 + (index % 5) * 50}x${
    200 + (index % 3) * 50
  }?text=Post+${index + 1}`,
  content: `This is the content of post ${index + 1}`,
}));

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(dummyPosts);
  }, []);

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card feed">
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

export default Feed;
