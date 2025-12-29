"use client";
import { Button, Card, Input, Divider } from "antd";
import { useState, useEffect } from "react";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="Login" className="w-96">
        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <Input.Password
          placeholder="Password"
          className="mt-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="primary" block className="mt-4" onClick={handleLogin}>
          Login
        </Button>

        <Divider />

        {/* 👇 Register Redirect */}
        <div className="text-center">
          <span className="text-gray-500">New user?</span>
          <Button
            type="link"
            className="pl-1"
            onClick={() => router.push("/register")}
          >
            Register here
          </Button>
        </div>
      </Card>
    </div>
  );
}
