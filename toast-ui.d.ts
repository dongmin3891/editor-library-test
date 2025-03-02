declare module '@toast-ui/editor' {
    export class Editor {
        constructor(options: any);
        getMarkdown(): string;
        getHTML(): string;
        setMarkdown(markdown: string): void;
        on(event: string, callback: Function): void;
        destroy(): void;
    }
}

interface Window {
    toastui?: {
        Editor: any;
    };
}
