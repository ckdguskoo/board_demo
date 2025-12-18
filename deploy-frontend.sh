#!/bin/bash
# 프론트엔드 Docker 이미지 빌드 및 EC2 전송 스크립트
# 사용법: ./deploy-frontend.sh 13.124.84.86 /path/to/key.pem ec2-user

set -e

EC2_HOST=${1:-"13.124.84.86"}
SSH_KEY=${2:-"~/.ssh/ec2-key.pem"}
EC2_USER=${3:-"ec2-user"}
EC2_PATH=${4:-"~/board_demo"}

echo "🔨 프론트엔드 Docker 이미지 빌드 시작..."

# 1. Docker 이미지 빌드
echo ""
echo "[1/4] Docker 이미지 빌드 중..."
cd board_frontend

docker build \
    --build-arg NEXT_PUBLIC_API_URL=http://${EC2_HOST}:8080 \
    --tag board-frontend:latest \
    --file Dockerfile \
    .

echo "✅ Docker 이미지 빌드 완료"

# 2. 이미지를 tar 파일로 저장
echo ""
echo "[2/4] 이미지를 tar 파일로 저장 중..."
cd ..

TAR_FILE="/tmp/frontend-image.tar"
docker save board-frontend:latest -o ${TAR_FILE}

if [ ! -f ${TAR_FILE} ]; then
    echo "❌ tar 파일 생성 실패"
    exit 1
fi

FILE_SIZE=$(du -h ${TAR_FILE} | cut -f1)
echo "✅ tar 파일 생성 완료 (크기: ${FILE_SIZE})"

# 3. tar 파일 압축
echo ""
echo "[3/4] tar 파일 압축 중..."
GZ_FILE="/tmp/frontend-image.tar.gz"
gzip -c ${TAR_FILE} > ${GZ_FILE}

GZ_FILE_SIZE=$(du -h ${GZ_FILE} | cut -f1)
echo "✅ 압축 완료 (크기: ${GZ_FILE_SIZE})"

# 4. EC2로 전송
echo ""
echo "[4/4] EC2로 이미지 전송 중..."
scp -i ${SSH_KEY} -o StrictHostKeyChecking=no \
    ${GZ_FILE} \
    ${EC2_USER}@${EC2_HOST}:${EC2_PATH}/

if [ $? -ne 0 ]; then
    echo "❌ EC2로 전송 실패"
    rm -f ${TAR_FILE} ${GZ_FILE}
    exit 1
fi

echo "✅ EC2로 전송 완료"

# 5. EC2에서 이미지 로드
echo ""
echo "[5/5] EC2에서 이미지 로드 중..."
ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << EOF
cd ${EC2_PATH}
gunzip -c frontend-image.tar.gz | docker load
rm -f frontend-image.tar.gz
docker images | grep board-frontend
EOF

if [ $? -ne 0 ]; then
    echo "❌ EC2에서 이미지 로드 실패"
    rm -f ${TAR_FILE} ${GZ_FILE}
    exit 1
fi

echo "✅ EC2에서 이미지 로드 완료"

# 6. 정리
echo ""
echo "🧹 임시 파일 정리 중..."
rm -f ${TAR_FILE} ${GZ_FILE}

echo ""
echo "✅ 프론트엔드 이미지 배포 완료!"
echo ""
echo "다음 명령어로 EC2에서 컨테이너를 재시작하세요:"
echo "ssh -i ${SSH_KEY} ${EC2_USER}@${EC2_HOST} 'cd ${EC2_PATH} && docker-compose restart frontend'"

