"use client";

import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await api.post("/auth/logout");
    router.push("/login");
  };

  return (
    <nav
      className="
        sticky top-0 z-50
        flex items-center justify-between
        px-6 py-4
        bg-white
        border-b
        shadow-sm
      "
    >
      <div className="flex gap-6">
        <Link href="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>

        <Link href="/dashboard" className="hover:text-blue-600">
          Tasks
        </Link>

       
        <Link href="/categories" className="hover:text-blue-600">
          Categories
        </Link>

        <Link href="/profile" className="hover:text-blue-600">
          Profile
        </Link>
      </div>

      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
         Task Manager
      </h1>

      <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Button>
    </nav>
  );
}
