
# 베이스 이미지 설정 (OpenJDK 17 사용)
FROM openjdk:17-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일을 컨테이너로 복사
COPY build/libs/*.jar app.jar

# 필요한 경우 환경 변수 설정 (예: 프로파일 설정)
# ENV SPRING_PROFILES_ACTIVE=prod

# 애플리케이션이 사용하는 포트 노출
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
