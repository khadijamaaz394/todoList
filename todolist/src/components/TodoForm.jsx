import React from "react";
import { useTodoMutations } from "../hooks/useTodoMutations";

export default function TodoForm() {
  const { create } = useTodoMutations();
  const [title, setTitle] = React.useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;
    create.mutate({ task: value, completed: false }, { onSuccess: () => setTitle("") });
  };

  return (
    <form onSubmit={onSubmit} className="create_form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a todo…"
      />
      <button type="submit" disabled={create.isPending}>
        {create.isPending ? "Adding…" : "Add"}
      </button>
    </form>
  );
}
