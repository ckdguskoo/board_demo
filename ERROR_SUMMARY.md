# Error Summary - Board Demo 프로젝트

이 문서는 Board Demo 프로젝트 개발 및 배포 과정에서 발생한 오류들과 해결 방법을 정리한 것입니다.

---

## 1. 프론트엔드 빌드 오류

### 1.1 PowerShell && 토큰 오류
**오류 메시지:**
```
'&&' 토큰은 이 버전에서 올바른 문 구분 기호가 아닙니다.
```

**원인:** PowerShell에서는 `&&`를 사용할 수 없음

**해결 방법:**
- 명령어를 분리하여 실행
- 또는 세미콜론(`;`) 사용

---

### 1.2 package.json 파일 없음
**오류 메시지:**
```
package.json 파일이 없어서 에러 발생
```

**원인:** 파일 경로 또는 tsconfig.json의 paths 설정 오류

**해결 방법:**
- `tsconfig.json`의 `paths` 설정을 `"@/*": ["./src/*"]`로 수정

---

### 1.3 useEffect import 오류
**오류 메시지:**
```
Cannot find name 'useEffect'
```

**원인:** React에서 `useEffect`를 import하지 않음

**해결 방법:**
- `import { useState, useEffect } from 'react'`로 수정

---

### 1.4 Docker Build - public 디렉토리 없음
**오류 메시지:**
```
buildx failed with: ERROR: failed to build: failed to solve: failed to compute cache key: failed to calculate checksum of ref ... "/app/public": not found
```

**원인:** Dockerfile에서 `public` 디렉토리가 존재하지 않음

**해결 방법:**
- Dockerfile에 `RUN mkdir -p public || true` 추가

---

## 2. 백엔드 빌드 오류

### 2.1 Gradle 빌드 오류
**오류 메시지:**
```
buildx failed with: ERROR: failed to build: failed to solve: process "/bin/sh -c gradle clean build -x test --no-daemon" did not complete successfully: exit code: 1
```

**원인:** Dockerfile에서 `gradle` 대신 `./gradlew`를 사용해야 함

**해결 방법:**
- Dockerfile에서 `./gradlew clean bootJar --no-daemon` 사용
- `.dockerignore`에서 `gradlew`와 `gradle/wrapper` 제외

---

## 3. 배포 관련 오류

### 3.1 JAR 파일 EC2 전송 실패
**오류 메시지:**
```
ls: cannot access '/home/ec2-user/app/board-demo.jar': No such file or directory
```

**원인:** 하드코딩된 경로 사용

**해결 방법:**
- GitHub Repository Secret `EC2_PATH` 추가
- 워크플로우에서 `secrets.EC2_PATH` 사용

---

### 3.2 SSH 키 권한 오류
**오류 메시지:**
```
Bad permissions. Try removing permissions for user: BUILTIN\Users (S-1-5-32-545) on file C:/Users/user/Desktop/AWS_KEY.
```

**원인:** SSH 키 파일에 잘못된 권한 설정

**해결 방법:**
```powershell
# PowerShell에서 실행
icacls "C:\Users\user\Desktop\AWS_KEY" /inheritance:r
icacls "C:\Users\user\Desktop\AWS_KEY" /grant:r "$env:USERNAME:R"
```

---

### 3.3 SSH 연결 실패
**오류 메시지:**
```
Permission denied (publickey,gssapi-keyex,gssapi-with-mic)
```

**원인:** SSH 키 형식 문제 또는 잘못된 사용자명

**해결 방법:**
- SSH 키가 OpenSSH 형식인지 확인
- EC2 사용자명 확인 (`ec2-user` 또는 `ubuntu`)

---

### 3.4 .env 파일 문자 인코딩 오류
**오류 메시지:**
```
failed to read /home/ec2-user/board_demo/.env: line 2: unexpected character "\u200c" in variable name "NEXT_PUBLIC_AP\u200c\u200bI_URL=http://localhost:8080"
```

