import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render(<Demo side={0} start={Date.now()}/>, root);
}

// App state is:
//   { tiles: [List of SingleTile] }
//
// A SingleTile is:
//   { letter: String, status: Int }
// 
// Status: 0 -> Closed
//         1 -> Flipped
//         2 -> Done

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      clickedTiles: 0,
      seenThis: [0,0,0,0,0,0,0,0],
      points: 0,
    };
  }

    populateBoard() {
      let letterSet = ["A","B","C","D","E","F","G","H"];
      letterSet = letterSet.concat(letterSet); 
      this.shuffle(letterSet)
      let xs = []; // empty array

      _.map(letterSet, (listValue) => {
        return xs.push({ letter: listValue, status: 0 });
      });

      this.setState({ 
        tiles: xs, 
        clickedTiles: 0,
        seenThis: [0,0,0,0,0,0,0,0],
        points: 0,});
    }

    shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
           j = Math.floor(Math.random() * (i + 1));
           x = a[i];
           a[i] = a[j];
           a[j] = x;
        }
    }

    componentDidMount() {
       this.populateBoard();
    }

    componentWillUnmount() {
       clearInterval(this.interval);
    }

    checkIfGameFinished() {
        var sum = 0;
        let xs = _.map(this.state.tiles, (tile) => {
          sum = sum + tile.status;
        });

        if (sum == 32) {
          alert(" \n You Won! \n \n \n " + this.state.points + " points!\n \n \n Play Again?");
          this.populateBoard();
        }
    }

    hideFlipped() {
      if(this.state.clickedTiles >= 2) {

      let xs = _.map(this.state.tiles, (tile) => {
      if (tile.status == 1) {
            return _.extend(tile, {status: 0});
         }
      else {
            return tile;
          }
       });

        this.setState({ tiles: xs, clickedTiles: 0});
      } 
    }

  toggle(recievedTile) {
    
    let xs = _.map(this.state.tiles, (tile) => {
      if (tile.status == 1 && tile.letter == recievedTile.letter && tile != recievedTile) {
        this.addToSeen(tile.letter, true);
        _.extend(recievedTile, {status: 2});
        return  _.extend(tile, {status: 2});
      }
      else if (tile.status == 0 && tile == recievedTile) {
        this.addToSeen(tile.letter, false);
        return _.extend(tile, {status: 1});
      }
      else {
        return tile;
      }
    });

    let clicks = this.state.clickedTiles;
    this.setState({ tiles: xs , clickedTiles: clicks+1});
    setTimeout(() => {
        this.hideFlipped(),
        this.checkIfGameFinished();
      }, 1000);
  }

  addToSeen (letter, givePoints) {
      let letterSet = ["A","B","C","D","E","F","G","H"];
      let cursor = 0;

      _.map(letterSet, (listValue) => {
           if(listValue == letter){
               let xs = this.state.seenThis;
               let earnedPoints = 0;
                   
               xs[cursor]++;
               console.log(xs);

               if(givePoints) {
                   if (xs[cursor] <= 4) {
                      earnedPoints = 15;
                   } else if (xs[cursor] <= 8) {
                      earnedPoints = 10;  
                   } else {
                      earnedPoints = 5;
                   }
               }
               
               let points = this.state.points;
               return this.setState({ seenThis: xs, points: (earnedPoints + points)});
           } else {
              cursor++;
           }
      });
  }

  render() {

      let tile_list_0 = _.map(this.state.tiles, (tile, ii) => {
           return <SingleTile tile={tile} toggle={this.toggle.bind(this)} key={ii} />
      });

      let tile_list_1 = tile_list_0.splice(0,4)
      let tile_list_2 = tile_list_0.splice(0,4)
      let tile_list_3 = tile_list_0.splice(0,4)

    return (
     <div> 

      <div className="row">
         <h2 id="point">Points earned: {this.state.points}</h2>
         <div  className="restart-button">
           <Button onClick={ () => {this.populateBoard();} }>Restart</Button>
         </div>
      </div> 

       <div className="row">
          {tile_list_0}
      </div>

       <div className="row">
          {tile_list_1}
      </div>

       <div className="row">
          {tile_list_2}
      </div>

       <div className="row">
          {tile_list_3}
      </div>

     </div>
    );

  }
}

function SingleTile(params) {
  let tile = params.tile;
  if (tile.status == 0) {
    return (
      <div id="side-0" className="side col" onClick={ () => params.toggle(tile) }>      

      <div className="card-closed">
        <div className="container">
          <h2><b>?</b></h2>
        </div>
      </div> 

      </div>
    );
  }
     else {
    return (
      <div id="side-0" className="side col" onClick={ () => params.toggle(tile) }>      

      <div className="card-open">
        <div className="container">
          <h2><b>{tile.letter}</b></h2>
        </div>
      </div> 

      </div>
    );
  }
}



