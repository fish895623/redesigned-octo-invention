# Stage 1: React 앱 빌드
# 다만 사용하지 않는 변수나 함수가 존재하면 에러 발생할 수도 있다.
# 반드시 제거후 명령어 실행
FROM node:22 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Nginx로 빌드 결과 서빙
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