**원인:** 숨겨진 문자(Zero-width non-joiner) 포함

**해결 방법:**
- `.env` 파일을 `cat > .env << 'EOF'` 형식으로 재생성
- 또는 직접 편집 시 주의

---

### 3.5 MySQL 포트 충돌
**오류 메시지:**
```
Bind for 0.0.0.0:3306 failed: port is already allocated
```

**원인:** 다른 MySQL 컨테이너가 3306 포트 사용 중

**해결 방법:**
- `docker-compose.yml`에서 MySQL 포트 매핑을 `3307:3306`으로 변경

---

## 4. 네트워크 및 연결 오류

### 4.1 Network Error - localhost:8080
**오류 메시지:**
```
GET http://localhost:8080/api/board net::ERR_CONNECTION_REFUSED
```

**원인:** 프론트엔드 빌드 시 `NEXT_PUBLIC_API_URL`이 `localhost:8080`으로 하드코딩됨

**해결 방법:**
- Dockerfile에 `ARG NEXT_PUBLIC_API_URL` 추가
- GitHub Actions에서 `--build-arg NEXT_PUBLIC_API_URL=http://EC2_IP:8080` 전달
- `.github/workflows/deploy.yml`과 `.github/workflows/docker-build.yml` 모두 수정

---

### 4.2 CORS 오류
**오류 메시지:**
```
Access to XMLHttpRequest at 'http://3.37.62.82:8080/api/board' from origin 'http://3.37.62.82:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**원인:** 백엔드 CORS 설정이 `localhost:3000`만 허용

**해결 방법:**
- `WebConfig.java`에서 `allowedOrigins`에 EC2 IP 추가
- `CorsFilter` Bean 추가하여 더 확실한 CORS 처리

```java
.allowedOrigins("http://localhost:3000", "http://3.37.62.82:3000")
```

---

## 5. 데이터베이스 연결 오류

### 5.1 Hibernate Dialect 오류
**오류 메시지:**
```
Caused by: org.hibernate.service.spi.ServiceException: Unable to create requested service [org.hibernate.engine.jdbc.env.spi.JdbcEnvironment] due to: Unable to determine Dialect without JDBC metadata
```

**원인:** Hibernate가 데이터베이스 방언을 자동으로 감지하지 못함

**해결 방법:**
- `application.yml`에 `hibernate.dialect: org.hibernate.dialect.MySQLDialect` 추가

---

### 5.2 UnknownHostException - mysql
**오류 메시지:**
```
Caused by: java.net.UnknownHostException: mysql: Name does not resolve
```

**원인:** `application.yml`에서 데이터베이스 호스트를 `localhost`로 설정

**해결 방법:**
- `application.yml`의 `datasource.url`을 `jdbc:mysql://mysql:3306/liondb`로 변경
- Docker Compose의 서비스 이름(`mysql`) 사용
- `docker-compose.yml`에서 `mysql` 서비스가 `board-network`에 포함되어 있는지 확인

---

### 5.3 UnknownHostException - board-mysql
**오류 메시지:**
```
Caused by: java.net.UnknownHostException: board-mysql: Name does not resolve
```

**원인:** 컨테이너 이름 대신 서비스 이름을 사용해야 함

**해결 방법:**
- `docker-compose.yml`의 서비스 이름(`mysql`) 사용
- 컨테이너 이름(`board-mysql`)이 아닌 서비스 이름 사용

---

## 6. Docker 관련 오류

### 6.1 Docker Build EC2에서 멈춤
**문제:**
- EC2에서 `docker build` 실행 시 컴퓨터가 멈춤

**원인:** EC2 인스턴스의 CPU/RAM 부족

**해결 방법:**
- GitHub Actions에서 이미지 빌드 후 EC2로 전송
- `.github/workflows/deploy.yml`에서 이미지 빌드 및 전송 단계 추가

---

