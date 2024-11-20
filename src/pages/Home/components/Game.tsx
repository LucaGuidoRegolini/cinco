import InputRow from "./Row";
import { useState } from "react";

interface GameProps {
  word: string;
  initialInputValues: string[];
  onInputChange: (value: string[]) => void;
}

function Game({ word, onInputChange, initialInputValues }: GameProps) {
  console.log(initialInputValues);
  const initialPosition = initialInputValues.findIndex((value) => value == "");
  const [inputValues, setInputValues] = useState<string[]>(initialInputValues);
  const [unlockedRow, setUnlockedRow] = useState(
    initialPosition === -1 ? 0 : initialPosition
  );

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
            initialValues={
              inputValues[index] != "" ? inputValues[index].split("") : undefined
            }
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
