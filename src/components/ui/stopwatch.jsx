import { useState, useRef } from "react";
import "./stopwatch.css";

function stopwatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    
    // <div style={{ padding: "20px" }}>
    //   <h2>Stopwatch</h2>
    //   <h3>
    //     {minutes}:{seconds < 10 ? "0" : ""}
    //     {seconds}
    //   </h3>

    //   <button onClick={startTimer}>Start</button>
    //   <button onClick={stopTimer}>Stop</button>
    //   <button onClick={resetTimer}>Reset</button>
    // </div>
    <div className="stopwatch">
  <h2>Stopwatch</h2>

  <h3>
    {minutes}:{seconds < 10 ? "0" : ""}
    {seconds}
  </h3>

  <button onClick={startTimer}>Start</button>
  <button onClick={stopTimer}>Stop</button>
  <button onClick={resetTimer}>Reset</button>
</div>
  );
}

export default stopwatch;