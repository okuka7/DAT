import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "./Tabs";
import "./MyFeed.css";

const myFeedPosts = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  imageUrl: `https://via.placeholder.com/${150 + (index % 5) * 50}x${
    200 + (index % 3) * 50
  }?text=MyFeed+${index + 1}`,
  content: `This is the content of my post ${index + 1}`,
}));

const savedPosts = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  imageUrl: `https://via.placeholder.com/${150 + (index % 5) * 50}x${
    200 + (index % 3) * 50
  }?text=Saved+${index + 1}`,
  content: `This is the content of saved post ${index + 1}`,
}));

function MyFeed() {
  const [activeTab, setActiveTab] = useState("myfeed");
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(activeTab === "myfeed" ? myFeedPosts : savedPosts);
  }, [activeTab]);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="myfeed-container">
      <div className="top-bar">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="feed-container">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <img
              src={post.imageUrl}
              alt={`Post ${post.id}`}
              className="post-image"
              onClick={() => openModal(post.imageUrl)}
            />
            <div className="post-content">
              <p>{post.content}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected Post" />
            <button className="close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyFeed;
