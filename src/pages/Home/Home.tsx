import Header from "./components/Header";
import Game from "./components/Game";
import { useEffect, useState } from "react";
import Keyboard from "./components/Keyboard";
import WinPopup from "./components/WinPopup";

function Home() {
  const word = "JORGE";
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [inputValues, setInputValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [userWin, setUserWin] = useState<boolean>(false);

  useEffect(() => {
    verifyIfWin();
  }, [inputValues]);

  const handleFocus = (e: FocusEvent) => {
    const focusedElement = e.target as HTMLElement;
    const focusableElements = document.querySelectorAll(".focused");

    if (![...focusableElements].includes(focusedElement)) {
      const lastFocusedElement = focusableElements[focusedIndex] as HTMLElement;
      lastFocusedElement.focus();
      console.log(lastFocusedElement.id);
    } else {
      setFocusedIndex([...focusableElements].indexOf(focusedElement));
    }
  };

  const handleBlur = (e: FocusEvent) => {
    const focusedElement = e.relatedTarget as HTMLElement;
    const focusableElements = document.querySelectorAll(".focused");

    if (![...focusableElements].includes(focusedElement)) {
      const lastFocusedElement = focusableElements[focusedIndex] as HTMLElement;
      lastFocusedElement.focus();
    } else {
      setFocusedIndex([...focusableElements].indexOf(focusedElement));
    }
  };

  const setFirstFocus = () => {
    const focusableElements = document.querySelectorAll(".focused");
    const lastFocusedElement = focusableElements[focusedIndex] as HTMLElement;

    lastFocusedElement.focus();
  };

  useEffect(() => {
    setFirstFocus();
    document.addEventListener("focus", handleFocus, true);
    document.addEventListener("blur", handleBlur, true);
    return () => {
      document.removeEventListener("focus", handleFocus, true);
      document.removeEventListener("blur", handleBlur, true);
    };
  });

  const verifyIfWin = () => {
    inputValues.map((value) => {
      if (value === "") return;
      if (value !== word) return;

      setUserWin(true);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <Header />
      <Game word={word} onInputChange={setInputValues} />
      <Keyboard wordTarget={word} inputValues={inputValues} />
      <WinPopup message="Parabéns, você ganhou!" visible={userWin} />
    </div>
  );
}

export default Home;
