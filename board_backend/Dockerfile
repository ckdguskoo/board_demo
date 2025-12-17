# 멀티 스테이지 빌드
# Stage 1: 빌드
FROM gradle:8.5-jdk21 AS build
WORKDIR /app

# Gradle wrapper 및 설정 파일 복사
COPY gradlew ./
COPY gradle/wrapper/gradle-wrapper.jar gradle/wrapper/gradle-wrapper.properties ./gradle/wrapper/
RUN chmod +x gradlew

# Gradle 캐시를 활용하기 위해 의존성 파일 먼저 복사
COPY build.gradle settings.gradle ./

# 의존성 다운로드 (캐시 활용)
RUN ./gradlew dependencies --no-daemon || true

# 소스 코드 복사
COPY src ./src

# 애플리케이션 빌드
RUN ./gradlew clean bootJar --no-daemon --stacktrace

# Stage 2: 실행 (JAR 파일만 포함)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 포트 노출
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
