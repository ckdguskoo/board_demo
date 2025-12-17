# Stage 1: 빌드
FROM node:20-alpine AS builder
WORKDIR /app

# 패키지 파일 복사
COPY package.json package-lock.json* ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# Next.js 빌드
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: 프로덕션 실행
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 보안을 위한 non-root 사용자 생성
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 필요한 파일 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
