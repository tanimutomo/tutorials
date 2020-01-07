import React from 'react';
import './App.scss';
import {GameCell} from './utils'


export const Square: React.FC<{ onClick: () => void, value: GameCell  }> = (props) => { // それぞれのマス目を関数で記述（関数だけど，returnでhtmlをかけるのか） // 関数コンポーネント // ここでのpropsはただの引数 return ( // 関数コンポーネントは，呼ばれた無条件に，returnしてhtmlを返す（クラスでいうrender methodに対応）
  return (
    <button
      className="square" // class for jsx
      onClick={props.onClick} // 受け取ったpropsのonClick methodをcall
    >
      {props.value}
    </button> // 受け取ったpropsのvalueが表示名になる
  )
};
