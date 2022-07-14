import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.3 }) {
  const [board, setBoard] = useState(createBoard);
  console.log('Board: nrows, ncols, chance, board', nrows, ncols, chanceLightStartsOn, board);

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    console.log('createBoard');
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      let newRow = [];
      for (let j = 0; j < ncols; j++) {
        newRow.push(Math.random() < chanceLightStartsOn ? true : false);
      }
      initialBoard.push(newRow);
    }
    console.log(initialBoard);
    return initialBoard;
  }

  /** check the board in state to determine whether the player has won */
  function hasWon() {
    console.log('hasWon');
    // TODO: test and DOCString

    for (let i = 0; i < nrows; i++) {
      let trueValues = board[i].filter((g) => g === true);
      if (trueValues.length > 0) {
        return false;
      }
    }
    return true;
  }

  function flipCellsAround(coord) {
    console.log('flipCellsAround, coord', coord);
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        console.log('flipCell', y, x, boardCopy);
        // if this coord is actually on board, flip it        
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          console.log('flipping this cell', y, x);
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      //Make a (deep) copy of the oldBoard
      let newBoard = [];
      for (let i = 0; i < oldBoard.length; i++) {
        newBoard.push([...oldBoard[i]]);
      }
      console.log('newBoard', newBoard);
      //in the copy, flip this cell and the cells around it
      const flipCellsList = [[y, x], [y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1]];
      for (let cell of flipCellsList) {
        flipCell(cell[0], cell[1], newBoard);
      }

      //TODO: Refactor?
      //flipCellsList.map(cell=>flipCell(...cell, newBoard));

      // return the copy
      return newBoard;
    });
  }
  
  // TODO:
  // if the game is won, just show a winning msg & render nothing else

  function getID(idxC, idxR){
    return`${idxC}-${idxR}`;
  }

  // make table board
  //Cell({ flipCellsAroundMe, isLit })
  return (
    <table><tbody>
      {board.map((row, idxR) => (
        <tr>
          {row.map((c, idxC) => (
            <Cell
              flipCellsAroundMe={flipCellsAround}
              isLit={c} 
              id={getID(idxC, idxR)}/>
          ))}
        </tr>
      ))}
    </tbody></table>
  );
}

export default Board;
