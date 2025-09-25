import React from "react";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";
import LogoutButton from "./components/LogoutButton.jsx";
import useAuth from "./hooks/useAuth.js";

function toPossessive(raw) {
  if (!raw) return "Your";
  let name = String(raw).trim();
  if (!name) return "Your";
  if (name.includes("@")) name = name.split("@")[0];
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}

export default function Home() {
  const auth = useAuth() || {};
  const user = auth.user;

  const displayName = user?.username || user?.name || user?.email || "User";
  const heading = `${toPossessive(displayName)} Todos`; // Capital T as requested

  return (
    <div className="home">
      
      <div className="home-header">
        <h1>{heading}</h1>
        <LogoutButton />
      </div>

      <TodoForm />
      <TodoList />
    </div>
  );
}
