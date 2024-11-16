// src/components/EditPostPage.js

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPostById, selectPostById, updatePost } from "../slices/postSlice";
import "./UploadPage.css"; // UploadPage의 스타일을 재사용

function EditPostPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("PUBLIC");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // 태그 관련 상태
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const editorRef = useRef(null);

  useEffect(() => {
    if (!post) {
      dispatch(fetchPostById(postId));
    } else {
      // 작성자 검증
      if (currentUserId !== post.authorId) {
        alert("수정 권한이 없습니다.");
        navigate(`/posts/${postId}`);
        return;
      }

      // 기존 게시물의 데이터를 상태에 설정
      setTitle(post.title);
      setStatus(post.status);
      setContent(post.content);
      setTags(post.tags || []);
      setImages(post.imageUrl ? [post.imageUrl] : []);
      // 이미지 파일은 기존 이미지 URL로부터 파일 객체를 만들 수 없으므로 빈 배열로 유지

      // 에디터 초기화
      if (editorRef.current) {
        // Check if Summernote is loaded
        if (window.$ && window.$.fn && window.$.fn.summernote) {
          window.$(editorRef.current).summernote({
            height: 300,
            focus: true,
            lang: "ko-KR",
            placeholder: "블로그 글 내용을 입력하세요...",
            toolbar: [
              ["style", ["style"]],
              ["font", ["bold", "italic", "underline"]],
              ["fontsize", ["fontsize"]],
              ["color", ["color"]],
              ["para", ["ul", "ol", "paragraph"]],
              ["table", ["table"]],
              ["insert", ["link", "picture", "video"]],
              ["view", ["fullscreen", "codeview"]],
            ],
            callbacks: {
              onChange: function (contents) {
                setContent(contents);
              },
            },
          });
          // 기존 내용 설정
          window.$(editorRef.current).summernote("code", post.content);
        } else {
          console.error("Summernote is not loaded.");
        }
      }
    }
  }, [dispatch, post, postId, currentUserId, navigate]);

  // 에디터 클린업
  useEffect(() => {
    return () => {
      if (
        editorRef.current &&
        window.$ &&
        window.$.fn &&
        window.$.fn.summernote
      ) {
        window.$(editorRef.current).summernote("destroy");
      }
    };
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("최대 5장까지 업로드 가능합니다.");
      return;
    }

    const newImages = files.slice(0, 5 - images.length);
    setImages((prevImages) => [
      ...prevImages,
      ...newImages.map((file) => URL.createObjectURL(file)),
    ]);
    setImageFiles((prevFiles) => [...prevFiles, ...newImages]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePostUpdate = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 작성자 검증 (이미 useEffect에서 검증했으므로 중복될 필요 없음)
    // if (currentUserId !== post.authorId) {
    //   alert("수정 권한이 없습니다.");
    //   return;
    // }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("status", status);
    formData.append("content", content);

    imageFiles.forEach((file) => {
      formData.append("image", file);
    });

    // 태그 추가
    tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    console.log("Sending tags:", tags); // 디버깅을 위한 로그 추가

    try {
      // Redux 액션을 디스패치하여 게시물 업데이트
      await dispatch(updatePost({ postId, formData })).unwrap();
      alert("글이 성공적으로 수정되었습니다!");
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error("글 수정에 실패했습니다.", error);
      alert("글 수정에 실패했습니다.");
    }
  };

  if (!post) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="upload-page-container">
      <div className="upload-header">
        <h1>글 수정</h1>
      </div>

      <div className="content-section">
        <div className="image-upload-section">
          <div className="preview-section">
            {images[0] && (
              <div className="main-preview">
                <img
                  src={images[0]}
                  alt="Main preview"
                  className="main-photo"
                />
              </div>
            )}
            <div className="thumbnail-preview">
              {images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="thumbnail-photo"
                />
              ))}
            </div>
          </div>
          <label htmlFor="image-upload" className="upload-button">
            이미지 업로드
          </label>
          <input
            type="file"
            id="image-upload"
            className="image-upload-input"
            onChange={handleImageUpload}
            multiple
            accept="image/*"
          />
        </div>

        <div className="info-section">
          <div className="input-field">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="블로그 글 제목"
            />
          </div>

          <div className="input-field">
            <label>공개 여부</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PUBLIC">공개</option>
              <option value="PRIVATE">비공개</option>
            </select>
          </div>

          {/* 태그 입력 섹션 */}
          <div className="input-field">
            <label>태그</label>
            <div className="tag-input-section">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="태그를 입력하고 Enter를 누르세요"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button onClick={handleAddTag}>추가</button>
            </div>
            <div className="tag-list">
              {tags.map((tag) => (
                <div key={tag} className="tag-item">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)}>x</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <label>내용</label>
        <div ref={editorRef}></div>
      </div>

      <button className="post-upload-button" onClick={handlePostUpdate}>
        수정하기
      </button>
    </div>
  );
}

export default EditPostPage;
