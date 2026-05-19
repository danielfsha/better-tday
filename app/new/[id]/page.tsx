"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  useEffect(() => {
    // Optionally, fetch chat session data here using params.id
  }, [params.id]);
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-xl font-bold mb-4">Chat Session: {params.id}</h1>
      {/* Render chat UI for this session here */}
    </div>
  );
}
