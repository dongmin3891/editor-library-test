'use client';

import { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, placeholder = 'Write something...' }) => {
    const quillRef = useRef<any>(null); // Quill 인스턴스 저장
    const [draggedImage, setDraggedImage] = useState<string | null>(null);

    useEffect(() => {
        const quillEditor = document.querySelector('.ql-editor') as HTMLElement;

        if (quillEditor) {
            quillEditor.addEventListener('dragstart', handleDragStart);
            quillEditor.addEventListener('dragover', handleDragOver);
            quillEditor.addEventListener('drop', handleDrop);
        }

        return () => {
            if (quillEditor) {
                quillEditor.removeEventListener('dragstart', handleDragStart);
                quillEditor.removeEventListener('dragover', handleDragOver);
                quillEditor.removeEventListener('drop', handleDrop);
            }
        };
    }, []);

    // 이미지 드래그 시작 핸들러 (기존 이미지 삭제)
    const handleDragStart = (event: DragEvent) => {
        if (event.target instanceof HTMLImageElement) {
            event.dataTransfer?.setData('text/plain', ''); // 필수: 드래그 정상 동작
            setDraggedImage(event.target.src);
            event.target.style.opacity = '0.5'; // 반투명 효과 추가
        }
    };

    // 드래그 중 마우스 위치 감지 (커서 위치 업데이트)
    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();

        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection();
        if (range) {
            quill.setSelection(range.index); // 마우스가 위치한 곳에 Selection 업데이트
        }
    };

    // 드롭 후 이미지 삽입 (사용자가 원하는 위치에 삽입됨)
    const handleDrop = (event: DragEvent) => {
        event.preventDefault();

        const quill = quillRef.current?.getEditor();
        if (!quill || !draggedImage) return;

        // 마우스 커서 위치 가져오기
        const range = quill.getSelection(true);
        if (!range) return;

        // 기존 이미지 삭제 (중복 방지)
        document.querySelectorAll(`img[src="${draggedImage}"]`).forEach((img) => img.remove());

        // 새로운 위치에 이미지 삽입
        quill.insertEmbed(range.index, 'image', draggedImage);

        // 드래그 상태 초기화
        setDraggedImage(null);
        onChange(quill.root.innerHTML);
    };

    const modules = {
        imageFormats: {}, // 이미지 포맷 모듈 활성화
        imageActions: {}, // 이미지 액션 모듈 활성화
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ color: [] }, { background: [] }],
                [{ align: [] }], // 정렬 옵션 추가
                ['link', 'image'],
                ['clean'],
            ],
        },
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'link',
        'image',
        'color',
        'background',
        'align',
        'float', // 이미지 정렬 및 float 포맷 추가
        'width',
        'height',
        'left',
        'right',
        'center',
    ];

    return (
        <div className="w-full">
            <style jsx global>{`
                .ql-editor {
                    min-height: 200px;
                }
                .ql-editor img {
                    max-width: 100%;
                    height: auto;
                    cursor: grab; /* 드래그 가능 표시 */
                }
            `}</style>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                    ref={quillRef} // Quill 인스턴스를 useRef로 저장
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                />
            </div>
            {/* <div className="mt-2 text-sm text-gray-500">* 이미지를 드래그하여 원하는 위치에 이동할 수 있습니다.</div> */}
        </div>
    );
};

export default QuillEditor;
