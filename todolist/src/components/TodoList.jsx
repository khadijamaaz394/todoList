import React from "react";
import { useTodos } from "../hooks/useTodos";
import { useTodoMutations } from "../hooks/useTodoMutations";

export default function TodoList() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(4);
  const [sort, setSort] = React.useState("desc");

  const { data, isLoading, isError, error, isFetching } = useTodos({ page, limit, sort });
  const { update, remove } = useTodoMutations();

  if (isLoading) return <p>Loading todos…</p>;
  if (isError) return <p>Error: {error?.message || "Failed to load."}</p>;

  const todos = data?.items || [];
  const total = data?.total ?? todos.length;
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      {/* Sort */}
      <div className="sort-controls">
        <label htmlFor="sort">Sort</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => {
            setPage(1);
            setSort(e.target.value);
          }}
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
        {isFetching && <small> refreshing…</small>}
      </div>

      {/* List */}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {todos.map((t) => (
          <li key={t.id} className="task">
            <button
              type="button"
              className="checkBtn"
              aria-pressed={!!t.completed}
              title={t.completed ? "Mark as not done" : "Mark as done"}
              onClick={() =>
                update.mutate({ id: t.id, payload: { completed: !t.completed } })
              }
            >
              {t.completed ? "✓" : "✓"}
            </button>

            <p className={t.completed ? "taskDone" : ""}>{t.title}</p>

            <button
              type="button"
              className="delBtn"
              onClick={() => remove.mutate(t.id)}
              disabled={remove.isPending}
              title="Delete"
            >
              🗑
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages} 
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
