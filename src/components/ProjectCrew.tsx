import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import type { Project } from '../types';

interface ProjectCrewProps {
  projects: Project[];
  onToggleTask: (projectId: string, taskId: string) => void;
}

const getStatusStyles = (status: Project['status']) => {
  switch (status) {
    case 'Perancangan':
      return 'bg-blue-500 text-blue-100';
    case 'Dalam Perlaksanaan':
      return 'bg-yellow-500 text-yellow-100';
    case 'Selesai':
      return 'bg-green-500 text-green-100';
    default:
      return 'bg-gray-500 text-gray-100';
  }
};

const ProjectCard = ({
  project,
  onToggleTask,
}: {
  project: Project;
  onToggleTask: (projectId: string, taskId: string) => void;
}) => {
  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const currentStatus =
    progress === 100 ? 'Selesai' : progress > 0 ? 'Dalam Perlaksanaan' : 'Perancangan';

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-start mb-2">
          <CardTitle>{project.title}</CardTitle>
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusStyles(currentStatus)}`}
          >
            {currentStatus}
          </span>
        </div>
        <CardDescription>{project.description.split('\n').slice(1).join('\n')}</CardDescription>

        <div className="mt-4">
          <h4 className="text-sm font-bold text-gray-300 mb-2">Senarai Semak Tugasan</h4>
          <div className="space-y-2">
            {project.tasks.map((task) => (
              <div key={task.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${project.id}-${task.id}`}
                  checked={task.completed}
                  onChange={() => onToggleTask(project.id, task.id)}
                  className="w-4 h-4 text-[#39FF14] bg-gray-700 border-gray-600 rounded focus:ring-[#39FF14] focus:ring-2"
                />
                <label
                  htmlFor={`${project.id}-${task.id}`}
                  className={`ml-2 text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}
                >
                  {task.text}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Kemajuan</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-[#39FF14] h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProjectCrew = ({ projects, onToggleTask }: ProjectCrewProps): React.ReactNode => {
  return (
    <div>
      <h3 className="font-teko text-3xl mb-4 text-gray-400">MISSION CONTROL HUB</h3>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onToggleTask={onToggleTask} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-black rounded-lg border border-dashed border-gray-700">
          <p className="font-teko text-3xl text-gray-600 tracking-widest">NO ACTIVE PROJECTS</p>
          <p className="text-sm text-gray-500">
            Gunakan "Jadikan Projek" pada mana-mana idea yang dijana untuk memulakan misi anda.
          </p>
        </div>
      )}
    </div>
  );
};
