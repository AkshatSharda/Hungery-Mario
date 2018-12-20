import React, { PureComponent } from 'react';
import Mario from './mario.png';
import Mushroom from './mushroom.jpg';

const GridBlock = (props: Object) => {
  return (
    <div style={styles.block}>
      {props.isFoodAvailable && (
        <img src={Mushroom} style={styles.mushroom} alt="food" />
      )}
      {props.isMarioPosition && (
        <img src={Mario} style={styles.mario} alt="mario" />
      )}
    </div>
  );
};

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: 0,
      columns: 0,
      marioPosition: { x: 0, y: 0 }
    };
    this.timeInterval = null;
    this.stepCount = 0;
    this.foodCount = 0;
    document.addEventListener('keydown', this.onKeyDown);
  }

  updateGrid(
    newMarioPosition: Object,
    oldMarioPosition: Object,
    gridArray: Array<Array<Object>>
  ) {
    const newGridArray = gridArray.map(arr => arr.slice());
    newGridArray[oldMarioPosition.y][
      oldMarioPosition.x
    ].isMarioPosition = false;
    newGridArray[oldMarioPosition.y][
      oldMarioPosition.x
    ].isFoodAvailable = false;
    newGridArray[newMarioPosition.y][newMarioPosition.x].isMarioPosition = true;

    this.setState({
      marioPosition: newMarioPosition,
      gridArray: newGridArray
    });
  }

  updateMarioPosition = (direction: string, nextCoordinate: number) => {
    const {
      marioPosition: oldMarioPosition,
      columns,
      rows,
      gridArray
    } = this.state;
    const newMarioPosition: Object = { ...oldMarioPosition };
    let newNextCoordinate = nextCoordinate;
    if (direction === 'HORIZONTAL') {
      if (oldMarioPosition.x === columns - 1) {
        newMarioPosition['x'] = oldMarioPosition.x + -1;
        newNextCoordinate = -1;
      } else if (oldMarioPosition.x === 0) {
        newMarioPosition['x'] = oldMarioPosition.x + 1;
        newNextCoordinate = 1;
      } else {
        newMarioPosition['x'] = oldMarioPosition.x + nextCoordinate;
      }
    } else {
      if (oldMarioPosition.y === rows - 1) {
        newMarioPosition['y'] = oldMarioPosition.y + -1;
        newNextCoordinate = -1;
      } else if (oldMarioPosition.y === 0) {
        newMarioPosition['y'] = oldMarioPosition.y + 1;
        newNextCoordinate = 1;
      } else {
        newMarioPosition['y'] = oldMarioPosition.y + nextCoordinate;
      }
    }

    const { x, y } = newMarioPosition;
    this.stepCount++;
    this.updateGrid(newMarioPosition, oldMarioPosition, gridArray);
    this.timeInterval && clearTimeout(this.timeInterval);
    if (this.foodCount < rows) {
      if (gridArray[y][x].isFoodAvailable) {
        this.foodCount++;
      }
      this.timeInterval = setTimeout(() => {
        this.updateMarioPosition(direction, newNextCoordinate);
      }, 350);
    } else {
      alert(
        `Hungry mario is overloaded with food, it took him ${
          this.stepCount
        } steps.`
      );
    }
  };

  onKeyDown = event => {
    switch (event.code) {
      case 'ArrowRight': {
        this.updateMarioPosition('HORIZONTAL', +1);
        break;
      }

      case 'ArrowLeft': {
        this.updateMarioPosition('HORIZONTAL', -1);
        break;
      }

      case 'ArrowUp': {
        this.updateMarioPosition('VERTICAL', -1);
        break;
      }

      case 'ArrowDown': {
        this.updateMarioPosition('VERTICAL', +1);
        break;
      }
      default: {
        break;
      }
    }
  };

  rowChange = (event: Object) => {
    this.setState({
      rows: event.target.value,
      showGame: false
    });
  };

  columnChange = (event: Object) => {
    this.setState({
      columns: event.target.value,
      showGame: false
    });
  };

  getGridArray(rows, columns) {
    const { marioPosition } = this.state;
    const gridArray = [];
    let columnArray = [];
    for (let i = 0; i < rows; i++) {
      columnArray = [];
      for (let j = 0; j < columns; j++) {
        columnArray.push({
          row: i,
          column: j,
          isMarioPosition:
            marioPosition.x === i && marioPosition.y === j ? true : false,
          isFoodAvailable: false
        });
      }
      const columnIndex =
        i === 0
          ? parseInt(Math.random() * columns - 1) + 1
          : parseInt(Math.random() * columns);
      console.log(columnIndex);
      columnArray[columnIndex].isFoodAvailable = true;
      gridArray.push(columnArray);
    }
    return gridArray;
  }

  onSubmit = () => {
    const { rows, columns } = this.state;
    if (!isNaN(rows) && rows > 0 && !isNaN(columns) && columns > 0) {
      const gridArray = this.getGridArray(rows, columns);
      this.stepCount = 0;
      this.foodCount = 0;
      this.timeInterval && clearTimeout(this.timeInterval);
      this.setState({
        showGame: true,
        gridArray: gridArray,
        marioPosition: { x: 0, y: 0 }
      });
    } else {
      alert('Please enter the valid rows and columns');
    }
  };

  renderGrid(rows, columns) {
    const { gridArray } = this.state;
    return gridArray.map(rows => {
      const rowArray = rows.map(block => {
        return (
          <GridBlock
            row={block.row}
            column={block.column}
            isFoodAvailable={block.isFoodAvailable}
            isMarioPosition={block.isMarioPosition}
          />
        );
      });
      return <div style={styles.row}>{rowArray}</div>;
    });
  }

  renderGame() {
    const { showGame, rows, columns } = this.state;
    if (showGame) {
      return (
        <div>
          <h1 style={styles.title}>Press the arrow key to start</h1>
          <div style={styles.gridContainer}>
            {this.renderGrid(rows, columns)}
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div style={styles.mainContainer}>
        <div style={styles.container}>
          <h1 style={styles.title}>Hungry Mario</h1>
          <div style={styles.inputContainer}>
            <div style={styles.inputText}>Enter number of rows</div>
            <input type="number" onChange={this.rowChange} />
          </div>
          <div style={styles.inputContainer}>
            <div style={styles.inputText}>Enter number of columns</div>
            <input type="number" onChange={this.columnChange} />
          </div>
          <input
            onClick={this.onSubmit}
            style={styles.button}
            type="submit"
            value="submit"
          />
        </div>
        <div style={styles.container}>{this.renderGame()}</div>
      </div>
    );
  }
}

const styles = {
  container: {
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: window.innerHeight,
    alignItems: 'center'
  },
  mainContainer: {
    display: 'flex',
    flex: 1
  },
  inputContainer: {
    margin: 16,
    display: 'flex'
  },
  title: {
    marginTop: 70
  },
  inputText: {
    width: 250
  },
  button: {
    width: 150,
    height: 40,
    marginTop: 32
  },
  block: {
    height: 40,
    width: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'rows',
    display: 'flex'
  },
  gridContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 40,
    flexDirection: 'column'
  },
  mushroom: {
    height: 20,
    width: 20
  },
  mario: {
    height: 30,
    width: 30,
    position: 'absolute',
    objectFit: 'contain'
  }
};

export default App;
