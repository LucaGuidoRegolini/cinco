import { useEffect, useState } from "react";
import "./keyboard.css";

interface InputKeyboardProps {
  wordTarget: string;
  inputValues: string[];
}

type validKey = Uppercase<Exclude<keyof any, number | symbol>>;
type validTip = "right" | "almost" | "wrong";

interface KeyTips {
  [key: validKey]: validTip;
}

const Keyboard = ({ wordTarget, inputValues }: InputKeyboardProps) => {
  const [keyTips, setKeyTips] = useState<KeyTips>({});

  useEffect(() => {
    verifyWord();
  }, [inputValues]);

  const caractersRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const keys = [
    ...caractersRows[0],
    ...caractersRows[1],
    "Backspace",
    ...caractersRows[2],
    "Enter",
  ];
  const backspaceLabel = "<=";

  const handleKeyPress = (key: string) => {
    const event = new KeyboardEvent("keydown", { key });
    document.dispatchEvent(event);
  };

  const verifyWord = () => {
    const wordTargetArray = wordTarget.split("");
    let tips: KeyTips = {};

    if (!inputValues) {
      return;
    }

    inputValues.map((word) => {
      const wordArray = word.split("");
      if (word === "") return "";

      wordArray.forEach((letter, index) => {
        if (letter === wordTargetArray[index]) {
          tips = addTips(tips, "right", letter.toUpperCase() as validKey);
        } else if (wordTargetArray.includes(letter)) {
          tips = addTips(tips, "almost", letter.toUpperCase() as validKey);
        } else {
          tips = addTips(tips, "wrong", letter.toUpperCase() as validKey);
        }
      });
    });

    setKeyTips(tips);
  };

  const addTips = (tips: KeyTips, tip: validTip, key: validKey): KeyTips => {
    const newArray = tips;
    const tipExists = tips[key];

    if (tipExists) {
      if (tipExists === "wrong") {
        newArray[key] = tip;
      }
      if (tipExists === "almost" && tip === "right") {
        newArray[key] = tip;
      } else {
        newArray[key] = tipExists;
      }
    } else {
      newArray[key] = tip;
    }
    return newArray;
  };

  return (
    <div className=" keyboard-grid">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => handleKeyPress(key)}
          className={`key h-10 border border-gray-600 rounded-md text-3x1 font-semibold hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400  font-sans
            ${key.toLowerCase()}
            ${
              key !== "Backspace" &&
              key !== "Enter" &&
              keyTips[key as validKey] === "right"
                ? "bg-green-500"
                : key !== "Backspace" &&
                  key !== "Enter" &&
                  keyTips[key as validKey] === "almost"
                ? "bg-yellow-500"
                : key !== "Backspace" &&
                  key !== "Enter" &&
                  keyTips[key as validKey] === "wrong"
                ? "bg-gray-600"
                : ""
            }
            `}
        >
          {key === "Backspace" ? backspaceLabel : key}
        </button>
      ))}
    </div>
  );
};

export default Keyboard;
