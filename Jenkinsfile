
pipeline {
    agent any

    environment {
        GRADLE_HOME = tool name: 'Gradle 7.5', type: 'gradle'
        NODEJS_HOME = tool name: 'NodeJS 14', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        DOCKER_COMPOSE_FILE = '/home/yuntaegu/deploy/docker-compose.yml' // 홈 서버의 docker-compose.yml 경로
        BACKEND_DOCKER_IMAGE = "okuka99/dat_backend:${env.BUILD_NUMBER}"
        FRONTEND_DOCKER_IMAGE = "okuka99/dat_frontend:${env.BUILD_NUMBER}"
        HOME_SERVER = 'yuntaegu@211.178.69.18'
        SSH_KEY_ID = 'home-server-ssh-key'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/okuka7/DAT.git', credentialsId: 'github-credentials'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh "${GRADLE_HOME}/bin/gradle clean build -x test"
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh "${GRADLE_HOME}/bin/gradle test"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    // NodeJS 환경 설정
                    withEnv(["PATH+NODE=${NODEJS_HOME}/bin"]) {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    // Docker Hub 로그인
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
                    sshagent([SSH_KEY_ID]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${HOME_SERVER} << EOF
                                docker pull ${BACKEND_DOCKER_IMAGE}
                                docker pull ${FRONTEND_DOCKER_IMAGE}

                                # docker-compose.yml 파일 업데이트
                                sed -i '' 's|okuka99/dat_backend:.*|${BACKEND_DOCKER_IMAGE}|' ${DOCKER_COMPOSE_FILE}
                                sed -i '' 's|okuka99/dat_frontend:.*|${FRONTEND_DOCKER_IMAGE}|' ${DOCKER_COMPOSE_FILE}

                                docker-compose -f ${DOCKER_COMPOSE_FILE} up -d --no-deps --build app frontend
                            EOF
                        """
                    }
                }
            }
        }
    }

    post {
        always {
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
