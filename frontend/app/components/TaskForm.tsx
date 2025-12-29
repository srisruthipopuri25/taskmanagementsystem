"use client";
import { Button, DatePicker, Input, Select } from "antd";
import api from "@/services/api";
import { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";

type Category = {
  id: number;
  name: string;
  is_predefined: boolean;
};

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);

  // 🔹 category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  // 🔹 fetch categories on load
  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const createTask = async () => {
    await api.post("/tasks", {
      title,
      priority,
      status: "Pending",
      due_date: dueDate ? dueDate.format("YYYY-MM-DD") : null,
      category_id: categoryId,
    });

    window.location.reload();
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Select
        value={priority}
        onChange={(value) => setPriority(value)}
        options={[
          { value: "Low", label: "Low" },
          { value: "Medium", label: "Medium" },
          { value: "High", label: "High" },
        ]}
        className="w-32"
      />

      <Select
        placeholder="Category"
        allowClear
        className="w-40"
        onChange={(value) => setCategoryId(value)}
        options={categories.map((c) => ({
          value: c.id,
          label: c.name,
        }))}
      />

      <DatePicker
        placeholder="Due date"
        onChange={(date) => setDueDate(date)}
      />

      <Button type="primary" onClick={createTask}>
        Add
      </Button>
    </div>
  );
}
