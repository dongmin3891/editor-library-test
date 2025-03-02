'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const QuillEditor = dynamic(() => import('@/components/QuillEditor'), {
    ssr: false,
    loading: () => <p className="p-4 text-gray-500">에디터 로딩 중...</p>,
});

export default function EditorPage() {
    const [content, setContent] = useState('');

    const handleEditorChange = (value: string) => {
        setContent(value);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">퀼 에디터 데모</h1>
                <Link href="/" className="text-blue-500 hover:underline">
                    홈으로 돌아가기
                </Link>
            </header>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">에디터</h2>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <QuillEditor
                        value={content}
                        onChange={handleEditorChange}
                        placeholder="여기에 입력을 시작하세요..."
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">미리보기</h2>
                <div
                    className="border border-gray-300 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-auto"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">HTML 출력</h2>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto max-h-[300px] overflow-y-auto">
                    {content}
                </pre>
            </div>
        </div>
    );
}
