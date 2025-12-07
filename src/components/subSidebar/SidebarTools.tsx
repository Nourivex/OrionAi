import React from 'react';


interface SidebarToolsProps {
  isOpen: boolean;
  navigate: (path: string) => void;
  Brain: React.ElementType;
  Wrench: React.ElementType;
  isMemoryActive?: boolean;
  isToolsActive?: boolean;
}

const SidebarTools: React.FC<SidebarToolsProps> = ({ isOpen, navigate, Brain, Wrench, isMemoryActive, isToolsActive }) => {
  return (
    <div className="mt-6">
      <div className="space-y-1">
        <button
          onClick={() => navigate('/memory')}
          className={`flex items-center ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3'} w-full rounded-lg font-medium transition-all duration-200 group ${isMemoryActive ? 'bg-theme-primary text-theme-onPrimary' : 'text-theme-text/80 hover:text-theme-primary hover:bg-theme-surface/60'}`}
        >
          <Brain size={16} className="flex-shrink-0" />
          {isOpen && <span className="font-medium">Memory Bank</span>}
        </button>
        <button
          onClick={() => navigate('/tool')}
          className={`flex items-center ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3'} w-full rounded-lg font-medium transition-all duration-200 group ${isToolsActive ? 'bg-theme-primary text-theme-onPrimary' : 'text-theme-text/80 hover:text-theme-primary hover:bg-theme-surface/60'}`}
        >
          <Wrench size={16} className="flex-shrink-0" />
          {isOpen && <span className="font-medium">Tools</span>}
        </button>
      </div>
    </div>
  );
};

export default SidebarTools;
