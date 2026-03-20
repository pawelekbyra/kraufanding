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
      <div className="pt-8 border-t border-white/10">
        <h3 className="text-2xl font-bold text-white mb-4">The Challenge</h3>
        <p>Bringing a project of this magnitude to life requires precision, dedication, and the right resources. We&apos;ve overcome numerous technical hurdles, but the final leap depends on your support.</p>
      </div>
    </div>
  );
};

export default ProjectStory;
