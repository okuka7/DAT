// src/components/UploadPage.js

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadPage.css";

function UploadPage() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("공개");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // 태그 관련 상태
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const editorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (editorRef.current) {
      $(editorRef.current).summernote({
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
    }

    return () => {
      if (editorRef.current) {
        $(editorRef.current).summernote("destroy");
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

  const handlePostUpload = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("status", status);
    formData.append("content", content); // summernote의 content

    imageFiles.forEach((file) => {
      formData.append("image", file);
    });

    // 태그 추가
    tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    try {
      const token = localStorage.getItem("authToken");
      await axios.post("http://localhost:8080/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("글이 성공적으로 업로드되었습니다!");
      navigate("/myfeed");
    } catch (error) {
      console.error("글 업로드에 실패했습니다.", error);
      alert("글 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="upload-page-container">
      <div className="upload-header">
        <h1>글 작성</h1>
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
              <option value="공개">공개</option>
              <option value="비공개">비공개</option>
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

      <button className="post-upload-button" onClick={handlePostUpload}>
        게시하기
      </button>
    </div>
  );
}

export default UploadPage;
