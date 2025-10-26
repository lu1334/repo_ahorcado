import { useEffect, useState } from "react";
import { HangImage } from "./components/HangImage";
import { letters } from "./helpers/letters";
import { getRandomWord } from "./helpers/getRandomWord";
import { hiddenLetter } from "./helpers/hiddenLetter";
import "./App.css";

function App() {
  const [word, setWord] = useState(() => {
    const datos = localStorage.getItem("word");
    return datos ?? getRandomWord();
  });
  const [hiddenWord, setHiddenWord] = useState(() => {
    const datosHiddenWord = localStorage.getItem("hiddenWord");
    return datosHiddenWord ?? hiddenLetter(word);
  });
  const [attempts, setAttempts] = useState(() => {
    const datosAttempts = Number(localStorage.getItem("attempts"));
    return datosAttempts ?? 0;
  });
  const [lose, setLose] = useState(false);
  const [won, setWon] = useState(false);

  const [letterStatus, setLetterStatus] = useState<
    Record<string, "correct" | "wrong" | undefined>
  >(()=>{
    const datosletterStatus = localStorage.getItem("letterStatus")
    return datosletterStatus? JSON.parse(datosletterStatus):{}
  }); // he creado esto objeto para luego poder darle estilos al
  //boton de las letras segun acierte un color o falle otro color
  //y lo guardo en localStorage

  //Guardar palabra en localStorage
  useEffect(() => {
    localStorage.setItem("word", word);
  }, [word]);

  //Guardar el numero de intentos
  useEffect(() => {
    localStorage.setItem("attempts", JSON.stringify(attempts));
  }, [attempts]);

  //Guardar letras aceptadas hasta el momento
  useEffect(() => {
    localStorage.setItem("hiddenWord", hiddenWord);
  }, [hiddenWord]);
  //Guardar objeto 
  useEffect(() => {
    localStorage.setItem("letterStatus", JSON.stringify(letterStatus));
  }, [letterStatus]);



  // Determinar si la persona perdió
  useEffect(() => {
    if (attempts >= 9) {
      setLose(true);
    }
  }, [attempts]);

  // Determinar si la persona ganó
  useEffect(() => {
    // console.log(hiddenWord); // _ _ _ _ _ _ _ _
    const currentHiddenWord = hiddenWord.split(" ").join("");
    if (currentHiddenWord === word) {
      setWon(true);
    }
  }, [hiddenWord]);

  const checkLetter = (letter: string) => {
    if (lose || won) return;

    if (!word.includes(letter)) {
      // no ha acertado la letra
      setAttempts(Math.min(attempts + 1, 9));

      setLetterStatus((prev) => ({ ...prev, [letter]: "wrong" }));
      return;
    }
    const hiddenWordArray = hiddenWord.split(" ");

    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        hiddenWordArray[i] = letter; //ha acertado la letra
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
  };

  return (
    <div className="App">
      {/* Imágenes */}
      <HangImage imageNumber={attempts} />

      {/* Palabra oculta */}
      <h3>{hiddenWord}</h3>

      {/* Contador de intentos */}
      <h3>Intentos: {attempts} </h3>

      {/* Mensaje si peridó */}
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
      <button onClick={newGame}>¿Nuevo juego?</button>
    </div>
  );
}

export default App;
