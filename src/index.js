import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square doesn't maintain any state, so we can use a more terse Function Component which only renders.
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} // this is named onClick only for clarity and is not actually bound to an event, like button's onClick in Square
      />);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // We create a shallow clone of squares here.
    // Immutability is important in React for several reasons:
    // 1. Keeping a record of history is easy
    // 2. Detecting changes is easy when the object reference is different
    // 3. Determining when to re-render components is easier
    // (https://reactjs.org/tutorial/tutorial.html#data-change-without-mutation)
    const squares = current.squares.slice();

    if (squares[i] || calculateWinner(squares)) {
      // If the square is filled in or the game is already won, don't modify the state any further
      return;
    }

    squares[i] = getNextMove(this.state.stepNumber);

    // Brand new state object (immutability)
    this.setState({
      history: history.concat([{ // concat returns a new array
        squares: squares
      }]),
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
    });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (allSquaresFilled(current.squares)) {
        status = "This game is a tie!";
      } else {
        status = 'Next player: ' + getNextMove(this.state.stepNumber);
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// Return null, 'X', or 'O' as appropriate
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

function getNextMove(step) {
  return (step % 2 === 0) ? 'X' : 'O';
}

function allSquaresFilled(squares) {
  return squares
    .filter(square => square === null)
    .length === 0;
}
