import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const levelData = {
  1: {
    name: "Beginner",
    time: 60,
    sentences: [
      "Practice makes perfect when you type with patience and focus. Each keystroke helps you build rhythm, confidence, and precision, turning small efforts.",
      "Typing helps you improve accuracy and speed as your fingers learn to flow naturally across the keyboard. With each word you type, your focus sharpens and your timing.",
      "Stay calm, stay focused, and type your way to success. Every correct word you type is a step closer to mastering your typing skills and improving your mental."
    ]
  },
  2: {
    name: "Intermediate",
    time: 45,
    sentences: [
      "React empowers developers to build fast, responsive, and modern web interfaces using reusable components. It simplifies user interface management, allowing developers to focus on creativity and logic instead of repetitive code.",
      "The journey to mastery is built through consistent practice and focus on details. Whether it's coding, typing, or learning a new skill, small daily efforts compound into something extraordinary over time.",
      "Typing fast while maintaining accuracy is a balance of rhythm and precision. As you type more, your mind adapts to recognize word patterns and your fingers start moving effortlessly across the keyboard."
    ]
  },
  3: {
    name: "Advanced",
    time: 30,
    sentences: [
     "The art of fast and precise typing requires dedication, rhythm, and intense concentration. Each word you type becomes a reflection of your control, focus, and the hours you’ve spent honing your craft. It’s not just about hitting the keys quickly.It’s about syncing your mind and fingers in perfect harmony.",
    "JavaScript and React together make the modern web dynamic, interactive, and efficient. React’s component-based design allows developers to craft reusable, scalable, and organized user interfaces, while JavaScript adds flexibility and power to bring those interfaces to life. Together, they form the backbone of modern frontend development.",
     "Consistency in effort transforms ordinary practice into extraordinary performance. Every small step forward, every minute of focus, and every moment of persistence adds up over time. Just like great coders and typists, you don’t master your craft overnight — you evolve through patience, repetition, and the willingness to improve a little more each day."
    ]
  }
};


// ===== Particle Background Component =====
function ParticleBackground() {
  useEffect(() => {
    const canvas = document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        dx: Math.random() * 1 - 0.5,
        dy: Math.random() * 1 - 0.5,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,255,0.4)";
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return <canvas id="bgCanvas" style={{ position: "absolute", inset: 0, zIndex: -2 }} />;
}

// ===== Main App =====
export default function App() {
  const [level, setLevel] = useState(1);
  const [text, setText] = useState([]);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(levelData[level].time);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [showResult, setShowResult] = useState(false);
  const [highlightKey, setHighlightKey] = useState("");
  const inputRef = useRef(null);

  useEffect(() => generateSentence(), [level]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isActive) {
      finishGame();
    }
  }, [isActive, timeLeft]);

  useEffect(() => {
    const handleKeyDown = (e) => setHighlightKey(e.key.toUpperCase());
    const handleKeyUp = () => setHighlightKey("");
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const generateSentence = () => {
    const sentences = levelData[level].sentences;
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    setText(sentence.split(" "));
    setInput("");
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
    const typedChars = value.replace(/\s/g, "");
    const correctChars = text.join("").split("").filter((char, i) => char === typedChars[i]).length;
    const acc = typedChars.length === 0 ? 100 : Math.round((correctChars / typedChars.length) * 100);
    setAccuracy(acc);
  };

  const startGame = () => {
    setTimeLeft(levelData[level].time);
    setIsActive(true);
    setWpm(0);
    setAccuracy(100);
    setShowResult(false);
    generateSentence();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const finishGame = () => {
    setIsActive(false);
    const wordsTyped = input.trim().split(" ").length;
    setWpm(wordsTyped);
    setShowResult(true);
  };

  const nextLevel = () => {
    if (level < 3) {
      setLevel(level + 1);
      setShowResult(false);
      setTimeLeft(levelData[level + 1].time);
      startGame();
    } else {
      alert("🎉 You completed all levels!");
    }
  };

  const handleClickKey = (key) => {
    if (!isActive) return;
    if (key === "SPACE") setInput((prev) => prev + " ");
    else if (key === "BACKSPACE") setInput((prev) => prev.slice(0, -1));
    else setInput((prev) => prev + key.toLowerCase());
    setHighlightKey(key);
    setTimeout(() => setHighlightKey(""), 150);
  };

  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];

  if (showResult) {
    return (
      <div className="app-container">
        <ParticleBackground />
        <div className="result-page">
          <div className="result-card glass-card">
            <h2 className="result-title">🎯 Level {level} Complete!</h2>
            <p className="level-name">🏆 {levelData[level].name} Level</p>
            <div className="result-stats">
              <div className="stat-item"><span>⚡</span> <b>{wpm} WPM</b></div>
              <div className="stat-item"><span>🎯</span> <b>{accuracy}% Accuracy</b></div>
              <div className="stat-item"><span>⏱</span> <b>{levelData[level].time}s</b></div>
            </div>
            <button className="btn-gradient" onClick={startGame}>🔁 Retry Level</button>
            {level < 3 && (
              <button className="btn-gradient next-level-btn" onClick={nextLevel}>
                🚀 Next Level ({levelData[level + 1].name})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <ParticleBackground />
      <div className="app">
        <h1 className="title">⚡ Typing Master Pro</h1>
        <p className="level-display">🎮 Level {level} - {levelData[level].name}</p>
        <div className="timer-box">
          <span className={timeLeft < 10 ? "low-time" : ""}>⏱ {timeLeft}s</span>
        </div>

        <div className="text-box glass-card">
          {text.map((word, i) => {
            const typedWords = input.trim().split(" ");
            const typedWord = typedWords[i] || "";
            const correct = typedWord === word;
            return (
              <span key={i} style={{ color: typedWord ? (correct ? "#00ff88" : "#ff4d4d") : "#ccc" }}>
                {word}{" "}
              </span>
            );
          })}
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          disabled={!isActive}
          placeholder="Start typing here..."
        />

        <div className="stats glass-card">
          <div><b>WPM:</b> {wpm}</div>
          <div><b>Accuracy:</b> {accuracy}%</div>
          <div><b>Words:</b> {input.trim().split(" ").length}</div>
        </div>

        <button onClick={startGame} className="btn-gradient">
          {isActive ? "🔁 Restart" : " Start Test"}
        </button>

        <div className="keyboard">
          {keys.map((row, i) => (
            <div key={i} className="keyboard-row">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleClickKey(key)}
                  className={`key ${highlightKey === key ? "active" : ""}`}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
          <div className="keyboard-row">
            <button onClick={() => handleClickKey("SPACE")} className="key space">Space</button>
            <button onClick={() => handleClickKey("BACKSPACE")} className="key back">⌫</button>
          </div>
        </div>
      </div>
    </div>
  );
}
