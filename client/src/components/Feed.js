// src/components/Feed.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../slices/postSlice";
import "./Feed.css";

function Feed() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === "loading") {
    content = <p>Loading posts...</p>;
  } else if (postStatus === "succeeded") {
    content = posts.map((post) => (
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
    ));
  } else if (postStatus === "failed") {
    content = <p>{error}</p>;
  }

  return <div className="feed-container">{content}</div>;
}

export default Feed;
