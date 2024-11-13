import React, { useEffect, useState } from "react";

interface WinPopupProps {
  message: string;
  visible: boolean;
}

const WinPopup: React.FC<WinPopupProps> = ({ message, visible }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    }
  }, [visible]);

  return (
    isVisible && (
      <div className="fixed top-0 left-0 w-full bg-blue-600 text-white text-center p-4 shadow-lg z-50">
        <span>{message}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 bg-blue-800 hover:bg-blue-900 text-white font-bold py-1 px-3 rounded"
        >
          Fechar
        </button>
      </div>
    )
  );
};

export default WinPopup;
