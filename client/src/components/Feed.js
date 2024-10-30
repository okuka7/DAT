import React, { useState } from "react";
import "./Feed.css";

const dummyImages = [
  "https://via.placeholder.com/600x400?text=Image+1",
  "https://via.placeholder.com/600x400?text=Image+2",
  "https://via.placeholder.com/600x400?text=Image+3",
  "https://via.placeholder.com/600x400?text=Image+4",
  "https://via.placeholder.com/600x400?text=Image+5",
];

function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + dummyImages.length) % dummyImages.length
    );
  };

  return (
    <div className="feed-container">
      <button onClick={handlePrev} className="feed-button left">
        ◀
      </button>
      <img
        src={dummyImages[currentIndex]}
        alt="Random"
        className="feed-image"
      />
      <button onClick={handleNext} className="feed-button right">
        ▶
      </button>
    </div>
  );
}

export default Feed;
