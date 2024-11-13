import Header from "./components/Header";
import Game from "./components/Game";
import { useEffect, useState } from "react";
import Keyboard from "./components/Keyboard";
import WinPopup from "./components/WinPopup";
import { GameTipsProvider } from "../../context/GameTipsProp";
import LosePopup from "./components/LosePopup";
import { normalizeString } from "../../utils/compareWords";

function Home() {
  const word = normalizeString("pátio");
  const [inputValues, setInputValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [userWin, setUserWin] = useState<boolean>(false);
  const [userLose, setUserLose] = useState<boolean>(false);

  useEffect(() => {
    verifyIfWin();
  }, [inputValues]);

  const verifyIfWin = () => {
    inputValues.map((value) => {
      if (value === "") return;
      if (value !== word) return;

      setUserWin(true);
    });

    if (!userWin && inputValues.filter((value) => value !== "").length === 6) {
      setUserLose(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <GameTipsProvider>
        <Header />
        <Game word={word} onInputChange={setInputValues} />
        <Keyboard wordTarget={word} inputValues={inputValues} />
        <WinPopup visible={userWin} />
        <LosePopup visible={userLose} />
      </GameTipsProvider>
    </div>
  );
}

export default Home;
