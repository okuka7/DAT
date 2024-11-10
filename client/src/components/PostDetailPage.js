import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, selectPostById } from "../slices/postSlice.js"; // 필요한 함수 불러오기
import "./PostDetailPage.css";

function PostDetailPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const postsStatus = useSelector((state) => state.posts.status);

  useEffect(() => {
    if (postsStatus === "idle" || !post) {
      dispatch(fetchPosts());
    }
  }, [dispatch, post, postsStatus]);

  if (postsStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>게시물을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-status">
          {post.status === "공개" ? "🔓 공개" : "🔒 비공개"}
        </p>
      </div>
      <div className="post-content">
        {post.images && post.images.length > 0 && (
          <div className="post-images">
            <img src={post.images[0]} alt="Main post" className="main-image" />
            <div className="thumbnail-images">
              {post.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="thumbnail"
                />
              ))}
            </div>
          </div>
        )}
        <p className="post-text">{post.content}</p>
      </div>
    </div>
  );
}

export default PostDetailPage;
