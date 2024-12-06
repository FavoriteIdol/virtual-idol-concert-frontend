FROM node:18-alpine

WORKDIR /app

# Corepack 활성화 및 Yarn 버전 설정
RUN corepack enable && corepack prepare yarn@4.4.0 --activate

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# 의존성 설치
RUN yarn install --immutable

# 소스 코드 복사
COPY . .

# 빌드
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
