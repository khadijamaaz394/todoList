import axiosInstance from "../utils/axiosInstance";


function normalizeTodo(doc = {}) {
  return {
    id: doc._id || doc.id,
    title: doc.title ?? doc.task ?? doc.text ?? "",
    completed: typeof doc.completed === "boolean" ? doc.completed : !!doc.done,
    createdAt: doc.createdAt,
  };
}

//FETCH todo
export async function fetchTodos({ page = 1, limit = 4, sort = "desc" } = {}) {
  const res = await axiosInstance.get("/api/todos", { params: { page, limit, sort } });
  const data = res.data ?? {};

  const rawItems = data.items || data.todos || data.data || [];
  const items = Array.isArray(rawItems) ? rawItems.map(normalizeTodo) : [];

  const total = typeof data.total === "number" ? data.total : items.length;
  const totalPages =
    typeof data.totalPages === "number" ? data.totalPages : Math.max(1, Math.ceil(total / (data.limit ?? limit)));

  return {
    items,
    page: data.page ?? page,
    limit: data.limit ?? limit,
    total,
    totalPages,
  };
}

//ADD todo
export async function createTodo(input) {
  
  const task =
    typeof input === "string"
      ? input
      : input?.task ?? input?.title ?? input?.text ?? "";

  const res = await axiosInstance.post("/api/todos", { task });
  return normalizeTodo(res.data);
}

//UPD todo
export async function updateTodo(id, payload = {}) {
  const patch = {};
  if ("completed" in payload) patch.done = !!payload.completed;
  if (typeof payload.title === "string") patch.task = payload.title;
  if (typeof payload.task === "string") patch.task = payload.task;
  if (typeof payload.text === "string") patch.task = payload.text;

  try {
    const res = await axiosInstance.patch(`/api/todos/${id}`, patch);
    return normalizeTodo(res.data);
  } catch (err) {
    const code = err?.response?.status;
    if (code === 404 || code === 405) {
      
      const putBody = { ...patch };
      if ("done" in putBody && !("completed" in putBody)) {
        putBody.completed = putBody.done;
      }
      const res = await axiosInstance.put(`/api/todos/${id}`, putBody);
      return normalizeTodo(res.data);
    }
    throw err;
  }
}

// DEL todo
export async function deleteTodo(id) {
  await axiosInstance.delete(`/api/todos/${id}`);
  return { ok: true };
}
