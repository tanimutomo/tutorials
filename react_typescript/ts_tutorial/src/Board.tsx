import React from 'react';
import './App.scss';
import {Square} from './Square'
import {GameCell} from './utils'


interface BoardP {
  squares: GameCell[];
  onClick: (i: number) => void;
}


export class Board extends React.Component<BoardP, {}> { // クラスコンポーネント // 3x3のボードを定義している // 親はGame Component // Gameからは <Board squares, onClick>として渡されているので，propsはsquaresと，onClickを保持している
  renderSquare(i: number) { // 定義されたものはthis.renderSquareで呼び出せる
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
