import { contextBridge, ipcRenderer } from "electron";
import { TODO_CHANNELS } from "./todo-channels";
import { Todo } from "./todo-database";

export interface TodoContext {
  getAllTodos: () => Promise<Todo[]>;
  addTodo: (text: string) => Promise<Todo>;
  updateTodo: (
    id: number,
    updates: Partial<Pick<Todo, "text" | "completed">>,
  ) => Promise<Todo | null>;
  deleteTodo: (id: number) => Promise<boolean>;
  getTodoById: (id: number) => Promise<Todo | null>;
}

export function exposeTodoContext(): void {
  const todoContext: TodoContext = {
    getAllTodos: () => ipcRenderer.invoke(TODO_CHANNELS.GET_ALL_TODOS),
    addTodo: (text: string) => ipcRenderer.invoke(TODO_CHANNELS.ADD_TODO, text),
    updateTodo: (
      id: number,
      updates: Partial<Pick<Todo, "text" | "completed">>,
    ) => ipcRenderer.invoke(TODO_CHANNELS.UPDATE_TODO, id, updates),
    deleteTodo: (id: number) =>
      ipcRenderer.invoke(TODO_CHANNELS.DELETE_TODO, id),
    getTodoById: (id: number) =>
      ipcRenderer.invoke(TODO_CHANNELS.GET_TODO_BY_ID, id),
  };

  contextBridge.exposeInMainWorld("todoAPI", todoContext);
}
