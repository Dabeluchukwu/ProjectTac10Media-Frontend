import React, { useState, useRef, lazy, Suspense } from "react";


const ReactPlayer = lazy(() => import("react-player"));

const VideoPlayer = ({ url, title, onProgress, onComplete }) => {
  const [played, setPlayed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  const handleProgress = (state) => {
    setPlayed(state.played);

    if (onProgress) {
      onProgress(state.played);
    }

    // Mark as complete if watched 90%+
    if (state.played >= 0.9 && onComplete) {
      onComplete();
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!url) {
    return (
      <div className="h-[350px] bg-black rounded-xl flex items-center justify-center">
        <p className="text-gray-500">No video available for this lesson</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl overflow-hidden">
      <Suspense
        fallback={
          <div className="h-[400px] flex items-center justify-center bg-black text-white">
            Loading player...
          </div>
        }
      >
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="400px"
          controls
          playing={isPlaying}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          config={{
            youtube: {
              playerVars: { modestbranding: 1, rel: 0 },
            },
            vimeo: {
              playerOptions: { responsive: true },
            },
          }}
        />
      </Suspense>

      <div className="p-4 bg-neutral-900">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-white">{title}</h4>
          <span className="text-xs text-gray-400">
            {formatTime(played * duration)} / {formatTime(duration)}
          </span>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-1.5">
          <div
            className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${played * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
