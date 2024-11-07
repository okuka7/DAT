import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext"; // AuthContext import
import API from "../api"; // API 인스턴스 import
import "./UploadPage.css";

function UploadPage() {
  const { isLoggedIn } = useContext(AuthContext); // AuthContext에서 로그인 상태 확인
  const [productName, setProductName] = useState("");
  const [status, setStatus] = useState("글");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 5) {
      alert("최대 5장까지 업로드 가능합니다.");
      return;
    }

    const newPhotos = files.slice(0, 5 - photos.length);
    setPhotos((prevPhotos) => [
      ...prevPhotos,
      ...newPhotos.map((file) => URL.createObjectURL(file)),
    ]);
    setPhotoFiles((prevFiles) => [...prevFiles, ...newPhotos]);
  };

  const handleProductUpload = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("status", status);
    formData.append("description", description);

    // 사진 파일들을 FormData에 추가
    photoFiles.forEach((file, index) => {
      formData.append("photos", file);
    });

    try {
      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("상품이 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("상품 업로드에 실패했습니다.", error);
      alert("상품 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="upload-page-container">
      <div className="content-section">
        <div className="photo-upload-section">
          <div className="preview-section">
            {photos[0] && (
              <div className="main-preview">
                <img
                  src={photos[0]}
                  alt="Main preview"
                  className="main-photo"
                />
              </div>
            )}
            <div className="thumbnail-preview">
              {photos.slice(1).map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  className="thumbnail-photo"
                />
              ))}
            </div>
          </div>
          <label htmlFor="photo-upload" className="custom-upload-button">
            사진 업로드
          </label>
          <input
            type="file"
            id="photo-upload"
            className="photo-upload-input"
            onChange={handlePhotoUpload}
            multiple
            accept="image/*"
          />
        </div>

        <div className="info-section">
          <div className="input-field">
            <label>제목</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label>종류</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="글">글</option>
              <option value="사진">사진</option>
            </select>
          </div>
        </div>
      </div>

      <div className="description-section">
        <label>상세 설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button className="product-upload-button" onClick={handleProductUpload}>
        글 올리기
      </button>
    </div>
  );
}

export default UploadPage;
