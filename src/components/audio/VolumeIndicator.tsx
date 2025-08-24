import React from 'react';

interface VolumeIndicatorProps {
  volume: number; // 0-100
  isRecording: boolean;
}

export const VolumeIndicator: React.FC<VolumeIndicatorProps> = ({ volume, isRecording }) => {
  const getVolumeColor = () => {
    if (!isRecording) return 'bg-gray-300';
    if (volume < 20) return 'bg-yellow-400'; // Too quiet
    if (volume > 80) return 'bg-red-500'; // Too loud
    return 'bg-green-500'; // Just right
  };

  const getVolumeText = () => {
    if (!isRecording) return '録音を開始してください';
    if (volume < 20) return '音量が小さすぎます';
    if (volume > 80) return '音量が大きすぎます';
    return 'ちょうど良い音量です';
  };

  const getTextColor = () => {
    if (!isRecording) return 'text-gray-500';
    if (volume < 20) return 'text-yellow-600';
    if (volume > 80) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">音量レベル</span>
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {getVolumeText()}
        </span>
      </div>
      
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        {/* Background zones */}
        <div className="absolute inset-0 flex">
          <div className="w-1/5 bg-yellow-100"></div>
          <div className="flex-1 bg-green-100"></div>
          <div className="w-1/5 bg-red-100"></div>
        </div>
        
        {/* Volume level indicator */}
        <div 
          className={`absolute left-0 top-0 h-full transition-all duration-100 ${getVolumeColor()}`}
          style={{ width: `${Math.min(100, volume)}%` }}
        >
          <div className="h-full bg-white/20 animate-pulse"></div>
        </div>
        
        {/* Optimal range markers */}
        <div className="absolute left-[20%] top-0 w-px h-full bg-gray-400 opacity-50"></div>
        <div className="absolute left-[80%] top-0 w-px h-full bg-gray-400 opacity-50"></div>
      </div>
      
      {/* Level labels */}
      <div className="flex justify-between mt-1">
        <span className="text-xs text-yellow-600">小</span>
        <span className="text-xs text-green-600 font-medium">適切</span>
        <span className="text-xs text-red-600">大</span>
      </div>
    </div>
  );
};