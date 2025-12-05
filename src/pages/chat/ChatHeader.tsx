import React from 'react';

const ChatHeader: React.FC<{ title?: string }> = ({ title = 'OrionAi' }) => {
  return (
    <div className="w-full py-6 text-center">
      <h1 className="text-lg sm:text-xl font-semibold text-theme-primary">{title}</h1>
    </div>
  );
};

export default ChatHeader;
