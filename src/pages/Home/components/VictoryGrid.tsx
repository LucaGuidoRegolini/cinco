import React from "react";
import { Tips } from "../../../context/GameTipsProp";

interface VictoryGridProps {
  gameTips: Tips[][];
}

const VictoryGrid: React.FC<VictoryGridProps> = ({ gameTips }) => {
  const getColor = (tip: Tips): string => {
    switch (tip) {
      case "right":
        return "bg-green-500"; // Verde para acerto completo
      case "almost":
        return "bg-yellow-500"; // Amarelo para letra certa, mas na posição errada
      case "wrong":
        return "bg-gray-500"; // Cinza para erro
      default:
        return "bg-white"; // Branco por padrão (caso a célula esteja vazia)
    }
  };

  return (
    <div className="flex flex-col items-center mt-3">
      <div className="grid grid-rows-6 gap-2">
        {gameTips.map((row, rowIndex) => (
          <div key={rowIndex} className=" grid grid-cols-5  gap-2">
            {row.map((tip, colIndex) => (
              <div
                key={colIndex}
                className={`w-6 h-6 flex items-center justify-center rounded-lg text-white font-bold ${getColor(
                  tip
                )}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VictoryGrid;
