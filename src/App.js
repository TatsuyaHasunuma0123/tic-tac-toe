// ! useStateは、値が更新されると自動で再レンダリングされる
import React from "react";
import { useState } from "react";
import "./App.css";

function Square({ value, onSquareClick, winnerLine }) {
  if (winnerLine) {
    return (
      <button className="square_blue" onClick={onSquareClick}>
        {value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    );
  }
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    console.log(i);
    //　枠が埋まっているか。or 勝者がいるか。
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // squaresをばらして、次の番の文字を決める。
    const nextSquares = squares.concat();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    //Game の HandlePlayを実行
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const winnerLine = calculateWinnerLine(squares);
  let isWinnerLine;

  console.log(winnerLine);
  let who;

  if (winner) {
    who = "Winner:" + winner;
  } else if (
    !squares.includes(null) &&
    JSON.stringify(winnerLine) === JSON.stringify([-1, -1, -1])
  ) {
    who = "Draw";
  } else {
    who = "Next ：" + (xIsNext ? "X" : "O");
  }

  let singleSquare = [];
  const length = 3;
  for (var h = 0; h < length; h++) {
    singleSquare.push(<div className="board-row"></div>);
    for (var w = 0; w < length; w++) {
      const key = length * h + w;
      if (winnerLine.includes(key)) {
        isWinnerLine = true;
      } else {
        isWinnerLine = false;
      }
      singleSquare.push(
        <Square
          value={squares[key]}
          onSquareClick={() => handleClick(key)}
          winnerLine={isWinnerLine}
        />
      );
    }
  }

  return (
    <>
      <div className="status">{who}</div>
      {singleSquare.map((square, index) => (
        <React.Fragment key={index}>{square}</React.Fragment>
      ))}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); //指した手を記憶する配列
  const [currentMove, setCurrentMove] = useState(0); // 今のターン
  const [isUpper, setIsUpper] = useState(true);
  const currentSquares = history[currentMove]; // 今のターンまでのボードの状態
  const xIsNext = currentMove % 2 === 0; // 偶数ターンの場合はＸのターン

  // *Boardのマスが押されたら動く関数
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; //! ボタンを押したときに、切り抜く
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // ! movesはここから下で代入しとる
  const moves = history.map((squares, move) => {
    let description;
    let isCurrentMove;
    if (move === currentMove) {
      description = "You are at move #" + move;
      isCurrentMove = false;
    } else if (move > 0) {
      description = "Go to move #" + move;
      isCurrentMove = true;
    } else {
      description = "Go to game start";
      isCurrentMove = true;
    }

    if (isCurrentMove) {
      return (
        <li key={move}>
          <button className="btn-border" onClick={() => jumpTo(move)}>
            {description}
          </button>
        </li>
      );
    } else {
      return (
        <li className="move" key={move}>
          {description}
        </li>
      );
    }
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <ol>{isUpper ? moves : moves.reverse()}</ol>{" "}
          <div className="switcher">
            <h2>降順/昇順</h2>
            <div className="toggle_button">
              <input
                className="toggle_input"
                type="checkbox"
                id="toggle"
                onChange={() => setIsUpper((prev) => !prev)}
                checked={isUpper}
              ></input>
              <label className="toggle_label" htmlFor="toggle"></label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateWinnerLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [-1, -1, -1];
}

export default Game;
