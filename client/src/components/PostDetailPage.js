import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, selectPostById, deletePost } from "../slices/postSlice.js";
import { getCurrentUser, selectCurrentUserId } from "../slices/authSlice";
import "./PostDetailPage.css";

function PostDetailPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const postsStatus = useSelector((state) => state.posts.status);
  const currentUserId = useSelector(selectCurrentUserId);
  const userStatus = useSelector((state) => state.auth.userStatus);

  // Redux 상태 초기화: posts 및 user 정보 로드
  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
    if (userStatus === "idle") {
      dispatch(getCurrentUser());
    }
  }, [dispatch, postsStatus, userStatus]);

  // 현재 로그인한 사용자 ID와 게시물 작성자 ID 확인
  console.log("postId from useParams:", postId);
  console.log("currentUserId:", currentUserId);
  console.log("post:", post);

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

  // 데이터 로드 상태 처리
  if (postsStatus === "loading" || userStatus === "loading") {
    return <p>Loading...</p>;
  }

  // 데이터가 아직 로드되지 않았을 때 로딩 상태 유지
  if (postsStatus !== "succeeded" || userStatus !== "succeeded") {
    return null; // 데이터를 로드 중일 때는 아무것도 렌더링하지 않음
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
              alt="Post main image"
              className="post-image"
            />
          </div>
        )}
        <p className="post-text">{post.content}</p>
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
