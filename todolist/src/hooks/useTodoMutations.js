import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, updateTodo, deleteTodo } from "../api/todos";

export function useTodoMutations() {
  const qc = useQueryClient();

  const invalidateTodos = () => {
    qc.invalidateQueries({ queryKey: ["todos"] });
  };

  const create = useMutation({
    mutationFn: (payload) => createTodo(payload),
    onSuccess: () => invalidateTodos(),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }) => updateTodo(id, payload),
    onSuccess: () => invalidateTodos(),
  });

  const remove = useMutation({
    mutationFn: (id) => deleteTodo(id),
    onSuccess: () => invalidateTodos(),
  });

  return { create, update, remove };
}
