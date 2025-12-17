# 게시판 프론트엔드

Next.js를 사용한 게시판 애플리케이션의 프론트엔드입니다.

## 기술 스택

- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Axios** - HTTP 클라이언트
- **CSS** - 스타일링

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 빌드

```bash
npm run build
```

### 4. 프로덕션 실행

```bash
npm start
```

## 환경 변수

`.env.local` 파일을 생성하여 백엔드 API URL을 설정할 수 있습니다:

```bash
# 로컬 개발용
NEXT_PUBLIC_API_URL=http://localhost:8080
```

기본값은 `http://localhost:8080`입니다.

## EC2 배포 가이드 (프론트엔드 + 백엔드 연동)

> 아래 예시는 EC2에서 `~/board_demo` 디렉토리에 전체 프로젝트를 클론하고,  
> 백엔드 JAR는 `/home/ec2-user/app/board-demo.jar` 경로에 있다고 가정합니다.

### 2단계. EC2에서 프론트엔드 Docker 이미지 빌드

1. EC2에 접속합니다.

   ```bash
   ssh -i /path/to/AWS_KEY ec2-user@YOUR_EC2_HOST
   ```

2. 프로젝트 디렉토리로 이동 후, 프론트엔드 이미지를 빌드합니다.  
   (백엔드가 노출된 주소로 `NEXT_PUBLIC_API_URL`을 설정하세요)

   ```bash
   cd ~/board_demo/board_frontend

   docker build -t board-frontend:latest \
     --build-arg NEXT_PUBLIC_API_URL=http://YOUR_PUBLIC_BACKEND_HOST:8080 \
     .
   ```

   - 예: EC2 퍼블릭 IP가 `13.124.137.252` 인 경우

     ```bash
     docker build -t board-frontend:latest \
       --build-arg NEXT_PUBLIC_API_URL=http://13.124.137.252:8080 \
       .
     ```

3. 이미지가 잘 생성되었는지 확인합니다.

   ```bash
   docker images | grep board-frontend
   ```

### 3단계. EC2에서 `.env` 파일 생성

`docker-compose.yml` 이 위치한 루트 디렉토리(예: `~/board_demo`)에서 다음을 실행합니다.

```bash
cd ~/board_demo

cat > .env << 'EOF'
DB_PASSWORD=root1234
NEXT_PUBLIC_API_URL=http://YOUR_PUBLIC_BACKEND_HOST:8080
APP_DIR=/home/ec2-user/app
EOF
```

- `YOUR_PUBLIC_BACKEND_HOST`를 실제 EC2 퍼블릭 IP 또는 도메인으로 변경하세요.
- `APP_DIR`는 백엔드 JAR 파일이 위치한 경로와 일치해야 합니다.

### 4단계. Docker Compose로 전체 서비스 실행

동일한 디렉토리(`~/board_demo`)에서 다음을 실행합니다.

```bash
cd ~/board_demo

docker-compose down || true
docker-compose up -d

docker-compose ps
```

정상적으로 실행되면 다음과 같은 컨테이너들이 떠 있어야 합니다.

- `board-mysql` (MySQL)
- `board-backend` (Spring Boot JAR 실행)
- `board-frontend` (Next.js 프론트엔드)

브라우저에서 `http://YOUR_PUBLIC_BACKEND_HOST:3000` 으로 접속하여 **lion 게시판** 화면이 정상적으로 표시되는지 확인하세요.

## 주요 기능

- 게시글 목록 조회
- 게시글 작성
- 게시글 수정
- 게시글 삭제

## 프로젝트 구조

```
board_frontend/
├── src/
│   ├── app/              # Next.js App Router 페이지
│   │   ├── page.tsx      # 메인 페이지 (게시글 목록)
│   │   ├── create/       # 게시글 작성 페이지
│   │   └── edit/[id]/    # 게시글 수정 페이지
│   ├── lib/              # 유틸리티 함수
│   │   └── api.ts        # API 통신 함수
│   └── types/            # TypeScript 타입 정의
│       └── board.ts      # 게시글 관련 타입
├── package.json
├── tsconfig.json
└── next.config.js
```