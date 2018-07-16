import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
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

  return (
    <div className="App">
      {list.map(item => (
        <div key={item.objectID}>
          <span>
            <a href="{item.url}">{item.title}</a>
          </span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span>
        </div>
      ))};
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

//Enabling Hot module replacement [HMR]
if (module.hot) {
  module.hot.accept();
}
