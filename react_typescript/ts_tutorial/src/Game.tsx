import React from 'react';
import './App.scss';
import {Board} from './Board'
import {GameCell} from './utils'


// props => 親から渡される情報
// state => 自身の状態を管理するための値

interface GameHistory {
  squares: GameCell[];
}

interface GameS {
  history: GameHistory[];
  stepNumber: number;
  xIsNext: boolean;
}

export class Game extends React.Component<{}, GameS> { // Application全体を管理しているComponent
  constructor(props: any) { // classで作成されたオブジェクトの生成と初期化のためのmethod
    super(props);
    this.state = { // 基本的には，初期化のタイミングでthis.stateを定義する // Game classがもつstateは，[history, stepNumber, xIsNex]の3つ
      history: [{
        squares: Array(9).fill(GameCell.EMPTY),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i: number) { // Square -> Board -> からonClickを経由して伝播されてくる // 
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // 戻った時に将来の履歴を捨てるための処理
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? GameCell.X : GameCell.O;
    this.setState({ // GameのstateであるsquareやstepNumberを更新して，次のターンに移行する
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step: number) {
    this.setState({ // stateを更新する
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() { // Gameが作成された時に呼び出されるmethod
    const history = this.state.history; // おそらく上書きしないようにcopyしている
    const current = history[this.state.stepNumber]; // 現在の状態のsquareを表す定数を定義
    const winner = calculateWinner(current.squares); // 現在の状態のsquareを入力して，どちらかが勝利しているかどうかを判定して，その状態を定数として保持

    history.map((step, move) => { // なぜmoveとstepがあるんだ？？？ // history = [ { squares : Array }, ...,  { squares: Array } ] というdictを要素とするlistではないのか？？？
      console.log('step: ');
      console.log(step);
      console.log('move: ' + move);
    });
    const moves = history.map((step, move) => { // Gameの状態を飛ぶためのボタンのリストのコンポーネントを作成 // stepとmoveを引数として，moveに応じてbuttonのstringを生成，生成したstring (desc)を用いてボタンのリストを生成 // stepとmoveという引数はどこからきているんだ？？？
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


function calculateWinner(squares: GameCell[]) { // これはただのjsのfunction???
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