### 6.2 Docker Desktop 연결 오류
**오류 메시지:**
```
ERROR: error during connect: Head "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/_ping": got 1 SIGTERM/SIGINTs, forcing shutdown
```

**원인:** Docker Desktop이 실행되지 않음

**해결 방법:**
- Docker Desktop 재시작
- 또는 GitHub Actions 사용

---

### 6.3 Docker Compose 이미지 Pull 실패
**오류 메시지:**
```
Error response from daemon: pull access denied for board-frontend, repository does not exist or may require 'docker login': denied: requested access to the resource is denied
```

**원인:** 로컬 이미지가 EC2에 없음

**해결 방법:**
- GitHub Actions에서 이미지를 빌드하고 EC2로 전송
- 또는 로컬에서 빌드 후 `docker save`로 tar 파일 생성하여 전송

---

### 6.4 frontend-image.tar.gz 파일 없음
**오류 메시지:**
```
ls: cannot access 'frontend-image.tar.gz': No such file or directory
```

**원인:** GitHub Actions 워크플로우에서 이미지를 로드한 후 파일을 삭제함

**해결 방법:**
- 정상 동작임 (워크플로우에서 `rm -f frontend-image.tar.gz` 실행)
- `docker images | grep board-frontend`로 이미지 확인

---

## 7. GitHub Actions 관련 오류

### 7.1 워크플로우 파일 위치 오류
**문제:**
- "Deploy to EC2" 워크플로우가 실행되지 않음

**원인:** `.github/deploy.yml`이 `.github/workflows/` 디렉토리에 없음

**해결 방법:**
- 파일을 `.github/workflows/deploy.yml`로 이동
- GitHub Actions는 `.github/workflows/` 디렉토리의 파일만 인식

---

### 7.2 NEXT_PUBLIC_API_URL이 localhost로 빌드됨
**문제:**
- GitHub Actions 로그에서 `NEXT_PUBLIC_API_URL=http://localhost:8080`이 사용됨

**원인:**
- `.github/workflows/docker-build.yml`에도 `localhost:8080` 하드코딩
- `build-args` 형식 문제

**해결 방법:**
- `.github/workflows/docker-build.yml`의 `build-args` 수정
- `.github/workflows/deploy.yml`에서도 `--build-arg NEXT_PUBLIC_API_URL=http://3.37.62.82:8080` 명시적으로 전달

---

## 8. 일반적인 해결 방법

### 8.1 컨테이너 재시작
```bash
docker-compose restart backend
docker-compose restart frontend
```

### 8.2 로그 확인
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

### 8.3 컨테이너 상태 확인
```bash
docker-compose ps
docker ps -a
```

### 8.4 이미지 확인
```bash
docker images
docker images | grep board-frontend
```

### 8.5 완전 재시작
```bash
docker-compose down
docker-compose up -d
```

---

## 9. 체크리스트

배포 전 확인사항:

- [ ] `application.yml`에서 데이터베이스 호스트가 `mysql` (서비스 이름)로 설정되어 있는가?
- [ ] `WebConfig.java`에서 CORS 설정에 EC2 IP가 포함되어 있는가?
- [ ] `Dockerfile`에서 `ARG NEXT_PUBLIC_API_URL`이 정의되어 있는가?
- [ ] GitHub Actions 워크플로우에서 `build-args`가 올바르게 전달되는가?
- [ ] `.github/workflows/deploy.yml` 파일이 올바른 위치에 있는가?
- [ ] `docker-compose.yml`에서 MySQL 포트가 충돌하지 않는가?
- [ ] EC2에 필요한 환경 변수가 설정되어 있는가?

---

## 10. 참고 자료

- [Spring Boot CORS 설정](https://spring.io/guides/gs/rest-service-cors/)
- [Docker Compose 네트워킹](https://docs.docker.com/compose/networking/)
- [Next.js 환경 변수](https://nextjs.org/docs/basic-features/environment-variables)
- [GitHub Actions Docker](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images)

---

**마지막 업데이트:** 2025-12-17

