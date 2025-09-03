import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: "프로젝트 기획서 작성",
      completed: true,
      createdAt: new Date(),
    },
    { id: 2, text: "회의 준비", completed: false, createdAt: new Date() },
    { id: 3, text: "이메일 확인", completed: false, createdAt: new Date() },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
          createdAt: new Date(),
        },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div>
        <h1>할일 목록</h1>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="할 일을 입력하세요."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={addTodo}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pb-4">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            className={`${todo.completed ? "opacity-75" : ""}`}
          >
            <CardContent className="p-2">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span
                  className={
                    todo.completed ? "text-muted-foreground line-through" : ""
                  }
                >
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {todos.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">아직 할 일이 없습니다.</p>
              <p className="text-muted-foreground">
                위에서 새로운 할 일을 추가해보세요!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TodoPage;
