"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Card, Select, Pagination, Tag } from "antd";
import _ from "lodash";
import dayjs from "dayjs";

const PAGE_SIZE = 5;
const { Option } = Select;

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>();
  const [priorityFilter, setPriorityFilter] = useState<string>();
  const [categoryFilter, setCategoryFilter] = useState<string>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  // Filtering
  let filteredTasks = tasks;
  if (statusFilter)
    filteredTasks = _.filter(filteredTasks, { status: statusFilter });
  if (priorityFilter)
    filteredTasks = _.filter(filteredTasks, { priority: priorityFilter });
  if (categoryFilter)
    filteredTasks = _.filter(
      filteredTasks,
      (t) => t.category?.name === categoryFilter
    );

  // Sorting by priority (High > Medium > Low) and due_date ascending
  const priorityOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

  filteredTasks = _.orderBy(
    filteredTasks,
    [(t) => priorityOrder[t.priority as string] || 0, (t) => t.due_date || ""],
    ["desc", "asc"]
  );

  // Pagination
  const paginatedTasks = _.slice(
    filteredTasks,
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Collect unique categories for filter dropdown
  const categories = _.uniqBy(
    tasks.map((t) => t.category?.name).filter(Boolean),
    String
  );

  return (
    <div className="p-4">
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
          options={categories.map((c) => ({ value: c, label: c }))}
        />
      </div>

      {paginatedTasks.map((task) => (
        <Card key={task.id} className="mb-3 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
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
            </div>
          </div>
        </Card>
      ))}

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
