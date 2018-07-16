import React, { Component } from "react";
import "./styles.css";




const list = [
  {
    title: "React",
    url: "https://facebook.github.io/react/",
    author: "Adolf Van Coller",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://github.com/reactjs/redux",
    author: "Dan Abramov",
    num_comments: 4,
    points: 7,
    objectID: 1
  }
];

class App extends Component {
constructor(props){
  super(props);

  this.state = {
    list,
  };

  this.onDismiss = this.onDismiss.bind(this);
}

onDismiss(id){

  const isNotId = item => item.objectID !== id;
  const updatedList = this.state.list.filter(isNotId);
  this.setState({list: updatedList});

  //ES6 on ROIDS!
  //Or: const updatedList = this.state.list.filter(item => item.objectID !== id);
       
  /*

  ES5 Computed: 

  function isNotId(item){
    return item.objectID !== id;
  }

  const updatedList =this.state.list.filter(isNotId);
*/
}

  render() {
    return (
      <div className="App">
        {this.state.list.map(item => (
          <div key={item.objectID}>
            <span>
              <a href="{item.url}">{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <button
              onClick={() => this.onDismiss(item.objectID)}
              type="button"
              >
              Dismiss
              </button>
            </span>
          </div>
        ))}
        <div> </div>
      </div>
    );
  }
}

export default App;
