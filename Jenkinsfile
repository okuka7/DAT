
pipeline {
    agent any

    environment {
        // Gradle과 Docker 관련 환경 변수 설정
        GRADLE_HOME = tool name: 'Gradle 7.5', type: 'gradle' // Jenkins에 설정한 Gradle 이름과 일치해야 함
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        BACKEND_DOCKER_IMAGE = "okuka99/DAT_backend:${env.BUILD_NUMBER}"
        FRONTEND_DOCKER_IMAGE = "okuka99/DAT_frontend:${env.BUILD_NUMBER}"
        HOME_SERVER = 'yuntaegu@211.178.69.18' // 설정한 홈 서버 SSH 사용자 및 외부 IP
        SSH_KEY_ID = 'qorghab123' // Jenkins에 등록한 SSH 키 자격 증명 ID
    }

    stages {
        stage('Checkout') {
            steps {
                // Git 저장소에서 코드 가져오기
                git branch: 'main', url: 'https://github.com/okuka7/DAT.git', credentialsId: 'github-credentials'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    // Gradle을 사용하여 백엔드 프로젝트 빌드
                    sh "${GRADLE_HOME}/bin/gradle clean build -x test"
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    // Gradle을 사용하여 백엔드 테스트 실행
                    sh "${GRADLE_HOME}/bin/gradle test"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    // Node.js를 사용하여 프론트엔드 빌드
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    // Docker Hub에 로그인
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        sh "echo ${DOCKERHUB_PASS} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                    }

                    // 백엔드 Docker 이미지 빌드 및 푸시
                    dir('backend') {
                        sh "docker build -t ${BACKEND_DOCKER_IMAGE} ."
                        sh "docker push ${BACKEND_DOCKER_IMAGE}"
                    }

                    // 프론트엔드 Docker 이미지 빌드 및 푸시
                    dir('frontend') {
                        sh "docker build -t ${FRONTEND_DOCKER_IMAGE} ."
                        sh "docker push ${FRONTEND_DOCKER_IMAGE}"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // 홈 서버에 SSH로 접속하여 Docker Compose 업데이트
                    sshagent(['home-server-ssh-key']) { // SSH_KEY_ID 사용
                        sh """
                            ssh -o StrictHostKeyChecking=no ${HOME_SERVER} <<EOF
                                docker pull ${BACKEND_DOCKER_IMAGE}
                                docker pull ${FRONTEND_DOCKER_IMAGE}

                                # docker-compose.yml 파일 업데이트
                                sed -i 's|your-dockerhub-username/spring_boot_app:.*|your-dockerhub-username/spring_boot_app:${env.BUILD_NUMBER}|' ${DOCKER_COMPOSE_FILE}
                                sed -i 's|your-dockerhub-username/react_frontend:.*|your-dockerhub-username/react_frontend:${env.BUILD_NUMBER}|' ${DOCKER_COMPOSE_FILE}

                                docker-compose -f ${DOCKER_COMPOSE_FILE} up -d --no-deps --build backend frontend
                            EOF
                        """
                    }
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
            emailext (
                subject: "Build ${currentBuild.displayName} succeeded",
                body: "The build for ${env.JOB_NAME} was successful.",
                to: 'qorghab123@gmail.com',
                attachLog: true
            )
        }
        failure {
            emailext (
                subject: "Build ${currentBuild.displayName} failed",
                body: "The build for ${env.JOB_NAME} failed. Please check the attached build logs.",
                to: 'qorghab123@gmail.com',
                attachLog: true
            )
        }
    }
}
