# 로컬에서 EC2로 배포하는 스크립트
# 사용법: .\deploy-local.ps1

param(
    [string]$EC2_HOST = "52.79.227.117",
    [string]$SSH_KEY = "$env:USERPROFILE\Desktop\AWS_KEY\lion-key.pem",
    [string]$EC2_USER = "ec2-user",
    [string]$APP_DIR = "/home/ec2-user/app",
    [string]$EC2_PATH = "~/board_demo"
)

$ErrorActionPreference = "Stop"

Write-Host "로컬 배포 시작..." -ForegroundColor Cyan
Write-Host "EC2 Host: $EC2_HOST" -ForegroundColor Yellow
Write-Host ""

# ============================================
# 1. 백엔드 JAR 빌드
# ============================================
Write-Host "[1/5] 백엔드 JAR 빌드 중..." -ForegroundColor Yellow
Push-Location board_backend

try {
    .\gradlew.bat clean bootJar --no-daemon
    if ($LASTEXITCODE -ne 0) {
        throw "Gradle 빌드 실패"
    }
} catch {
    Write-Host "❌ 백엔드 빌드 실패: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

# JAR 파일 찾기
$JAR_FILE = Get-ChildItem -Path "board_backend\build\libs" -Filter "*.jar" | 
    Where-Object { $_.Name -notlike "*-plain.jar" } | 
    Select-Object -First 1

if (-not $JAR_FILE) {
    Write-Host "❌ JAR 파일을 찾을 수 없습니다." -ForegroundColor Red
    exit 1
}

Write-Host "✅ 백엔드 빌드 완료: $($JAR_FILE.Name)" -ForegroundColor Green
Write-Host ""

# ============================================
# 2. 백엔드 JAR 전송
# ============================================
Write-Host "[2/5] 백엔드 JAR 전송 중..." -ForegroundColor Yellow

try {
    scp -i $SSH_KEY -o StrictHostKeyChecking=no $JAR_FILE.FullName "${EC2_USER}@${EC2_HOST}:${APP_DIR}/board-demo.jar"
    if ($LASTEXITCODE -ne 0) {
        throw "SCP 전송 실패"
    }
    
    # 실행 권한 부여
    ssh -i $SSH_KEY -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" "chmod +x ${APP_DIR}/board-demo.jar"
    
    Write-Host "✅ 백엔드 JAR 전송 완료" -ForegroundColor Green
} catch {
    Write-Host "❌ 백엔드 JAR 전송 실패: $_" -ForegroundColor Red
    exit 1
}

# Write-Host ""

# ============================================
# 3. 프론트엔드 이미지 빌드
# ============================================
Write-Host "[3/5] 프론트엔드 이미지 빌드 중..." -ForegroundColor Yellow
Push-Location board_frontend

try {
    docker build `
        --build-arg NEXT_PUBLIC_API_URL="http://${EC2_HOST}:8080" `
        --tag board-frontend:latest `
        --file Dockerfile `
        .
    
    if ($LASTEXITCODE -ne 0) {
        throw "Docker 빌드 실패"
    }
    
    Write-Host "✅ 프론트엔드 이미지 빌드 완료" -ForegroundColor Green
} catch {
    Write-Host "❌ 프론트엔드 이미지 빌드 실패: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Write-Host ""

# ============================================
# 4. 프론트엔드 이미지 저장 및 전송
# ============================================
Write-Host "[4/5] 프론트엔드 이미지 전송 중..." -ForegroundColor Yellow

$TAR_FILE = "$env:TEMP\frontend-image.tar"

try {
    # 이미지를 tar 파일로 저장
    docker save board-frontend:latest -o $TAR_FILE
    if ($LASTEXITCODE -ne 0) {
        throw "Docker save 실패"
    }
    
    $fileSize = (Get-Item $TAR_FILE).Length / 1MB
    Write-Host "이미지 크기: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Gray
    
    # EC2로 전송
    scp -i $SSH_KEY -o StrictHostKeyChecking=no $TAR_FILE "${EC2_USER}@${EC2_HOST}:${EC2_PATH}/"
    if ($LASTEXITCODE -ne 0) {
        throw "SCP 전송 실패"
    }
    
    Write-Host "completed" -ForegroundColor Green
} catch {
    Write-Host "error" -ForegroundColor Red
    Remove-Item $TAR_FILE -ErrorAction SilentlyContinue
    exit 1
}

# ============================================
# 5. EC2에서 이미지 로드 및 서비스 재시작
# ============================================

# ============================================
#   ec2에서 실행할 명령어어
# ============================================

# docker load < frontend-image.tar
# rm -f frontend-image.tar
# docker-compose up -d
# docker-compose ps