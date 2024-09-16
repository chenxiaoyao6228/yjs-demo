import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, text, completed, onToggle, onDelete }) => {
  return (
    <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-800 shadow-sm">
      <Checkbox
        id={`todo-${id}`}
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className={cn(
          "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600",
          completed ? "bg-primary border-primary" : ""
        )}
      />
      <label
        htmlFor={`todo-${id}`}
        className={cn(
          "flex-grow cursor-pointer",
          completed ? "line-through text-gray-500" : "text-gray-300"
        )}
      >
        {text}
      </label>
      <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TodoItem;