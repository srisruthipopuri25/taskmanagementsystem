"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input, List, Popconfirm, message } from "antd";
import api from "@/services/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async () => {
    if (!name.trim()) {
      message.warning("Category name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/categories?name=${name}`);
      setName("");
      message.success("Category created");
      fetchCategories();
    } catch (err: any) {
      message.error(err.response?.data?.detail || "Error creating category");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      message.success("Category deleted");
      fetchCategories();
    } catch {
      message.error("Cannot delete category");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card title="Manage Categories" className="mb-6 shadow-sm rounded-xl">
        <div className="flex gap-2">
          <Input
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="primary" onClick={createCategory} loading={loading}>
            Add
          </Button>
        </div>
      </Card>

      <Card title="Your Categories" className="shadow-sm rounded-xl">
        <List
          dataSource={categories}
          locale={{ emptyText: "No categories found" }}
          renderItem={(item) => (
            <List.Item
              actions={[
                !item.is_predefined && (
                  <Popconfirm
                    title="Delete this category?"
                    onConfirm={() => deleteCategory(item.id)}
                  >
                    <Button danger size="small">
                      Delete
                    </Button>
                  </Popconfirm>
                ),
              ]}
            >
              <span>
                {item.name}
                {item.is_predefined && (
                  <span className="text-gray-400 ml-2">(default)</span>
                )}
              </span>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
