import  { useState, useEffect, useRef } from "react";
import './components/Clock.css'
const App = () => {
  
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isSession, setIsSession] = useState(true); 
  const [isRunning, setIsRunning] = useState(false); 

  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
    }`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            return switchTimer();
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsSession(true);
    setIsRunning(false);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };

  const switchTimer = () => {
    const audio = document.getElementById("beep");
    audio.play();

    if (isSession) {
      setIsSession(false);
      return breakLength * 60;
    } else {
      setIsSession(true);
      return sessionLength * 60;
    }
  };

  const handleSessionChange = (amount) => {
    if (sessionLength + amount > 0 && sessionLength + amount <= 60) {
      setSessionLength(sessionLength + amount);
      if (isSession && !isRunning) {
        setTimeLeft((sessionLength + amount) * 60);
      }
    }
  };

  const handleBreakChange = (amount) => {
    if (breakLength + amount > 0 && breakLength + amount <= 60) {
      setBreakLength(breakLength + amount);
      if (!isSession && !isRunning) {
        setTimeLeft((breakLength + amount) * 60);
      }
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="app">
      <h1>25 + 5 Clock</h1>

      <div className="timer-container">
        <div className="timer-display">
          <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
          <div id="time-left">{formatTime(timeLeft)}</div>
        </div>

        <div className="timer-controls">
          <button id="start_stop" onClick={handleStartStop}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button id="reset" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="timer-settings">
          <div className="session-control">
            <h3 id="session-label">Session Length</h3>
            <button id="session-decrement" onClick={() => handleSessionChange(-1)}>
              -
            </button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={() => handleSessionChange(1)}>
              +
            </button>
          </div>

          <div className="break-control">
            <h3 id="break-label">Break Length</h3>
            <button id="break-decrement" onClick={() => handleBreakChange(-1)}>
              -
            </button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={() => handleBreakChange(1)}>
              +
            </button>
          </div>
        </div>
      </div>

      <audio id="beep" src="https://www.soundjay.com/button/sounds/beep-07.mp3"></audio>
    </div>
  );
};

export default App;
