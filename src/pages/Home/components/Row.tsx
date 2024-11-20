import { useState, useEffect, useRef } from "react";
import "./row.css";
import { Tips, useGameTips } from "../../../context/GameTipsProp";
import wordsJson from "../../../assets/word.json";
import { findStringInArray } from "../../../utils/compareWords";
import { useAlert } from "../../../context/AlertProp";

interface Word {
  words: string[];
}

const words = wordsJson as Word;

interface InputRowProps {
  onValuesChange: (newValues: string) => void;
  isLocked: boolean;
  wordTarget: string;
  initialValues?: string[];
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function InputRow({
  onValuesChange,
  isLocked = false,
  wordTarget,
  initialValues,
}: InputRowProps) {
  const { setAlert } = useAlert();
  const { gameTips, setGameTips } = useGameTips();
  const [isSending, setIsSending] = useState<boolean | undefined>();
  const [isChanging, setChanging] = useState<boolean | undefined>();
  const [values, setValues] = useState(initialValues || ["", "", "", "", ""]);
  const [word, setWord] = useState(["", "", "", "", ""]);
  const [wordTips, setWordTips] = useState<Tips[]>(["", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [animating, setAnimating] = useState<undefined | number>(undefined);
  const [errorAnimating, setErrorAnimating] = useState<boolean>(false);
  const [flippingIndex, setFlippingIndex] = useState<number | null>(null);
  const [removeAnimating, setRemoveAnimating] = useState<undefined | number>(undefined);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (initialValues) {
      const tips = verifyWord();
      setWordTips(tips);
      setWord(initialValues);
    }
  }, []);

  useEffect(() => {
    if (focusedIndex !== null) {
      inputRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  useEffect(() => {
    if (isSending) onValuesChange(values.join(""));
    if (isChanging) handleTipsReveal(wordTips);
  }, [isSending]);

  useEffect(() => {
    if (!isLocked) {
      inputRefs.current[0]?.focus();
    }
  }, [isLocked]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e.key, focusedIndex || 0);
    };

    document.addEventListener("keydown", handleGlobalKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown, true);
    };
  }, [focusedIndex, isLocked, isSending, isChanging, values]);

  const handleTipsReveal = (tips: Tips[]) => {
    const newGameTips = [...gameTips];
    newGameTips.push(tips);
    setGameTips(newGameTips);
  };

  const verifyWord = (): Tips[] => {
    const wordTargetArray = wordTarget.split("");
    const tips: Tips[] = Array(values.length).fill("wrong");
    const usedIndices: Set<number> = new Set();

    values.forEach((character, index) => {
      if (character === wordTargetArray[index]) {
        tips[index] = "right";
        usedIndices.add(index);
        wordTargetArray[index] = "";
      }
    });

    values.forEach((character, index) => {
      if (
        tips[index] === "wrong" &&
        !usedIndices.has(index) &&
        wordTargetArray.includes(character)
      ) {
        tips[index] = "almost";
        usedIndices.add(index);
        wordTargetArray[wordTargetArray.indexOf(character)] = "";
      }
    });

    return tips;
  };

  const animateTipsReveal = async (tips: Tips[]) => {
    for (let index = 0; index < tips.length; index++) {
      setFlippingIndex(index); // Define o índice atual para a animação
      await delay(300);

      setWordTips((prev) => {
        const newTips = [...prev];
        newTips[index] = tips[index];
        return newTips;
      });

      await delay(300);
    }

    setFlippingIndex(null); // Reseta o estado após todas as animações
    setIsSending(true);
  };

  const animateInvalid = async () => {
    setErrorAnimating(true);
    await delay(300);
    setErrorAnimating(false);
  };

  const handleKeyDown = (key: string, index: number) => {
    if (isLocked || isSending || isChanging) return;

    const newValues = [...values];

    if (key === "Backspace") {
      if (newValues[index] !== "") {
        newValues[index] = ""; // Apaga o valor
        setValues(newValues);
        triggerAnimation(index, "remove");
      } else {
        focusPrev(index); // Foca na div anterior
      }
    } else if (key.length === 1 && /^[A-ZÇç]$/i.test(key)) {
      newValues[index] = key.toUpperCase(); // Converte para maiúscula
      setValues(newValues);
      triggerAnimation(index);
      focusNextIfEmpty(index); // Foca na próxima div vazia
    } else if (key === " ") {
      focusNext(index);
    } else if (key === "ArrowLeft") {
      focusPrev(index);
    } else if (key === "ArrowRight") {
      focusNext(index);
    } else if (key === "Enter" && !values.includes("")) {
      const wordIsValid = findStringInArray(values.join(""), words.words);

      if (!wordIsValid) {
        setAlert("Palavra inválida!");
        animateInvalid();
        return;
      }

      setWord(wordIsValid.toUpperCase().split(""));

      const wordTips = verifyWord();
      setChanging(true);
      setFocusedIndex(null);
      animateTipsReveal(wordTips);
    }
  };

  const focusNextIfEmpty = (index: number) => {
    let nextIndex = index + 1;
    while (nextIndex < values.length && values[nextIndex] !== "") {
      nextIndex++;
    }
    if (nextIndex < values.length) {
      setFocusedIndex(nextIndex);
    }
  };

  const focusNext = (index: number) => {
    const nextIndex = index + 1;
    if (nextIndex < values.length) {
      setFocusedIndex(nextIndex);
    }
  };

  const focusPrev = (index: number) => {
    const prevIndex = index - 1;
    if (prevIndex >= 0) {
      setFocusedIndex(prevIndex);
    }
  };

  const triggerAnimation = (index: number, type: "add" | "remove" = "add") => {
    if (type === "add") {
      setAnimating(index); // Adiciona a animação
      setTimeout(() => {
        setAnimating(undefined); // Remove a animação depois de 300ms
      }, 100); // Tempo da animação
    } else if (type === "remove") {
      setRemoveAnimating(index); // Adiciona a animação
      setTimeout(() => {
        setRemoveAnimating(undefined); // Remove a animação depois de 300ms
      }, 100); // Tempo da animação
    }
  };

  const handleClick = (index: number) => {
    if (!isLocked && !isSending && !isChanging) {
      setFocusedIndex(index);
    }
  };

  return (
    <div className="flex space-x-2">
      {values.map((value, index) => (
        <div
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          tabIndex={0}
          onClick={() => handleClick(index)}
          className={`w-14 h-12 flex items-center justify-center border cursor-pointer rounded-lg font-sans font-semibold text-5xl focus:outline-none 
            ${wordTips[index] === "right" ? "bg-green-500 text-white" : ""}
            ${wordTips[index] === "almost" ? "bg-yellow-500 text-white" : ""}
            ${wordTips[index] === "wrong" ? "bg-gray-500 text-white" : ""}
            ${
              focusedIndex === index && !isLocked
                ? "border-gray-300 border-4 border-b-8"
                : "border-gray-300"
            } 
            ${animating === index ? "animate-scale" : ""}
            ${errorAnimating ? "animate-flip" : ""}
            ${removeAnimating === index ? "animate-inverse-scale" : ""}
            ${isLocked ? "bg-gray-500 border-gray-500" : "focused"}
            ${flippingIndex === index ? "animate-flip" : ""}
          `}
        >
          {wordTips[index] !== "" ? word[index] : value}
        </div>
      ))}
    </div>
  );
}

export default InputRow;
