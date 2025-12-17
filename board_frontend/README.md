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

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

기본값은 `http://localhost:8080`입니다.

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

## API 엔드포인트

프론트엔드는 다음 백엔드 API를 사용합니다:

- `GET /api/board` - 전체 게시글 조회
- `POST /api/board` - 게시글 생성
- `PUT /api/board/{id}` - 게시글 수정
- `DELETE /api/board/{id}` - 게시글 삭제



