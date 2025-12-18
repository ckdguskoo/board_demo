# EC2 IP 변경 가이드

EC2 인스턴스를 재시작하거나 새로 생성하면 IP 주소가 변경될 수 있습니다. 이 문서는 IP 주소 변경 시 수정해야 하는 파일들을 안내합니다.

---

## 📋 변경해야 하는 파일 목록

다음 3개 파일에서 IP 주소를 변경해야 합니다:

1. **`.github/workflows/deploy.yml`** (1곳)
2. **`.github/workflows/docker-build.yml`** (1곳)
3. **`board_backend/src/main/java/org/example/board_demo/config/WebConfig.java`** (1곳)

---

## 🔍 변경 위치 상세

### 1. `.github/workflows/deploy.yml`

**위치:** 약 42번째 줄

**현재 코드:**
```yaml
# ⚠️ EC2 IP 변경 시 여기 수정 필요: 13.124.84.86를 새 IP로 변경
docker buildx build \
  --build-arg NEXT_PUBLIC_API_URL=http://13.124.84.86:8080 \
```

**변경 방법:**
- `13.124.84.86`를 새 EC2 IP로 변경

**예시:**
```yaml
--build-arg NEXT_PUBLIC_API_URL=http://새로운IP:8080 \
```

---

### 2. `.github/workflows/docker-build.yml`

**위치:** 약 86번째 줄

**현재 코드:**
```yaml
build-args: |
  # ⚠️ EC2 IP 변경 시 여기 수정 필요: 13.124.84.86를 새 IP로 변경
  NEXT_PUBLIC_API_URL=http://13.124.84.86:8080
```

**변경 방법:**
- `13.124.84.86`를 새 EC2 IP로 변경

**예시:**
```yaml
NEXT_PUBLIC_API_URL=http://새로운IP:8080
```

---

### 3. `board_backend/src/main/java/org/example/board_demo/config/WebConfig.java`

**위치:** 약 15번째 줄

**현재 코드:**
```java
// ⚠️ EC2 IP 변경 시 여기 수정 필요: 13.124.84.86를 새 IP로 변경
private static final String EC2_IP = "13.124.84.86";
```

**변경 방법:**
- `EC2_IP` 상수의 값을 새 EC2 IP로 변경

**예시:**
```java
private static final String EC2_IP = "새로운IP";
```

---

## 📝 변경 절차

### 1단계: 새 EC2 IP 확인

EC2 인스턴스의 퍼블릭 IP 주소를 확인합니다.

### 2단계: 파일 수정

위 3개 파일에서 `13.124.84.86`를 모두 새 IP로 변경합니다.

**빠른 검색 방법:**
- IDE에서 `13.124.84.86`로 전체 검색 (Ctrl+Shift+F)
- 모든 파일에서 일괄 변경

### 3단계: 변경사항 커밋 및 푸시

```bash
git add .
git commit -m "Update EC2 IP to [새로운IP]"
git push
```

### 4단계: GitHub Actions 확인

- GitHub 저장소 → Actions 탭
- "Deploy to EC2" 워크플로우가 자동 실행됨
- 배포 완료 확인

### 5단계: 백엔드 재배포 (필요시)

백엔드 코드를 변경했다면 JAR 파일을 다시 빌드하고 배포해야 합니다:

```bash
# 로컬에서
cd board_backend
./gradlew clean bootJar --no-daemon

# EC2로 전송
scp -i "SSH_KEY_PATH" build/libs/board_demo-0.0.1-SNAPSHOT.jar ec2-user@새로운IP:/home/ec2-user/app/board-demo.jar

# EC2에서
cd ~/board_demo
docker-compose restart backend
```

---

## 🔍 IP 주소 검색 명령어

모든 파일에서 IP 주소를 검색하려면:

**PowerShell:**
```powershell
Select-String -Path "**/*.yml","**/*.java" -Pattern "13\.124\.84\.86" -Recurse
```

**Bash/Git Bash:**
```bash
grep -r "13.124.84.86" . --include="*.yml" --include="*.java"
```

---

## ⚠️ 주의사항

1. **포트 번호는 변경하지 마세요**
   - 백엔드: `:8080`
   - 프론트엔드: `:3000`

2. **GitHub Secrets 확인**
   - `EC2_HOST` secret도 새 IP로 업데이트해야 할 수 있습니다
   - GitHub 저장소 → Settings → Secrets and variables → Actions

3. **CORS 설정**
   - `WebConfig.java`에서 IP를 변경하면 자동으로 CORS 설정이 업데이트됩니다

4. **로컬 개발 환경**
   - `localhost:3000`은 그대로 유지 (로컬 개발용)

---

## 📌 현재 IP 주소

**현재 하드코딩된 IP:** `13.124.84.86`

**변경 예정 IP:** (변경 시 여기에 기록)

---

## 💡 팁

### Elastic IP 사용 (권장)

EC2 인스턴스에 Elastic IP를 할당하면 IP 주소가 변경되지 않습니다.

1. AWS 콘솔 → EC2 → Elastic IPs
2. "Allocate Elastic IP address" 클릭
3. EC2 인스턴스에 연결

이렇게 하면 인스턴스를 재시작해도 IP가 변경되지 않습니다.

---

**마지막 업데이트:** 2025-12-17

