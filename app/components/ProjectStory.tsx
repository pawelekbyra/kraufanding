import React from 'react';

interface ProjectStoryProps {
  story: string[];
}

const ProjectStory: React.FC<ProjectStoryProps> = ({ story }) => {
  return (
    <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
      {story.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <div className="mt-12 rounded-2xl overflow-hidden border border-white/10">
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
          alt="Laboratory work"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default ProjectStory;
