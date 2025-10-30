import React from 'react';

const VideoPlayer = ({path}: {path:string}) => {
  return (
    <div className="w-full h-40 rounded-2xl overflow-hidden">
      <video 
        width="100%"
        autoPlay
        playsInline
        loop
        muted
        >
        <source src={path} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
