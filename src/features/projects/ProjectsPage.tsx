import React from 'react';
import { Header } from '../../components/Header';
import { Section } from '../../components/Section';
import { ProjectCrew } from '../../components/ProjectCrew';
import { GeneratorCard } from '../../components/GeneratorCard';
import { ImageGeneratorCard } from '../../components/ImageGeneratorCard';
import { useAppState } from '../../contexts/AppStateContext';
import { PRODUCT_CARDS, GROWTH_CARDS, BIZ_OPS_CARDS } from '../../constants';
import type { GeneratorCardData } from '../../types';

const ProjectsPage: React.FC = () => {
  const { state, addProject, toggleTask } = useAppState();

  const handleAddProject = (title: string) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      title: title.split('\n')[0].replace('NAMA:', '').trim(),
      description: title,
      status: 'Perancangan',
      tasks: [
        { id: 'task1', text: 'Kaji kos bahan & harga jualan', completed: false },
        { id: 'task2', text: 'Reka pembungkusan / visual', completed: false },
        { id: 'task3', text: 'Rancang strategi pelancaran', completed: false },
        { id: 'task4', text: 'Laksanakan pelancaran', completed: false },
      ],
    };
    addProject(newProject);
  };

  const handleToggleTask = (projectId: string, taskId: string) => {
    toggleTask(projectId, taskId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header />
      
      <main className="space-y-8 sm:space-y-12 lg:space-y-16">
        <Section
          title="C.R.E.W. (Command, Research, Execution, Win)"
          subtitle="Strategic intelligence and project management suite"
          titleGradient
        >
          <div>
            <h3 className="font-heading text-heading-lg mb-6 text-dark-300 uppercase tracking-wider">
              IDEA GENERATION SUITE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
              {PRODUCT_CARDS.map((card) => {
                if (card.type === 'image') {
                  return <ImageGeneratorCard key={card.id} {...card} />;
                }
                return (
                  <GeneratorCard
                    key={card.id}
                    {...(card as GeneratorCardData)}
                    onSaveAsProject={handleAddProject}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
              {GROWTH_CARDS.map((card) => (
                <GeneratorCard key={card.id} {...card} onSaveAsProject={handleAddProject} />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
              {BIZ_OPS_CARDS.map((card) => (
                <GeneratorCard key={card.id} {...card} onSaveAsProject={handleAddProject} />
              ))}
            </div>
          </div>
          <div className="mt-12">
            <ProjectCrew projects={state.projects} onToggleTask={handleToggleTask} />
          </div>
        </Section>
      </main>
    </div>
  );
};

export default ProjectsPage;
