import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function useDeleteTodo(fetchTodos) {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const deleteTodo = async (id) => {
    setIsLoading(true);
    setIsErrored(false);
    setIsSuccess(false);
    setError(null);

    try {
      await axiosInstance.delete(`/todos/${id}`);
      setIsSuccess(true);
      if (fetchTodos) fetchTodos();
    } catch (err) {
      setIsErrored(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteTodo, isLoading, isErrored, isSuccess, error };
}
