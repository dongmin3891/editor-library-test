import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {/* <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority /> */}
                <div className="text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/editor"
                            className="rounded-full bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
                        >
                            퀼 에디터 사용해보기
                        </Link>
                        <Link
                            href="/toast-editor"
                            className="rounded-full bg-green-600 text-white px-6 py-3 font-medium hover:bg-green-700 transition-colors"
                        >
                            ToastUI 사용해보기
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
