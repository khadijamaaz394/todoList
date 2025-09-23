import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function useUpdateTodo(fetchTodos) {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const updateTodo = async (id, done) => {
    setIsLoading(true);
    setIsErrored(false);
    setIsSuccess(false);
    setError(null);

    try {
      await axiosInstance.put(`/todos/${id}`, { done: !done });
      setIsSuccess(true);
      if (fetchTodos) fetchTodos();
    } catch (err) {
      setIsErrored(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTodo, isLoading, isErrored, isSuccess, error };
}
