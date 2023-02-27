import React, { useState } from "react";

import { Board } from "./components/Board";
import { ResetButton } from "./components/ResetButton";
import { ScoreBoard } from "./components/ScoreBoard";
import "./App.css";
const App = () => {
  const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const [xPlaying, setXPlaying] = useState(true);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [scores, setScores] = useState({ xScore: 0, oScore: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const handleBoxClick = (boxIdx) => {
    // Step 1: Update the board
    const updatedBoard = board.map((value, idx) => {
      if (idx === boxIdx) {
        return xPlaying ? "X" : "O";
      } else {
        return value;
      }
    });
    setBoard(updatedBoard);

    // Step 2: Check if either player has won the game
    const winner = checkWinner(updatedBoard);

    if (winner) {
      // Step 3a: If there's a winner, update the score and highlight the winning boxes
      setWinner(winner);
      if (winner === "O") {
        let { oScore } = scores;
        oScore += 1;
        setScores({ ...scores, oScore });
      } else {
        let { xScore } = scores;
        xScore += 1;
        setScores({ ...scores, xScore });
      }
      const winBoxes = WIN_CONDITIONS.filter(([x, y, z]) => {
        return (
          updatedBoard[x] &&
          updatedBoard[x] === updatedBoard[y] &&
          updatedBoard[y] === updatedBoard[z]
        );
      }).flat();
      const updatedBoardWithColors = updatedBoard.map((value, idx) => {
        if (winBoxes.includes(idx)) {
          return <div className="box1"></div>;
        } else {
          return value;
        }
      });
      setBoard(updatedBoardWithColors);
    } else if (updatedBoard.every((val) => val !== null)) {
      // Step 3b: If there's a draw, set the winner to "draw"
      setWinner("draw");
    }

    // Step 4: Change active player
    setXPlaying(!xPlaying);
  };

  const checkWinner = (board) => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [x, y, z] = WIN_CONDITIONS[i];
      if (board[x] && board[x] === board[y] && board[y] === board[z]) {
        setGameOver(true);
        return board[x];
      }
    }
  };

  const resetBoard = () => {
    setGameOver(false);
    setWinner("");
    setBoard(Array(9).fill(null));
  };

  return (
    <div className="App">
      <ScoreBoard scores={scores} xPlaying={xPlaying} />

      <Board board={board} onClick={gameOver ? resetBoard : handleBoxClick} />
      <ResetButton resetBoard={resetBoard} />
      {winner && (
        <>
          {winner === "draw" ? (
            <h2 className="winner">Match is draw!</h2>
          ) : (
            <>
              <h2 className="winner">{winner} has won!</h2>
              <img src="/cong.gif" className="cong-pic" />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
