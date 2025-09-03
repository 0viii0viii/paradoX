import { ipcMain } from "electron";
import { todoDatabase, Todo } from "./todo-database";
import { TODO_CHANNELS } from "./todo-channels";

export function addTodoEventListeners(): void {
  // Get all todos
  ipcMain.handle(TODO_CHANNELS.GET_ALL_TODOS, async (): Promise<Todo[]> => {
    try {
      return todoDatabase.getAllTodos();
    } catch (error) {
      console.error("Error getting all todos:", error);
      throw error;
    }
  });

  // Add new todo
  ipcMain.handle(
    TODO_CHANNELS.ADD_TODO,
    async (_, text: string): Promise<Todo> => {
      try {
        if (!text || text.trim().length === 0) {
          throw new Error("Todo text cannot be empty");
        }
        return todoDatabase.addTodo(text.trim());
      } catch (error) {
        console.error("Error adding todo:", error);
        throw error;
      }
    },
  );

  // Update todo
  ipcMain.handle(
    TODO_CHANNELS.UPDATE_TODO,
    async (
      _,
      id: number,
      updates: Partial<Pick<Todo, "text" | "completed">>,
    ): Promise<Todo | null> => {
      try {
        return todoDatabase.updateTodo(id, updates);
      } catch (error) {
        console.error("Error updating todo:", error);
        throw error;
      }
    },
  );

  // Delete todo
  ipcMain.handle(
    TODO_CHANNELS.DELETE_TODO,
    async (_, id: number): Promise<boolean> => {
      try {
        return todoDatabase.deleteTodo(id);
      } catch (error) {
        console.error("Error deleting todo:", error);
        throw error;
      }
    },
  );

  // Get todo by ID
  ipcMain.handle(
    TODO_CHANNELS.GET_TODO_BY_ID,
    async (_, id: number): Promise<Todo | null> => {
      try {
        return todoDatabase.getTodoById(id);
      } catch (error) {
        console.error("Error getting todo by ID:", error);
        throw error;
      }
    },
  );
}
