// app/store/page.tsx
import LogoutButton from "@/components/auth/LogoutButton";
export default function StorePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold">🛒 Store - 任务商城占位页</h1>
       <LogoutButton />
    </div>
   
  );
}
