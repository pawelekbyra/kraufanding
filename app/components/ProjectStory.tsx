import React from 'react';

interface ProjectStoryProps {
  story: string[];
}

const ProjectStory: React.FC<ProjectStoryProps> = ({ story }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-white mb-8 border-l-4 border-blue-600 pl-4">
        O Projekcie
      </h2>
      {story.map((paragraph, index) => (
        <p key={index} className="text-gray-400 text-lg leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default ProjectStory;
