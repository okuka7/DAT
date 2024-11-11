import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, selectPostById, deletePost } from "../slices/postSlice.js";
import { selectCurrentUserId } from "../slices/authSlice"; // 로그인 사용자 ID
import "./PostDetailPage.css";

function PostDetailPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const postsStatus = useSelector((state) => state.posts.status);
  const currentUserId = useSelector(selectCurrentUserId); // 로그인한 사용자 ID

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, postsStatus]);

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      dispatch(deletePost(postId))
        .then(() => {
          alert("게시물이 삭제되었습니다.");
          navigate("/");
        })
        .catch((error) => console.error("Failed to delete post:", error));
    }
  };

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
            <img src={post.imageUrl} alt="Post main" className="post-image" />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="post-actions">
          {currentUserId === post.authorId && ( // 작성자와 로그인 사용자가 같을 때만 표시
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
