"use client";

import { useEffect, useState } from "react";
import { Card, Input, Button, message } from "antd";
import api from "@/services/api";

type UserResponse = {
  id: number;
  email: string;
  full_name?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch profile
  useEffect(() => {
    api.get<UserResponse>("/users/me").then((res) => {
      setUser(res.data);
      setFullName(res.data.full_name ?? "");
    });
  }, []);

  // Update profile
  const handleUpdate = async () => {
    try {
      setLoading(true);
      await api.put("/users/me", null, {
        params: { full_name: fullName },
      });
      message.success("Profile updated successfully");
    } catch {
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="max-w-lg rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      <div className="space-y-4">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input value={user.email} disabled />
        </div>

        {/* Full name (editable) */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <Button type="primary" loading={loading} onClick={handleUpdate}>
          Save Changes
        </Button>
      </div>
    </Card>
  );
}
