import React, { useEffect, useState } from "react";
import VictoryGrid from "./VictoryGrid";
import { useGameTips } from "../../../context/GameTipsProp";
import { capitalizeFirstLetter } from "../../../utils/compareWords";

interface WinPopupProps {
  visible: boolean;
  wordTarget: string;
  message: string;
  initTime: number;
}

function formatTimeDifference(startTimestamp: number, endTimestamp: number): string {
  const difference = endTimestamp - startTimestamp;

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days >= 1) {
    return `D+${days}`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

const WinPopup: React.FC<WinPopupProps> = ({
  visible,
  wordTarget,
  message,
  initTime,
}) => {
  const { gameTips } = useGameTips();
  const [gameTime, setGameTime] = useState("00:00:00");
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setGameTime(formatTimeDifference(initTime, Date.now()));
      setIsVisible(visible);
    }
  }, [initTime, visible]);

  const handlePlayAgain = () => {
    setIsVisible(false);
    window.location.reload();
  };

  return (
    isVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-gray-600 text-white text-center p-6 rounded-lg shadow-lg w-96">
          <span className="text-2xl mb-4 font-sans font-semibold tracking-wider">
            {message}
          </span>
          <VictoryGrid gameTips={gameTips} />
          <div className="flex justify-center items-center h-18 mt-2 mb-2">
            <span className="text-2xl mb-5 font-sans  tracking-wider">
              Palavra: {capitalizeFirstLetter(wordTarget)}
            </span>
          </div>
          <span className="text-2xl mb-5 font-sans  tracking-wider">{gameTime}</span>

          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handlePlayAgain}
            >
              Jogar de novo
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default WinPopup;
