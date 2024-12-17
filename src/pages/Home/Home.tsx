import Header from "./components/Header";
import Game from "./components/Game";
import { useEffect, useState } from "react";
import Keyboard from "./components/Keyboard";
import WinPopup from "./components/WinPopup";
import { GameTipsProvider } from "../../context/GameTipsProp";
import { normalizeString } from "../../utils/compareWords";
import { AlertProvider } from "../../context/AlertProp";
import wordsJson from "../../assets/word.json";
import AlertCard from "./components/Alert";

interface Word {
  words: string[];
}

const words = wordsJson as Word;
const randomIndex = Math.floor(Math.random() * words.words.length);
const initTime = Number(localStorage.getItem("initTime")) || Date.now();

function Home() {
  const storedIndex = localStorage.getItem("randomIndex");
  const index = storedIndex ? parseInt(storedIndex, 10) : randomIndex;
  const word = words.words[index];
  const normalizedWord = normalizeString(words.words[index]);
  console.log(word);

  const storedInputValues = localStorage.getItem("inputValues");
  const initialInputValues = storedInputValues
    ? JSON.parse(storedInputValues)
    : ["", "", "", "", "", ""];

  const [inputValues, setInputValues] = useState<string[]>(initialInputValues);
  const [userWin, setUserWin] = useState<boolean>(false);
  const [userLose, setUserLose] = useState<boolean>(false);

  useEffect(() => {
    if (!storedIndex) {
      localStorage.setItem("randomIndex", String(randomIndex));
    }
  }, [storedIndex, randomIndex]);

  useEffect(() => {
    if (!localStorage.getItem("initTime")) {
      localStorage.setItem("initTime", String(initTime));
    }
  }, [initTime]);

  useEffect(() => {
    localStorage.setItem("inputValues", JSON.stringify(inputValues));
    verifyIfWin();
  }, [inputValues]);

  const verifyIfWin = () => {
    let isWin = false;
    inputValues.map((value) => {
      if (value === "") return;
      if (value !== normalizedWord) return;

      setUserWin(true);
      isWin = true;
    });

    if (!isWin && inputValues.filter((value) => value !== "").length === 6) {
      setUserLose(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <GameTipsProvider>
        <AlertProvider>
          <Header />
          <AlertCard />
          <Game
            word={normalizedWord}
            onInputChange={setInputValues}
            initialInputValues={initialInputValues}
          />
          <Keyboard wordTarget={normalizedWord} inputValues={inputValues} />
        </AlertProvider>
        <WinPopup
          visible={userWin}
          wordTarget={word}
          message="Parabéns! Você ganhou!"
          initTime={initTime}
        />
        <WinPopup
          visible={userLose}
          initTime={initTime}
          wordTarget={word}
          message=" Que pena! Você perdeu!"
        />
      </GameTipsProvider>
    </div>
  );
}

export default Home;
