// src/main/java/com/server/service/FileUploadService.java

package com.server.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadService.class);

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file) {
        logger.info("파일 업로드 시작: 원본 파일명={}", file.getOriginalFilename());

        // 파일을 저장할 디렉토리 생성
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
                logger.info("디렉토리 생성 완료: {}", uploadPath.toString());
            } catch (IOException e) {
                logger.error("디렉토리 생성 실패: {}", uploadPath.toString(), e);
                throw new RuntimeException("파일 저장 경로를 생성할 수 없습니다.", e);
            }
        }

        // 파일 확장자 추출
        String originalFileExtension = "";
        String originalFileName = file.getOriginalFilename();
        if (originalFileName != null && originalFileName.contains(".")) {
            originalFileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        // UUID로 고유한 파일명 생성하여 인코딩 문제 해결
        String fileName = UUID.randomUUID().toString() + originalFileExtension;
        Path filePath = uploadPath.resolve(fileName);

        try {
            file.transferTo(filePath.toFile());
            logger.info("파일 저장 성공: {}", filePath.toString());
        } catch (IOException e) {
            logger.error("파일 저장 실패: {}", filePath.toString(), e);
            throw new RuntimeException("파일 업로드 중 오류 발생", e);
        }

        // 클라이언트에서 접근할 수 있는 URL 반환
        String fileUrl = "/uploads/" + fileName;
        logger.debug("파일 URL 반환: {}", fileUrl);
        return fileUrl;
    }
}
