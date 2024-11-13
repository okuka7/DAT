// components/PostDetailPage.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPostById,
  selectPostById,
  deletePost,
} from "../slices/postSlice.js";
import { selectCurrentUserId } from "../slices/authSlice";
import "./PostDetailPage.css";

function PostDetailPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const currentUserId = useSelector(selectCurrentUserId);

  useEffect(() => {
    if (!post) {
      dispatch(fetchPostById(postId))
        .unwrap()
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Failed to load post:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch, postId, post]);

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      dispatch(deletePost(postId))
        .then(() => {
          alert("게시물이 삭제되었습니다.");
          navigate("/myfeed");
        })
        .catch((error) => console.error("Failed to delete post:", error));
    }
  };

  if (loading) {
    return <p>로딩 중...</p>;
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
        {post.imageUrl && (
          <div className="post-images">
            <img
              src={post.imageUrl}
              alt="Post main"
              className="detail-post-image"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/path/to/placeholder-image.png";
              }}
            />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="post-actions">
          {currentUserId === post.authorId && (
            <>
              <button className="post-action-button">수정</button>
              <button className="post-action-button" onClick={handleDelete}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
