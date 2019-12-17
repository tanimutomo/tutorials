import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// props => 親から渡される情報
// state => 自身の状態を管理するための値

function Square(props) { // それぞれのマス目を関数で記述（関数だけど，returnでhtmlをかけるのか） // 関数コンポーネント // ここでのpropsはただの引数
  return ( // 関数コンポーネントは，呼ばれた無条件に，returnしてhtmlを返す（クラスでいうrender methodに対応）
    <button
      className="square" // class for jsx
      onClick={props.onClick} // 受け取ったpropsのonClick methodをcall
    >
      {props.value}
    </button> // 受け取ったpropsのvalueが表示名になる
  );
}

class Board extends React.Component { // クラスコンポーネント // 3x3のボードを定義している // 親はGame Component // Gameからは <Board squares, onClick>として渡されているので，propsはsquaresと，onClickを保持している
  renderSquare(i) { // 定義されたものはthis.renderSquareで呼び出せる
    return (
      <Square // Squareという関数コンポーネントをcall // squareには，propsとしてvalue, onClickを渡している
        value={this.props.squares[i]} // Gameから渡されるsquaresのi番目の値を表示
        onClick={() => this.props.onClick(i)} // Gameから渡されたonClickをiを引数としてcall
      />
    );
  }

  render() { // <Board ...>とされた時に呼び出されるもの
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)} {/* renderSquare経由で，Squareをcallしてマスを描画 */}
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


class Game extends React.Component { // Application全体を管理しているComponent
  constructor(props) { // classで作成されたオブジェクトの生成と初期化のためのmethod
    super(props);
    this.state = { // 基本的には，初期化のタイミングでthis.stateを定義する // Game classがもつstateは，[history, stepNumber, xIsNex]の3つ
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) { // Square -> Board -> からonClickを経由して伝播されてくる // 
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // 戻った時に将来の履歴を捨てるための処理
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ // GameのstateであるsquareやstepNumberを更新して，次のターンに移行する
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({ // stateを更新する
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() { // Gameが作成された時に呼び出されるmethod
    const history = this.state.history; // おそらく上書きしないようにcopyしている
    const current = history[this.state.stepNumber]; // 現在の状態のsquareを表す定数を定義
    const winner = calculateWinner(current.squares); // 現在の状態のsquareを入力して，どちらかが勝利しているかどうかを判定して，その状態を定数として保持

    const moves = history.map((step, move) => { // Gameの状態を飛ぶためのボタンのリストのコンポーネントを作成
      const desc = move ? // 三項演算子 ( condition ? True : False ) // moveがTrueなら，状態を戻すためのボタンの文字列を生成，Falseなら，最初に戻すためのボタンの文字列を生成
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}> {/* keyはobjectを繰り返しrenderingするためのindexを示している */}
          <button onClick={() => this.jumpTo(move)}> {/* buttonが押されると，jumpToを実行して，stepNumberと次のplayerを示す変数が更新される */}
            {desc}
          </button>
        </li>
      );
    });

    let status; // statusという変数を定義 // letで定義すると，ブロックlocal変数になる // statusには上に現在のゲームの状態を表示するための文字列が格納される
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return ( // Game classが呼び出された時に返される
      <div className="game">
        <div className="game-board"> {/* 左側はBoard */}
          <Board // Board componentにsquaresとonClickを渡している
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} // Boardでprops.onClickがcallされると，this.handleClickがcallされる
          />
        </div>
        <div className="game-info"> {/* 右側は状態を戻したりするためのボタンなどの情報が表示されている */}
          <div>{status}</div> {/* statusの文字列を表示 */}
          <ol>{moves}</ol> {/* 状態を過去に遷移するための文字列を繰り返し表示 */}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />, // Gameが一番親のcomponentなので，Gameをrenderingする
  document.getElementById('root')
);


function calculateWinner(squares) { // これはただのjsのfunction???
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
