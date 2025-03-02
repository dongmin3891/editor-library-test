'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 에러 메시지를 표시하는 컴포넌트
const ErrorMessage = () => (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 mb-2">에디터 로딩 실패</h3>
        <p className="text-red-600">ToastUI 에디터를 로드하는 중 오류가 발생했습니다. 다음 명령어로 설치해 주세요:</p>
        <pre className="mt-2 p-3 bg-gray-800 text-white rounded overflow-x-auto">
            npm install @toast-ui/editor --legacy-peer-deps
        </pre>
        <p className="mt-2 text-red-600">
            또는 Quill 에디터와 ToastUI 에디터를 별도의 프로젝트에서 사용하는 것이 좋습니다.
        </p>
    </div>
);

// 동적으로 ToastEditor 컴포넌트 로드 시도
const ToastEditor = dynamic(
    () =>
        import('@/components/ToastEditor').catch((err) => {
            console.error('ToastUI 에디터 로딩 실패:', err);
            return () => <ErrorMessage />;
        }),
    {
        ssr: false,
        loading: () => <p className="p-4 text-gray-500">에디터 로딩 중...</p>,
    }
);

export default function ToastEditorPage() {
    const [content, setContent] = useState('');
    const [htmlContent, setHtmlContent] = useState('');

    const handleEditorChange = (markdown: string, html: string) => {
        setContent(markdown);
        setHtmlContent(html);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">ToastUI 에디터 데모</h1>
                <Link href="/" className="text-blue-500 hover:underline">
                    홈으로 돌아가기
                </Link>
            </header>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">에디터</h2>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <ToastEditor
                        value={content}
                        onChange={handleEditorChange}
                        placeholder="여기에 입력을 시작하세요..."
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">미리보기</h2>
                <div
                    className="border border-gray-300 rounded-lg p-4 min-h-[200px]"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">마크다운 출력</h2>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">{content}</pre>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">HTML 출력</h2>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">{htmlContent}</pre>
            </div>
        </div>
    );
}
