import React, { Component } from 'react';
import './App.css';
import Ionicon from 'react-ionicons';
import { PageHeader, Button, ControlLabel } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class App extends Component {

  constructor(props) {

    super(props);
    
    this.state = {
      grid: [],
      mines: [],
      gameover: false,
      xvalue: 8,
      yvalue: 8,
      mineCount: 7,
      points: 0,
      endGame: 0
    };
  }

  componentDidMount() {
    this.newGame();
  }

  render() {
    return (
      <div style={gameBoardStyle}>
        <div className='header'>
          <PageHeader>MineSweeper</PageHeader>
        </div>

        <div className='gameTable'>
          <table id="gameTable">
            <tbody>

              {this.state.grid.map((item, x) => {
                return(
                  <tr key={x} id={x}>
                    {item.map((element, y) => {

                      // set cell coordinates (example: 'x: 0, y: 0')
                      var coord = "x: " + x + ", y: " + y;

                      // style the mines with flames
                      if(this.state.grid[x][y] === '!'){
                        return(
                          <td key={coord}>
                            <Button onClick={() => this.checkCell(x, y, coord)} id={coord} className={this.state.gameover ? 'btnGameover' : 'gameBtn'}>
                              <Ionicon icon="md-flame" rotate={true} fontSize="10px" color={this.state.gameover ? "orange" : "#777"}/>
                            </Button>
                          </td>
                        );
                      }
                      
                      else {
                        return(
                          <td key={coord}>
                            <Button onClick={() => this.checkCell(x, y, coord)} id={coord} className={this.state.gameover ? 'btnGameover' : 'gameBtn'}>{element}</Button>
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>

        <Button className='newGameBtn' onClick={() => this.newGame()}>New Game</Button>
        
        <div className='sliders'>

          <ControlLabel>Difficulty</ControlLabel>
          <Slider className='sliderSpacing' id='mineCount' min={5} max={35} defaultValue={15} onChange={(value) => this.mineCountChanged(value)}/>

          <ControlLabel>Board Size: {this.state.xvalue} x {this.state.yvalue}</ControlLabel>
          <Slider className='sliderSpacing' id='boardSize' min={6} max={12} defaultValue={8} onChange={(value) => this.boardSizeChanged(value)}/>

        </div>
      </div>
    );
  }

  mineCountChanged (count) {
    this.setState({ mineCount: count });
  }

  boardSizeChanged (size) {
    this.setState({
      xvalue: size,
      yvalue: size
    });
  }

  setMineCoords() {
    let mineCount = this.state.mineCount;
    let minesToSet = [];
    
    // for # of mines, generate random coordinates
    while(minesToSet.length < mineCount){
      let xcoord = Math.floor((Math.random() * (this.state.xvalue-1)) + 0);
      let ycoord = Math.floor((Math.random() * (this.state.yvalue-1)) + 0);
      let minecoords = xcoord + ', ' + ycoord;

      // TODO: check if mine exists before pushing
      minesToSet.push(minecoords);
    }

    console.log("minesToSet: ", minesToSet);

    return minesToSet;
  }

  setInitialGrid() {
    var mines = this.setMineCoords();
    let emptyGrid = [];

    for(let i = 0; i < this.state.xvalue; i++) {
      
      emptyGrid[i] = [];

      for(let j = 0; j < this.state.yvalue; j++) {
        // set initial styles
        try {
          let cellToStyle = document.getElementById("x: " + i + ", y: " + j);

          // TODO:
          // if(cellToStyle.innerHTML === '!'){
          //   cellToStyle.innerHTML = '';
          // }
          
          cellToStyle.className = 'gameBtn';
          
        } catch (error) {
          // no cell to style
        }
        
        mines.forEach(function(mine) {
          // check if mines exists, set to '!'
          if(mine === (i + ', ' + j)){
            emptyGrid[i][j] = '!';
            console.log("mine set! ", i, j);
          }
          else{
            // not a bomb
            if(emptyGrid[i][j] !== '!'){
              emptyGrid[i][j] = 0;
            }
          }
        });
      }
    }

    return emptyGrid;
  }

  newGame() {
    // reset game
    this.setState({
      grid: [],
      gameover: false,
      points: 0
    });

    let initialGrid = this.setInitialGrid();
    let endGame = 0;

    initialGrid.map((row, xindex) => {
      row.map((cell, yindex) => {

        if(initialGrid[xindex][yindex] !== '!'){
          let mineSurrounding = 0;
          // check for surrounding mines
          for(let x = -1; x < 2; x++){
            for(let y = -1; y < 2; y++){
              try {
                if(initialGrid[xindex+x][yindex+y] === '!'){
                  mineSurrounding++;
                }
              } catch (error) {
                // cell doesnt exist (out of bounds)
              }
            }
          }  

          // set cell value to # of surrounding mines
          initialGrid[xindex][yindex] = mineSurrounding;

          // increment endGame total (points to win)
          endGame += mineSurrounding;
        }
      });
    });

    // send newly generated grid to state
    this.setState({grid: initialGrid, endGame: endGame});
  }

  winningState() {
    let gridToStyle = this.state.grid;
      for(let x = 0; x < this.state.xvalue; x++){
        for(let y = 0; y < this.state.yvalue; y++){
          let btn = document.getElementById("x: " + x + ", y: " + y);
          btn.className = 'winningBtn';
        }
      }
  }

  checkCell(x, y, coord) {
    let points = this.state.points;
    let endGame = this.state.endGame;

    console.log("coord: " + coord);
    console.log("x: " + x + " y: " + y);
    let btn = document.getElementById(coord);
    btn.className = 'clicked';

    // TODO :
    //place value on all clicked cells except mines and zeros
    let val = this.state.grid[x][y].toString();

    console.log(val);
    //TODO:
    // if(val !== '!') {
    //   btn.innerHTML = val;
    // }
   
    // TODO: ALL ZEROS
    // if clicked cell is 0, set all zeros touching to clicked
    if(this.state.grid[x][y] === 0){
      for(let xindex = -1; xindex < 2; xindex++){
        for(let yindex = -1; yindex < 2; yindex++){
          try {
            let touchingZero = "x: " + (x+xindex) + ", y: " + (y+yindex);
            let touchingCell = document.getElementById(touchingZero);
            touchingCell.className = 'clicked';

            //TODO: if not a mine, give cell point value
            let touchingCellVal = this.state.grid[x+xindex][y+yindex].toString();
            if(touchingCellVal !== '!'){
              touchingCell.innerHTML = touchingCellVal;
            }
          
            points += parseInt(touchingCell.innerHTML);
          } catch (error) {
            // cell doesnt exist (out of bounds)
          }
        }
      }  
    }

    // check for endgame
    if (this.state.grid[x][y] === '!') {
      this.setState({ gameover: true });
    }
    else {
      points += parseInt(btn.innerHTML);

      if(points >= endGame){
        this.winningState();
      }
      this.setState({ points: points });
    }
    console.log("points: " + points);
    console.log("endGame: " + endGame);
  }
}

const gameBoardStyle = {
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center'
}

export default App;