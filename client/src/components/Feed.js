import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLatestPosts } from "../slices/postSlice"; // 최신글 데이터를 위한 액션 수정
import "./Feed.css";

function Feed() {
  const dispatch = useDispatch();
  const latestPosts = useSelector((state) => state.posts.latestPosts);
  const postsStatus = useSelector((state) => state.posts.status);

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(getLatestPosts()); // 최신글 데이터를 가져오기 위한 액션 호출
    }
  }, [postsStatus, dispatch]);

  return (
    <div className="feed-container">
      {latestPosts.map((post) => (
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

export default Feed;
