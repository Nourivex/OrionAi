import React from 'react';

interface CharacterPersona {
  character_id: string;
  name: string;
  character_role: string;
  isActive?: boolean;
}

interface SidebarCharacterListProps {
  isOpen: boolean;
  characters: CharacterPersona[];
  navigate: (path: string) => void;
  Plus: React.ElementType;
  Bot: React.ElementType;
}

const SidebarCharacterList: React.FC<SidebarCharacterListProps> = ({
  isOpen,
  characters,
  navigate,
  Plus,
  Bot,
}) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between px-2 py-3">
        {isOpen ? (
          <div className="text-xs font-semibold text-theme-text/60 uppercase tracking-wider">
            Characters
          </div>
        ) : (
          <div />
        )}
        {isOpen && (
          <div className="flex items-center gap-2">
            {characters.length > 5 && (
              <button
                onClick={() => navigate('/characters')}
                className="text-xs text-theme-primary hover:text-theme-primary/80 font-medium transition-colors"
                title="View all characters"
              >
                View All
              </button>
            )}
          </div>
        )}
        {!isOpen && (
          <button
            onClick={() => navigate('/character/new')}
            title="New Character"
            aria-label="New Character"
            className="p-2 rounded-md text-theme-text/60 hover:bg-theme-surface/60 hover:text-theme-primary transition-colors"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* New Character Button - When sidebar is open */}
      {isOpen && (
        <button
          onClick={() => navigate('/character/new')}
          className="w-full flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg border border-dashed border-theme-primary-dark/30 text-theme-text/70 hover:text-theme-primary hover:border-theme-primary hover:bg-theme-primary/5 transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-theme-primary/10 flex items-center justify-center">
            <Plus size={14} className="text-theme-primary" />
          </div>
          <span className="text-sm font-medium">New Character</span>
        </button>
      )}

      <div className="space-y-2">
        {characters.slice(0, 5).map((character) => (
          <div
            key={character.character_id}
            onClick={() => {
              navigate(`/characterchat/${character.character_id}`);
            }}
            className={`flex items-center ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3'} rounded-lg cursor-pointer transition-all duration-200 group ${character.isActive
              ? 'bg-theme-primary text-theme-onPrimary border border-theme-primary'
              : 'text-theme-text/80 hover:text-theme-accent hover:bg-theme-primary/10'
              }`}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(90deg, var(--theme-primary), var(--theme-accent))' }}>
              <Bot size={12} className="text-theme-onPrimary" />
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{character.name}</div>
                <div className="text-xs text-theme-text/60 mt-0.5">{character.character_role}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarCharacterList;
