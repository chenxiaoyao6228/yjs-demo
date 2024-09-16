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
    <div className="flex items-center space-x-2 p-2 rounded-md bg-white shadow-sm">
      <Checkbox
        id={`todo-${id}`}
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className={cn(
          "border-2",
          completed ? "border-green-500 bg-green-500" : "border-gray-300"
        )}
      />
      <label
        htmlFor={`todo-${id}`}
        className={cn(
          "flex-grow cursor-pointer",
          completed ? "line-through text-gray-500" : "text-gray-700"
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