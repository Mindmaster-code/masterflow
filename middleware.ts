export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/step1/:path*', '/step2/:path*', '/step3/:path*', '/step3-swot/:path*', '/step4/:path*', '/step5/:path*', '/resumo/:path*', '/admin/:path*'],
};
