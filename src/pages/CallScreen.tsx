import React, { useEffect, useState } from 'react';
import {
  PhoneOffIcon,
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  Volume2Icon,
  VolumeXIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
interface CallScreenProps {
  chatId: string;
  isVideo?: boolean;
  onEndCall: () => void;
}
export function CallScreen({
  chatId,
  isVideo = false,
  onEndCall
}: CallScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(isVideo);
  const [callDuration, setCallDuration] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white relative overflow-hidden">
      {/* Background blur for audio calls */}
      {!isVideoEnabled &&
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" />
        </div>
      }

      {/* Video placeholder */}
      {isVideoEnabled &&
      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <p className="text-gray-500">Video Feed</p>
          {/* Picture-in-picture self view */}
          <div className="absolute top-6 right-4 w-24 h-36 bg-gray-700 rounded-xl border-2 border-gray-600 shadow-lg" />
        </div>
      }

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {!isVideoEnabled &&
          <div className="mb-8 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <UserAvatar
              src="https://i.pravatar.cc/150?u=david"
              name="David Omondi"
              size="lg"
              className="w-32 h-32 text-4xl relative z-10 border-4 border-gray-800" />
            
            </div>
          }
          <h1 className="text-3xl font-bold mb-2 drop-shadow-md">
            David Omondi
          </h1>
          <p className="text-gray-300 font-medium drop-shadow-md">
            {formatTime(callDuration)}
          </p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-t-3xl flex justify-center gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-white text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
            
            {isMuted ?
            <MicOffIcon className="w-6 h-6" /> :

            <MicIcon className="w-6 h-6" />
            }
          </button>

          <button
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${!isVideoEnabled ? 'bg-white text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
            
            {!isVideoEnabled ?
            <VideoOffIcon className="w-6 h-6" /> :

            <VideoIcon className="w-6 h-6" />
            }
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isSpeaker ? 'bg-white text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
            
            {isSpeaker ?
            <Volume2Icon className="w-6 h-6" /> :

            <VolumeXIcon className="w-6 h-6" />
            }
          </button>

          <button
            onClick={onEndCall}
            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
            
            <PhoneOffIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>);

}