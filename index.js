const BreakComponent = (props) => {
  return (
    <div className="break">
      <h3 id="break-label">Break Length</h3>
      <button disabled={props.play} onClick={() => props.handleIncrease("break")} id="break-increment">+</button>
      <strong id="break-length">{props.breakLength}</strong>
      <button disabled={props.play} onClick={() => props.handleDecrease("break")} id="break-decrement">-</button>
    </div>
  )
};

const SessionComponent = (props) => {
  return (
    <div className="session">
      <h3 id="session-label">Session Length</h3>
      <button disabled={props.play} onClick={() => props.handleIncrease("session")} id="session-increment">+</button>
      <strong id="session-length">{props.sessionLength}</strong>
      <button disabled={props.play} onClick={() => props.handleDecrease("session")} id="session-decrement">-</button>
    </div>
  )
}

const TimerComponent = (props) => {
  return (
    <div className="timer">
      <h3 id="timer-label">{props.title}</h3>
      <strong id="time-left">{props.formatTime()}</strong>
      <button onClick={props.handlePlay} id="start_stop">Start/Stop</button>
      <button onClick={props.handleReset} id="reset">Reset</button>
    </div>
  )
}

const App = () => {
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [timeType, setTimeType] = React.useState("Session");
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [play, setPlay] = React.useState(false);

  const timeout = setTimeout(() => {
    if (timeLeft && play) {
      setTimeLeft(timeLeft - 1)
    }
  }, 1000);


  const handleIncrease = (type) => {
    switch (type) {
      case "break":
        if (breakLength < 60) {
          setBreakLength(breakLength + 1)
        }
        break;
      case "session":
        if (sessionLength < 60) {
          setSessionLength(sessionLength + 1);
          setTimeLeft(timeLeft + 60);
        }
        break;
    }
  }

  const handleDecrease = (type) => {
    switch (type) {
      case "break":
        if (breakLength > 1) {
          setBreakLength(breakLength - 1)
        }
        break;
      case "session":
        if (sessionLength > 1) {
          setSessionLength(sessionLength - 1);
          setTimeLeft(timeLeft - 60);
        }
        break;
    }
  }

  const title = timeType === "Session" ? "Session" : "Break";


  const formatTime = () => {
    if (timeLeft <= 0) {
      return "00:00";
    }
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
  }



  const handlePlay = () => {
    clearTimeout(timeout);
    setPlay(!play);
  }


  const resetTimer = () => {
    const audio = document.getElementById("beep");
    if (!timeLeft && timeType === "Session") {
      setTimeLeft(breakLength * 60);
      setTimeType("Break");
      audio.play();
    }
    if (!timeLeft && timeType === "Break") {
      setTimeLeft(sessionLength * 60);
      setTimeType("Session");
      audio.pause();
      audio.currentTime = 0;
    }

  }



  const timer = () => {
    if (play) {
      timeout
      resetTimer();
    } else {
      clearTimeout(timeout)
    }
  }


  React.useEffect(() => {
    timer();
  }, [play, timeLeft, timeout]);



  const handleReset = () => {
    clearTimeout(timeout);
    setPlay(false);
    setTimeLeft(25 * 60);
    setBreakLength(5);
    setSessionLength(25);
    setTimeType("Session");
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };


  return (
    <div>
      <h1>25 + 5 Clock</h1>
      <div className="wrapper">
        <BreakComponent handleIncrease={handleIncrease} handleDecrease={handleDecrease} play={play} breakLength={breakLength} />
        <SessionComponent handleIncrease={handleIncrease} handleDecrease={handleDecrease} play={play} sessionLength={sessionLength} />
      </div>
      <div className="timer-wrapper">
        <TimerComponent handlePlay={handlePlay} handleReset={handleReset} title={title} formatTime={formatTime} />
      </div>
      <audio id="beep" preload="auto" src="./sound.mp3" />
    </div>

  )
}

ReactDOM.render(<App />, document.getElementById("root"));