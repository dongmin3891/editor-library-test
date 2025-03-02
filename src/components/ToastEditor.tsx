'use client';

import { useEffect, useRef, useState } from 'react';

interface ToastEditorProps {
    value: string;
    onChange: (markdown: string, html: string) => void;
    placeholder?: string;
}

export default function ToastEditor({ value, onChange, placeholder = '내용을 입력하세요...' }: ToastEditorProps) {
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEditor = async () => {
            try {
                const loadStylesheet = (href: string) => {
                    if (!document.querySelector(`link[href="${href}"]`)) {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = href;
                        document.head.appendChild(link);
                    }
                };

                try {
                    loadStylesheet('https://uicdn.toast.com/editor/latest/toastui-editor.min.css');
                    loadStylesheet('https://uicdn.toast.com/editor/latest/theme/toastui-editor-dark.min.css');
                } catch (styleError) {
                    console.warn('스타일시트 로딩 실패:', styleError);
                }

                let Editor;
                try {
                    const module = await import('@toast-ui/editor');
                    Editor = module.Editor;
                } catch (importError) {
                    console.warn('로컬 모듈 로딩 실패:', importError);

                    if (!window.toastui?.Editor) {
                        const script = document.createElement('script');
                        script.src = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js';
                        script.async = true;

                        const loadPromise = new Promise((resolve, reject) => {
                            script.onload = resolve;
                            script.onerror = reject;
                        });

                        document.head.appendChild(script);
                        await loadPromise;
                    }

                    Editor = (window as any).toastui?.Editor;
                }

                if (!Editor) {
                    throw new Error('ToastUI 에디터를 로드할 수 없습니다.');
                }

                if (containerRef.current && !editorRef.current) {
                    const editor = new Editor({
                        el: containerRef.current,
                        initialValue: value,
                        previewStyle: 'vertical',
                        height: '400px',
                        initialEditType: 'wysiwyg',
                        placeholder,
                        toolbarItems: [
                            ['heading', 'bold', 'italic', 'strike'],
                            ['hr', 'quote'],
                            ['ul', 'ol', 'task', 'indent', 'outdent'],
                            ['table', 'image', 'link'],
                            ['code', 'codeblock'],
                        ],
                    });

                    editor.on('change', () => {
                        const markdown = editor.getMarkdown();
                        const html = editor.getHTML();
                        onChange(markdown, html);
                    });

                    editorRef.current = editor;

                    // 📌 WYSIWYG 모드에서 이미지 드래그 & 드롭 가능하도록 설정
                    setTimeout(() => enableImageDrag(), 1000);
                }
            } catch (error) {
                console.error('ToastUI 에디터 로딩 실패:', error);
                setError('ToastUI 에디터를 로드하는 중 오류가 발생했습니다.');
            }
        };

        loadEditor();

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    // 📌 외부에서 value가 변경되었을 때 에디터 내용 업데이트
    useEffect(() => {
        if (editorRef.current && editorRef.current.getMarkdown() !== value) {
            editorRef.current.setMarkdown(value);
        }
    }, [value]);

    // 📌 이미지 드래그 & 드롭 기능 활성화
    const enableImageDrag = () => {
        const editorContent = document.querySelector('.toastui-editor-contents') as HTMLElement;
        if (!editorContent) return;

        let draggedImg: HTMLImageElement | null = null;

        // 📌 이미지 드래그 시작
        editorContent.addEventListener('dragstart', (event) => {
            if (event.target instanceof HTMLImageElement) {
                draggedImg = event.target;
                event.dataTransfer?.setData('text/html', event.target.outerHTML);
                event.target.style.opacity = '0.5';
            }
        });

        // 📌 드래그 중 (마우스 따라 이동)
        editorContent.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        // 📌 드롭 시 새로운 위치에 이미지 삽입
        editorContent.addEventListener('drop', (event) => {
            event.preventDefault();
            if (!draggedImg) return;

            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const imgElement = document.createElement('img');
                imgElement.src = draggedImg.src;
                imgElement.style.maxWidth = '100%';
                imgElement.style.cursor = 'grab';
                range.insertNode(imgElement);
                draggedImg.remove(); // 기존 이미지 삭제
            }

            draggedImg = null;
        });
    };

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 mb-2">에디터 로딩 실패</h3>
                <p className="text-red-600">{error}</p>
                <p className="mt-2 text-red-600">다음 명령어로 설치해 보세요:</p>
                <pre className="mt-2 p-3 bg-gray-800 text-white rounded overflow-x-auto">
                    npm install @toast-ui/editor --legacy-peer-deps
                </pre>
            </div>
        );
    }

    return (
        <>
            <style jsx global>{`
                .toastui-editor-defaultUI {
                    height: 400px !important;
                }
                .toastui-editor-defaultUI-toolbar {
                    flex-shrink: 0;
                }
                .toastui-editor-main {
                    height: calc(400px - 41px) !important;
                }
            `}</style>
            <div ref={containerRef} />
        </>
    );
}
