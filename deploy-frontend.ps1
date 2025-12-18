# 프론트엔드 Docker 이미지 빌드 및 EC2 전송 스크립트
# 사용법: .\deploy-frontend.ps1 -EC2Host "13.124.84.86" -SSHKey "C:\path\to\key.pem" -EC2User "ec2-user"

param(
    [Parameter(Mandatory=$true)]
    [string]$EC2Host,
    
    [Parameter(Mandatory=$true)]
    [string]$SSHKey,
    
    [Parameter(Mandatory=$false)]
    [string]$EC2User = "ec2-user",
    
    [Parameter(Mandatory=$false)]
    [string]$EC2Path = "~/board_demo"
)

$ErrorActionPreference = "Stop"

Write-Host "🔨 프론트엔드 Docker 이미지 빌드 시작..." -ForegroundColor Cyan

# 1. Docker 이미지 빌드
Write-Host "`n[1/4] Docker 이미지 빌드 중..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\board_frontend"

docker build `
    --build-arg NEXT_PUBLIC_API_URL=http://$EC2Host:8080 `
    --tag board-frontend:latest `
    --file Dockerfile `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker 이미지 빌드 실패" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker 이미지 빌드 완료" -ForegroundColor Green

# 2. 이미지를 tar 파일로 저장
Write-Host "`n[2/4] 이미지를 tar 파일로 저장 중..." -ForegroundColor Yellow
Set-Location -Path $PSScriptRoot

$tarFile = "$env:TEMP\frontend-image.tar"
docker save board-frontend:latest -o $tarFile

if (-not (Test-Path $tarFile)) {
    Write-Host "❌ tar 파일 생성 실패" -ForegroundColor Red
    exit 1
}

$fileSize = (Get-Item $tarFile).Length / 1MB
Write-Host "✅ tar 파일 생성 완료 (크기: $([math]::Round($fileSize, 2)) MB)" -ForegroundColor Green

# 3. tar 파일 압축
Write-Host "`n[3/4] tar 파일 압축 중..." -ForegroundColor Yellow
$gzFile = "$env:TEMP\frontend-image.tar.gz"

# PowerShell에서 gzip 압축
$inputStream = [System.IO.File]::OpenRead($tarFile)
$outputStream = [System.IO.File]::Create($gzFile)
$gzipStream = New-Object System.IO.Compression.GzipStream($outputStream, [System.IO.Compression.CompressionMode]::Compress)

$inputStream.CopyTo($gzipStream)
$gzipStream.Close()
$outputStream.Close()
$inputStream.Close()

$gzFileSize = (Get-Item $gzFile).Length / 1MB
Write-Host "✅ 압축 완료 (크기: $([math]::Round($gzFileSize, 2)) MB)" -ForegroundColor Green

# 4. EC2로 전송
Write-Host "`n[4/4] EC2로 이미지 전송 중..." -ForegroundColor Yellow

# SCP로 전송 (PowerShell에서 scp 사용)
$scpCommand = "scp -i `"$SSHKey`" -o StrictHostKeyChecking=no `"$gzFile`" ${EC2User}@${EC2Host}:${EC2Path}/"
Invoke-Expression $scpCommand

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ EC2로 전송 실패" -ForegroundColor Red
    Remove-Item $tarFile -ErrorAction SilentlyContinue
    Remove-Item $gzFile -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "✅ EC2로 전송 완료" -ForegroundColor Green

# 5. EC2에서 이미지 로드
Write-Host "`n[5/5] EC2에서 이미지 로드 중..." -ForegroundColor Yellow

$sshCommand = @"
cd $EC2Path
gunzip -c frontend-image.tar.gz | docker load
rm -f frontend-image.tar.gz
docker images | grep board-frontend
"@

$sshCommand | ssh -i $SSHKey -o StrictHostKeyChecking=no ${EC2User}@${EC2Host}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ EC2에서 이미지 로드 실패" -ForegroundColor Red
    Remove-Item $tarFile -ErrorAction SilentlyContinue
    Remove-Item $gzFile -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "✅ EC2에서 이미지 로드 완료" -ForegroundColor Green

# 6. 정리
Write-Host "`n🧹 임시 파일 정리 중..." -ForegroundColor Yellow
Remove-Item $tarFile -ErrorAction SilentlyContinue
Remove-Item $gzFile -ErrorAction SilentlyContinue

Write-Host "`n✅ 프론트엔드 이미지 배포 완료!" -ForegroundColor Green
Write-Host "`n다음 명령어로 EC2에서 컨테이너를 재시작하세요:" -ForegroundColor Cyan
Write-Host "ssh -i `"$SSHKey`" ${EC2User}@${EC2Host} 'cd $EC2Path && docker-compose restart frontend'" -ForegroundColor White




