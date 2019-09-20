import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
                    key={i}
                    value={this.props.squares[i]} 
                    onClick={() => this.props.onClick(i)}
                />;
    }

    render() {

        let counter = 0;
        let gameboard =[];

        for (let i = 0; i < 3; i++) {
            let rows = [];

            for (let j = 0; j < 3; j++) {
                counter += 1;
                rows.push(this.renderSquare(counter));
            }

            gameboard.push(<div className="board-row" key={i}>{rows}</div>);
        }

        return (
            <div> 
                { gameboard } 
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
            xIsNext: true,
            stepNumber: 0,
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const [row, col] = getRowAndColumn(i);

        if (CalculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: squares,
                row: row,
                col: col,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }    

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = CalculateWinner(current.squares);
        const isDraw = checkIfDraw(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 
                         "Go to move #" + move + ", coordinates : [" + step.row + ", " + step.col + "]" : 
                         "Go to game start !";

            const output = (this.state.stepNumber === move) ? (<b>{desc}</b>) : (desc);
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} >
                        {output}
                    </button>
                </li>
            );
        });

        let status;

        if (isDraw) {
            status = "DRAW, GAME OVER !!!";
        }
        else if (winner) {
            status = "Winner is : " + winner;
        } else {
            status = "Next move by : " + (this.state.xIsNext ? "X" : "O");
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

function CalculateWinner(squares) {
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

    for (let i=0; i<lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}

function checkIfDraw(squares) {
    for (let i=0; i<squares.length; i++) {
        if (!squares[i]) {
            return false;
        }
    }

    return true;
}

function getRowAndColumn(i) {
    const row = parseInt((i / 3) + 1);
    const col = parseInt((i % 3) + 1);

    return [row, col];
}