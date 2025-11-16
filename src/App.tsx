import { useEffect, useRef, useState } from "react";
import { HangImage } from "./components/HangImage";
import { letters } from "./helpers/letters";
import { getRandomWord } from "./helpers/getRandomWord";
import { hiddenLetter } from "./helpers/hiddenLetter";
import "./App.css";

function App() {
  const [time, setTime] = useState(() => {
    const dataTime = localStorage.getItem("time");
    return dataTime ? Number(dataTime) : 0;
  });

  const [word, setWord] = useState(() => {
    const datos = localStorage.getItem("word");
    return datos ?? getRandomWord();
  });

  const [hiddenWord, setHiddenWord] = useState(() => {
    const datosHiddenWord = localStorage.getItem("hiddenWord");
    return datosHiddenWord ?? hiddenLetter(word);
  });

  const [attempts, setAttempts] = useState(() => {
    const datosAttempts = localStorage.getItem("attempts");
    return datosAttempts ? Number(datosAttempts) : 0;
  });

  const [lose, setLose] = useState(false);
  const [won, setWon] = useState(false);

  const [letterStatus, setLetterStatus] = useState<
    Record<string, "correct" | "wrong" | undefined>
  >(() => {
    const datosletterStatus = localStorage.getItem("letterStatus");
    return datosletterStatus ? JSON.parse(datosletterStatus) : {};
  });

  // Ref para el intervalo (no provoca renders)
  const intervalRef = useRef<number | null>(null);
  
  // Ref para saber si el cronómetro está corriendo
  const isRunning = useRef(false);

  // Guardar palabra
  useEffect(() => {
    localStorage.setItem("word", word);
  }, [word]);

  // Guardar el numero de intentos
  useEffect(() => {
    localStorage.setItem("attempts", JSON.stringify(attempts));
  }, [attempts]);

  // Guardar letras descubiertas
  useEffect(() => {
    localStorage.setItem("hiddenWord", hiddenWord);
  }, [hiddenWord]);

  // Guardar estado de las letras
  useEffect(() => {
    localStorage.setItem("letterStatus", JSON.stringify(letterStatus));
  }, [letterStatus]);

  // Guardar tiempo jugado
  useEffect(() => {
    localStorage.setItem("time", JSON.stringify(time));
  }, [time]);

  // Detener cronómetro cuando gane o pierda
  useEffect(() => {
    if (lose || won) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        isRunning.current = false;
      }
    }
  }, [lose, won]);

  const startTimer = () => {
    if (!isRunning.current) {
      intervalRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      isRunning.current = true;
    }
  };

  const checkLetter = (letter: string) => {
    if (lose || won) return;

    // Arrancar tiempo cuando pulse primera letra
    startTimer();

    if (!word.includes(letter)) {
      setAttempts(Math.min(attempts + 1, 9));
      setLetterStatus((prev) => ({ ...prev, [letter]: "wrong" }));
      return;
    }

    const hiddenWordArray = hiddenWord.split(" ");
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        hiddenWordArray[i] = letter;
      }
    }

    setHiddenWord(hiddenWordArray.join(" "));
    setLetterStatus((prev) => ({ ...prev, [letter]: "correct" }));
  };

  const newGame = () => {
    const newWord = getRandomWord();

    setWord(newWord);
    setHiddenWord("_ ".repeat(newWord.length));
    setAttempts(0);
    setLose(false);
    setWon(false);
    setLetterStatus({});
    setTime(0);

    // Reiniciar cronómetro
    if (intervalRef.current) clearInterval(intervalRef.current);
    isRunning.current = false;
  };

  return (
    <div className="App">
      <h2 style={{ color: "red" }}>Tiempo de Partida</h2>
      <div className="reloj">{time}</div>

      {/* Imágenes */}
      <HangImage imageNumber={attempts} />

      {/* Palabra oculta */}
      <h3>{hiddenWord}</h3>

      {/* Contador de intentos */}
      <h3>Intentos: {attempts} </h3>

      {/* Mensaje si perdió */}
      {lose ? <h2>Perdió {word}!</h2> : ""}

      {/* Mensaje si ganó */}
      {won ? <h2>Felicidades, usted ganó</h2> : ""}

      {/* Botones de letras */}
      {letters.map((letter) => (
        <button
          onClick={() => checkLetter(letter)}
          key={letter}
          className={
            letterStatus[letter] === "correct"
              ? "btn green"
              : letterStatus[letter] === "wrong"
              ? "btn red"
              : "none"
          }
        >
          {letter}
        </button>
      ))}

      <br />
      <br />
      <button onClick={newGame}>¿Reiniciar Partida?</button>
    </div>
  );
}

export default App;