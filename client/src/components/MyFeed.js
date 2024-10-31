import React, { useState } from "react";
import Tabs from "./Tabs";
import "./MyFeed.css";

const postsData = [
  {
    id: 1,
    imageUrl: "https://via.placeholder.com/150",
    title: "글 제목 1",
    content: "글 내용 1",
  },
  {
    id: 2,
    imageUrl: "https://via.placeholder.com/150",
    title: "사진 제목 1",
    content: "사진 내용 1",
  },
  {
    id: 3,
    imageUrl: "https://via.placeholder.com/150",
    title: "글 제목 2",
    content: "글 내용 2",
  },
  {
    id: 4,
    imageUrl: "https://via.placeholder.com/150",
    title: "사진 제목 2",
    content: "사진 내용 2",
  },
];

function MyFeed({ isLoggedIn, setIsLoggedIn }) {
  const [activeTab, setActiveTab] = useState("글");

  return (
    <div className="myfeed-container">
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
      />
      <div className="feed-container">
        {postsData.map((post) => (
          <div key={post.id} className="post-card">
            <img
              src={post.imageUrl}
              alt={`Post ${post.id}`}
              className="post-image"
            />
            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-preview">{post.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyFeed;
