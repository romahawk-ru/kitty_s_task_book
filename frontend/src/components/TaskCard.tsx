import React from 'react'
import { useDrag } from 'react-dnd'
import { Task } from '../types'
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline'

interface TaskCardProps {
  task: Task
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const priorityColors = {
    LOW: 'bg-blue-100 text-blue-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  }

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg shadow-sm border p-4 mb-3 cursor-move transition-transform hover:shadow-md ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        {task.priority && (
          <span className={`px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        )}
        
        {task.dueDate && (
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {task.assignedTo && (
        <div className="flex items-center mt-3 text-xs text-gray-600">
          <UserIcon className="w-4 h-4 mr-1" />
          Поручено: {task.assignedTo.name}
        </div>
      )}
    </div>
  )
}

export default TaskCard