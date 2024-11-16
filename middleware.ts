import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // 지원하는 모든 로케일 목록
  locales: ['ko', 'en'],

  // 기본 로케일 설정
  defaultLocale: 'ko',
});

export const config = {
  // 모든 경로에서 로케일이 누락된 경우 로케일을 추가하기 위한 설정
  matcher: ['/((?!_next|favicon.ico|api|images|fonts|styles).*)'],
};
