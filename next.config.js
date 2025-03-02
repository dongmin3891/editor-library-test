/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // 정적 HTML 내보내기 설정
    images: {
        unoptimized: true, // GitHub Pages에서는 이미지 최적화 기능을 사용할 수 없음
    },
    basePath: '/editor-library-test', // 저장소 이름으로 설정 (GitHub Pages URL 경로)
    assetPrefix: '/editor-library-test/', // 저장소 이름으로 설정
};

module.exports = nextConfig;
