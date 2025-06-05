import React from 'react';

interface VideoPlayerProps {
  title: string;
  onComplete: () => void;
  thumbnail?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  title, 
  onComplete,
  thumbnail = '/placeholder.svg'
}) => {
  return (
    <div className="flex flex-col">
      <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
        {/* In a real app, this would be a real video player */}
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">Click the button below to simulate watching this video</p>
        </div>
      </div>
      <button 
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        onClick={onComplete}
      >
        Complete Video
      </button>
    </div>
  );
};
