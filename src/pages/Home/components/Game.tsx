import InputRow from "./Row";
import { useState } from "react";

interface GameProps {
  word: string;
  onInputChange: (value: string[]) => void;
}

function Game({ word, onInputChange }: GameProps) {
  const [inputValues, setInputValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [unlockedRow, setUnlockedRow] = useState(0);

  // Função que recebe o valor do filho e atualiza o estado do pai
  const handleValuesChange = (newValues: string, index: number) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = newValues;
    setInputValues(newInputValues);
    setUnlockedRow(index + 1);

    onInputChange(newInputValues);
  };
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-2">
        {inputValues.map((_value, index) => (
          <InputRow
            key={index}
            wordTarget={word}
            isLocked={index !== unlockedRow}
            onValuesChange={(newValues) => handleValuesChange(newValues, index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Game;
