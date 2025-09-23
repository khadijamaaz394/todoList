import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function useAddTodo(fetchTodos) {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const addTodo = async (task) => {
    if (!task || !task.trim()) return;
    setIsLoading(true);
    setIsErrored(false);
    setIsSuccess(false);
    setError(null);

    try {
      await axiosInstance.post("/todos", { task });
      setIsSuccess(true);
      if (fetchTodos) fetchTodos(); // refresh
    } catch (err) {
      setIsErrored(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { addTodo, isLoading, isErrored, isSuccess, error };
}
