import React, { useState } from "react";
import axios from "axios";
import "./UploadPage.css";

function UploadPage() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [usage, setUsage] = useState("10"); // 기본값을 10으로 설정
  const [status, setStatus] = useState("판매중");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);

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
  };

  const handleProductUpload = async () => {
    try {
      const productData = {
        name: productName,
        price: price,
        usage: usage,
        status: status,
        description: description,
      };
      await axios.post("http://localhost:8080/api/products", productData);
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
            <label>이름</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label>가격</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label>사용감 (%)</label>
            <select value={usage} onChange={(e) => setUsage(e.target.value)}>
              <option value="10">10</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="70">70</option>
              <option value="90">90</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="input-field">
            <label>판매 상태</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="판매중">판매중</option>
              <option value="판매완료">판매완료</option>
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
        상품 올리기
      </button>
    </div>
  );
}

export default UploadPage;
