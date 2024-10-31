import React, { useState, useEffect } from "react";
import { FaHeart, FaFlag, FaRegHeart } from "react-icons/fa";
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    setPosts(dummyPosts);
  }, []);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsLiked(false);
    setIsReported(false);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleReport = () => {
    setIsReported(true);
    alert("신고가 접수되었습니다.");
  };

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card feed">
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

      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected Post" />
            <div className="modal-icons">
              {isLiked ? (
                <FaHeart onClick={handleLike} className="icon liked" />
              ) : (
                <FaRegHeart onClick={handleLike} className="icon" />
              )}
              <FaFlag
                onClick={handleReport}
                className={`icon report ${isReported ? "reported" : ""}`}
              />
            </div>
            <div className="modal-buttons">
              <button className="exchange-button">물물교환 신청하기</button>
              <button className="close-button" onClick={closeModal}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;
