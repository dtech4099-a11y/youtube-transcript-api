"use client";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="state-page">
      <h1>Something went wrong</h1>
      <p>{error.message || "The page could not be loaded."}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
