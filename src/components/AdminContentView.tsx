import React from 'react';
import { ValidationSummaryView } from './ValidationSummaryView';

interface AdminContentViewProps {
  onExit?: () => void;
}

export const AdminContentView: React.FC<AdminContentViewProps> = ({ onExit }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-2">
      <ValidationSummaryView onExit={onExit} />
    </div>
  );
};
