import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../api/todos";
import useAuth from "./useAuth";

// key chnages when user changes
const todosKey = ({ userId, page, limit, sort }) => ["todos", userId, page, limit, sort];

export function useTodos({ page = 1, limit = 4, sort = "desc" } = {}) {
  const auth = useAuth() || {};
  const userId = auth?.user?._id || auth?.user?.id || auth?.user?.userId;

  return useQuery({
    enabled: !!userId, 
    queryKey: todosKey({ userId, page, limit, sort }),
    queryFn: () => fetchTodos({ page, limit, sort }),
    placeholderData: (prev) => prev,
  });
}
