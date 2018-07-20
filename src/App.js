import React, { Component } from "react";
import "./App.css";
import axios from 'axios';


//const DEFAULT_QUERY = 'github';
const DEFAULT_HPP = '100';


const PATH_BASE ='https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARM_SEARCH = 'query=';
const PARM_PAGE = 'page=';
const PARM_HPP = 'hitsPerPage=';

class App extends Component {

  _isMounted = false;

constructor(props){
  super(props);

  this.state = {
    results: null,
    searchKey: '',
    searchTerm: '',
    error: null,
  };

  this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  this.setSearchTopStories = this.setSearchTopStories.bind(this);
  this.onSearchChange = this.onSearchChange.bind(this);
  this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  this.onSearchSubmit = this.onSearchSubmit.bind(this);
  this.onDismiss = this.onDismiss.bind(this);
}


needsToSearchTopStories(searchTerm){
  return !this.state.results[searchTerm];
}


setSearchTopStories(result){
  const {hits, page} = result;
  const {searchKey, results} =this.state;

  const oldHits =results && results[searchKey]
    ? results[searchKey].hits
    : [];

  const updatedhits = [
    ...oldHits,
    ...hits
  ];

  this.setState({
    results: {
      ...results,
      [searchKey]:{hits: updatedhits, page}
    }
  });
}

fetchSearchTopStories(searchTerm, page = 0){
  axios(`${PATH_BASE}${PATH_SEARCH}?${PARM_SEARCH}${searchTerm}&${PARM_PAGE}${page}&${PARM_HPP}${DEFAULT_HPP}`)
   .then(result => this._isMounted && this.setSearchTopStories(result.data))
   .catch(error => this._isMounted && this.setState({ error }));
}


componentDidMount(){
  this._isMounted = true;

  const { searchTerm} = this.state;
  this.setState({searchKey:searchTerm});
  this.fetchSearchTopStories(searchTerm);
   
}

componentWillUnmount(){
  this._isMounted = false;
}

onSearchSubmit(event){
  const {searchTerm} = this.state;
  this.setState({searchKey:searchTerm})
  
  if(this.needsToSearchTopStories(searchTerm)){
    this.fetchSearchTopStories(searchTerm);
  }
  event.preventDefault();

}

onSearchChange(event){
  this.setState({searchTerm: event.target.value});
}



onDismiss(id){

  const {searchKey, results} = this.state;
  const {hits, page} = results[searchKey];

  const isNotId = item => item.objectID !== id;
  const updatedhits = hits.filter(isNotId);
  this.setState({
    result: { ...results, [searchKey]: {hits:updatedhits, page}}
  });

}

  render() {

    const {
      searchTerm,
       results,
       searchKey,
       error
      } = this.state;

    const page = (
      results && 
      results[searchKey] &&
      results[searchKey].page
    ) || 0;
   

    const list = (
      results && 
      results[searchKey] &&
      results[searchKey].hits
    ) || [];




    console.log(this.state);
    //if(!results){return null;}

    if(error){
      return <p>Something Went Wrong</p>;
    }

    return (
      <div className="page">
     <div className="interactions">
      
        <Search 
        value={searchTerm}
        onChange={this.onSearchChange}
        onSubmit={this.onSearchSubmit}
        >
         Search
         </Search>
         </div>
          
            <Table
            list={list}
            onDismiss={this.onDismiss} 
            />
            
          

        <div className="interactions">
        <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
          More
          </Button>
    
        </div>
        
    
      </div>
    );
  }
}

const Search =({value, onChange,onSubmit,children}) =>
<form>
    {children} <input 
    type="text" 
     onChange={onChange}
    value={value}
        />
        <button type="submit">
        {children}
        </button>
      </form>

const Table = ({list, onDismiss}) =>
<div className="table">


 {list.map(item => 
          <div key={item.objectID} className="table-row">
            <span style={{width: '40%'}}>
              <a href="{item.url}">{item.title}</a>
            </span>
            <span style={{width: '30%'}}>{item.author}</span>
            <span style={{width: '10%'}}>{item.num_comments}</span>
            <span style={{width: '10%'}}>{item.points}</span>
            <span style={{width: '10%'}}>
              <Button
              onClick={() => onDismiss(item.objectID)}
              
              className="button-inline"
              >
              Dismiss
              </Button>

              
            </span>
          </div>
        )
        
        }

        
        
</div>


  class Button extends Component{
    render(){
      const {
        onClick,
        className='',
        children,
      } = this.props;

      return(
        <button 
        onClick={onClick}
        className={className}
        type="button">
        {children}
        </button>
      );
    }
  }

export default App;

export {
  Button,
  Search,
  Table
};