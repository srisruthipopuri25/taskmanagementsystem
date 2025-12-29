"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Card, Select, Pagination, Tag, Button } from "antd";
import _ from "lodash";
import dayjs from "dayjs";

const PAGE_SIZE = 5;

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>();
  const [priorityFilter, setPriorityFilter] = useState<string>();
  const [categoryFilter, setCategoryFilter] = useState<string>();
  const [page, setPage] = useState(1);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editPriority, setEditPriority] = useState<string>();
  const [editCategory, setEditCategory] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get("/tasks/");
    setTasks(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const startEdit = (task: any) => {
    setEditingTaskId(task.id);
    setEditPriority(task.priority);
    setEditCategory(task.category?.id || null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditPriority(undefined);
    setEditCategory(null);
  };

  const saveEdit = async (taskId: number) => {
    await api.put(`/tasks/${taskId}`, {
      priority: editPriority,
      category_id: editCategory,
    });
    cancelEdit();
    fetchTasks();
  };

  let filteredTasks = tasks;

  if (statusFilter) {
    filteredTasks = _.filter(filteredTasks, { status: statusFilter });
  }

  if (priorityFilter) {
    filteredTasks = _.filter(filteredTasks, { priority: priorityFilter });
  }

  if (categoryFilter) {
    filteredTasks = _.filter(
      filteredTasks,
      (task) => task.category?.id === Number(categoryFilter)
    );
  }

  const priorityOrder: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  filteredTasks = _.orderBy(
    filteredTasks,
    [
      (task) => priorityOrder[task.priority] || 0,
      (task) => task.due_date || "",
    ],
    ["desc", "asc"]
  );

  const paginatedTasks = _.slice(
    filteredTasks,
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Select
          allowClear
          placeholder="Filter by Status"
          className="w-52"
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          options={[
            { value: "Pending", label: "Pending" },
            { value: "In Progress", label: "In Progress" },
            { value: "Completed", label: "Completed" },
          ]}
        />

        <Select
          allowClear
          placeholder="Filter by Priority"
          className="w-52"
          onChange={(value) => {
            setPriorityFilter(value);
            setPage(1);
          }}
          options={[
            { value: "Low", label: "Low" },
            { value: "Medium", label: "Medium" },
            { value: "High", label: "High" },
          ]}
        />

        <Select
          allowClear
          placeholder="Filter by Category"
          className="w-52"
          onChange={(value) => {
            setCategoryFilter(value);
            setPage(1);
          }}
          options={categories.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        />
      </div>

      {/* Task List */}
      {paginatedTasks.map((task) => (
        <Card
          key={task.id}
          className="mb-3 rounded-xl shadow-sm cursor-pointer"
          onClick={() => startEdit(task)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
            </div>

            <div className="flex flex-col gap-1 items-end">
              {editingTaskId === task.id ? (
                <>
                  <Select
                    value={editPriority}
                    className="w-32"
                    onChange={setEditPriority}
                    options={[
                      { value: "Low", label: "Low" },
                      { value: "Medium", label: "Medium" },
                      { value: "High", label: "High" },
                    ]}
                  />

                  <Select
                    value={editCategory}
                    className="w-40"
                    placeholder="Category"
                    onChange={setEditCategory}
                    options={categories.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                  />

                  <div className="flex gap-2 mt-1">
                    <Button size="small" type="primary" onClick={() => saveEdit(task.id)}>
                      Save
                    </Button>
                    <Button size="small" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Tag
                    color={
                      task.status === "Completed"
                        ? "green"
                        : task.status === "In Progress"
                        ? "blue"
                        : "orange"
                    }
                  >
                    {task.status}
                  </Tag>

                  <Tag
                    color={
                      task.priority === "High"
                        ? "red"
                        : task.priority === "Medium"
                        ? "blue"
                        : "gray"
                    }
                  >
                    {task.priority}
                  </Tag>

                  {task.due_date && (
                    <span className="text-xs text-gray-500">
                      {dayjs(task.due_date).format("DD/MM/YYYY")}
                    </span>
                  )}

                  {task.category?.name && (
                    <Tag color="purple">{task.category.name}</Tag>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      ))}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={filteredTasks.length}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
