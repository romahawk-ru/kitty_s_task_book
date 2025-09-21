import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useTasks, useUpdateTask, useCreateTask } from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'

const Dashboard: React.FC = () => {
  const { data: tasks, isLoading } = useTasks()
  const updateTaskMutation = useUpdateTask()
  const createTaskMutation = useCreateTask()
  
  const [isFormOpen, setIsFormOpen] = useState(false)

  const statusColumns = [
    { id: 'TODO', title: 'To Do', color: 'bg-gray-100' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'DONE', title: 'Done', color: 'bg-green-50' }
  ]

  const handleDrop = (taskId: string, newStatus: string) => {
    updateTaskMutation.mutate({ id: taskId, status: newStatus })
  }

  const handleCreateTask = (taskData: any) => {
    createTaskMutation.mutate(taskData)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusColumns.map((column) => (
            <StatusColumn
              key={column.id}
              title={column.title}
              status={column.id}
              tasks={tasks?.filter(task => task.status === column.id) || []}
              onDrop={handleDrop}
              color={column.color}
            />
          ))}
        </div>

        <TaskForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateTask}
        />
      </div>
    </DndProvider>
  )
}

interface StatusColumnProps {
  title: string
  status: string
  tasks: any[]
  onDrop: (taskId: string, newStatus: string) => void
  color: string
}

const StatusColumn: React.FC<StatusColumnProps> = ({ 
  title, 
  status, 
  tasks, 
  onDrop, 
  color 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { id: string }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={`rounded-lg p-4 ${color} ${isOver ? 'ring-2 ring-primary-500' : ''}`}
    >
      <h2 className="font-semibold text-lg mb-4 text-gray-800">
        {title} ({tasks.length})
      </h2>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard