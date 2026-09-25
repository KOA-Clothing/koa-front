"use client";

interface Props {
  error: Error;
}

export default function Error({ error }: Props) {
  const message =
    error instanceof Error ? error.message : "An unknown error occurred.";

  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-destructive"
    >
      {message}
    </div>
  );
}
