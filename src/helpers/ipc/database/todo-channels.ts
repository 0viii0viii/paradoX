export const TODO_CHANNELS = {
  GET_ALL_TODOS: "todo:get-all",
  ADD_TODO: "todo:add",
  UPDATE_TODO: "todo:update",
  DELETE_TODO: "todo:delete",
  GET_TODO_BY_ID: "todo:get-by-id",
} as const;

export type TodoChannel = (typeof TODO_CHANNELS)[keyof typeof TODO_CHANNELS];
