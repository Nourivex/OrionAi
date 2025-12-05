import React from 'react';
import { Link } from 'react-router-dom';

const UnitConverter: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold">Unit Converter</h2>
        <p className="text-sm text-theme-text/70 mb-4">Convert common units (length, mass, temperature). (Placeholder)</p>
        <div className="border border-theme-primary-dark/5 rounded-md p-4 bg-theme-surface">Unit converter placeholder.</div>
        <div className="mt-4"><Link to="/tools" className="text-sm text-theme-primary">← Back to Tools</Link></div>
      </div>
    </div>
  );
};

export default UnitConverter;
