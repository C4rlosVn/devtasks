"use client";

import { useState, useEffect, FormEvent } from "react";

type Priority = "low" | "medium" | "high";
type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
};

const priorityColors: Record<Priority, string> = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-red-500",
};

function TaskCard({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded-full border-2 shrink-0 transition-colors ${
          task.completed
            ? "bg-green-500 border-green-500"
            : "border-slate-300 dark:border-slate-500"
        }`}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            task.completed
              ? "line-through text-slate-400 dark:text-slate-500"
              : "text-slate-800 dark:text-slate-100"
          }`}
        >
          {task.title}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {new Date(task.createdAt).toLocaleDateString("pt-BR")}
        </p>
      </div>
      <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} title={task.priority} />
      <button
        onClick={onDelete}
        className="text-slate-400 hover:text-red-500 transition-colors p-1"
        aria-label="Delete task"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority }),
    });
    if (res.ok) {
      const task = await res.json();
      setTasks((prev) => [task, ...prev]);
      setTitle("");
    }
  }

  async function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    if (res.ok) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    }
  }

  async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center">
        DevTasks
      </h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-center text-slate-400">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-slate-400">No tasks yet. Add one above!</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
