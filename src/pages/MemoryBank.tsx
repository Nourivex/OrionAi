import React from 'react';

const MemoryBank: React.FC = () => {
  return (
    <>
      <header className="p-4 bg-theme-primary text-theme-onPrimary font-bold text-xl">Knowledge Base Management</header>
      <main className="flex-1 p-4">
        <section className="section-card p-6">
          <h2 className="text-lg font-semibold">Memory Bank</h2>
          <p className="text-theme-text/80 mt-2">Manage stored knowledge and documents used by the assistant.</p>
        </section>
      </main>
    </>
  );
};

export default MemoryBank;
