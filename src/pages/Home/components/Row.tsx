import { useState, useEffect, useRef } from "react";
import "./row.css";

interface InputRowProps {
  onValuesChange: (newValues: string) => void;
  isLocked: boolean;
  wordTarget: string;
}

type Tips = "wrong" | "almost" | "right" | "";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function InputRow({ onValuesChange, isLocked = false, wordTarget }: InputRowProps) {
  const [isSending, setIsSending] = useState<boolean | undefined>();
  const [isChanging, setChanging] = useState<boolean | undefined>();
  const [values, setValues] = useState(["", "", "", "", ""]);
  const [wordTips, setWordTips] = useState<Tips[]>(["", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [animating, setAnimating] = useState<undefined | number>(undefined);
  const [flippingIndex, setFlippingIndex] = useState<number | null>(null);
  const [removeAnimating, setRemoveAnimating] = useState<undefined | number>(undefined);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (focusedIndex !== null) {
      inputRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  useEffect(() => {
    if (isSending) onValuesChange(values.join(""));
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

  const verifyWord = (): Tips[] => {
    const wordTargetArray = wordTarget.split("");
    const resp: Tips[] = [];

    values.map((value, index) => {
      if (value === "") resp[index] = "";
      else if (value === wordTarget.split("")[index]) {
        wordTargetArray[index] = "";
        resp[index] = "right";
      } else if (wordTargetArray.includes(value)) {
        wordTargetArray[wordTarget.indexOf(value)] = "";
        resp[index] = "almost";
      } else {
        resp[index] = "wrong";
      }
    });

    return resp;
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
    let nextIndex = index + 1;
    if (nextIndex < values.length) {
      setFocusedIndex(nextIndex);
    }
  };

  const focusPrev = (index: number) => {
    let prevIndex = index - 1;
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
          className={`w-16 h-14 flex items-center justify-center border cursor-pointer rounded-lg font-sans font-semibold text-5xl focus:outline-none 
            ${wordTips[index] === "right" ? "bg-green-500 text-white" : ""}
            ${wordTips[index] === "almost" ? "bg-yellow-500 text-white" : ""}
            ${wordTips[index] === "wrong" ? "bg-gray-500 text-white" : ""}
            ${
              focusedIndex === index && !isLocked
                ? "border-gray-300 border-4 border-b-8"
                : "border-gray-300"
            } 
            ${animating === index ? "animate-scale" : ""}
            ${removeAnimating === index ? "animate-inverse-scale" : ""}
            ${isLocked ? "bg-gray-500 border-gray-500" : "focused"}
            ${flippingIndex === index ? "animate-flip" : ""}
          `}
        >
          {value}
        </div>
      ))}
    </div>
  );
}

export default InputRow;
