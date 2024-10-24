import React from 'react';
import { APISettings } from '../lib/types';

interface SettingsPanelProps {
  settings: APISettings;
  onUpdateSettings: (newSettings: APISettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings, onClose }) => {
  // 這裡添加設置面板的實現
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">API Settings</h3>
        {/* 在這裡添加設置選項 */}
        <div className="mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
