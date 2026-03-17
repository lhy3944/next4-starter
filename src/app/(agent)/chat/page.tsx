import { Header } from "@/components/layout/Header";
import { ChatLayout } from "@/components/layout/ChatLayout";

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header showLayoutToggle />
      <ChatLayout />
    </div>
  );
}
