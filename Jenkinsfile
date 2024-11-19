
pipeline {
    agent any

    environment {
        // Gradle과 Docker 관련 환경 변수 설정
        GRADLE_HOME = tool name: 'Gradle 7.5', type: 'gradle' // Jenkins에 설정한 Gradle 이름과 일치해야 함
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        DOCKER_IMAGE = "your-dockerhub-username/your-app:${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Git 저장소에서 코드 가져오기
                git branch: 'main', url: 'https://github.com/okuka7/DAT.git', credentialsId: 'github-credentials'
            }
        }

        stage('Build') {
            steps {
                // Gradle을 사용하여 프로젝트 빌드
                sh "${GRADLE_HOME}/bin/gradle clean build -x test"
            }
        }

        stage('Test') {
            steps {
                // Gradle을 사용하여 테스트 실행
                sh "${GRADLE_HOME}/bin/gradle test"
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    // Docker Compose를 사용하여 컨테이너 빌드
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} build"

                    // Docker Hub에 로그인
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        sh "echo ${DOCKERHUB_PASS} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                    }

                    // Docker 이미지 태그 및 푸시
                    sh "docker tag spring_boot_app:latest ${DOCKER_IMAGE}"
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Docker Compose를 사용하여 컨테이너 실행
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} down"
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d"
                }
            }
        }
    }

    post {
        always {
            // 빌드 후 작업 (예: 정리)
            cleanWs()
        }
        success {
            echo '배포가 성공적으로 완료되었습니다!'
				subject: "Build ${currentBuild.displayName} succeeded",
                body: "The build for ${env.JOB_NAME} was successful.",
                to: 'qorghab123@gmail.com', // 메일정보
                attachLog: true // 로그파일 첨부 여부
        }
        failure {
            echo '배포에 실패했습니다.'
				subject: "Build ${currentBuild.displayName} failed",
                body: "The build for ${env.JOB_NAME} failed. Please check the attached build logs.",
                to: 'qorghab123@gmail.com', // 메일정보
                attachLog: true
        }
    }
}
