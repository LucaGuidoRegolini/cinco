import React, { useEffect, useState } from "react";
import VictoryGrid from "./VictoryGrid";
import { useGameTips } from "../../../context/GameTipsProp";

interface LosePopupProps {
  visible: boolean;
}

const LosePopup: React.FC<LosePopupProps> = ({ visible }) => {
  const { gameTips } = useGameTips();
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsVisible(visible);
    }
  }, [visible]);

  const handlePlayAgain = () => {
    setIsVisible(false);
    window.location.reload();
  };

  return (
    isVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-gray-600 text-white text-center p-6 rounded-lg shadow-lg w-96">
          <span className="text-2xl mb-4 font-sans font-semibold tracking-wider">
            Que pena! Você perdeu!
          </span>
          <VictoryGrid gameTips={gameTips} />
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

export default LosePopup;
