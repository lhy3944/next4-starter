import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas-primary">
      <h1 className="text-6xl font-bold text-fg-primary">404</h1>
      <p className="mt-4 text-lg text-fg-secondary">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-accent-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
