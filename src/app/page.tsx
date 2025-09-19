import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-blue-500">
      <nav className="flex bg-slate-100 w-full justify-between items-center p-4">
        <Image src="/logo-width.png" alt="Logo" width={100} height={50} />
        <Button className="bg-blue-500 flex w-32 text-white hover:bg-blue-600 duration-200 cursor-pointer">
          <Link href="/dashboard" className="flex items-center gap-2">
            <LogIn /> Log In
          </Link>
        </Button>
      </nav>
    </div>
  );
}
