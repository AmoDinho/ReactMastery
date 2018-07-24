import React, { Component } from "react";
import "./App.css";
import axios from 'axios';
import PropTypes from 'prop-types';
import {sortBy} from 'lodash';
import className from 'classnames'




const DEFAULT_QUERY = 'github';
const DEFAULT_HPP = '100';


const PATH_BASE ='https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARM_SEARCH = 'query=';
const PARM_PAGE = 'page=';
const PARM_HPP = 'hitsPerPage=';


const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

class App extends Component {

  _isMounted = false;

constructor(props){
  super(props);

  this.state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false,
    sortKey: 'NONE',
    isSortReverse: false,
  };

  this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  this.setSearchTopStories = this.setSearchTopStories.bind(this);
  this.onSearchChange = this.onSearchChange.bind(this);
  this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  this.onSearchSubmit = this.onSearchSubmit.bind(this);
  this.onDismiss = this.onDismiss.bind(this);
  this.onSort = this.onSort.bind(this);
}


onSort(sortKey){
  const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
  this.setState({sortKey, isSortReverse});
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
    },
    isLoading: false
  });
}

fetchSearchTopStories(searchTerm, page = 0){
  this.setState({isLoading: true});
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
       error,
       isLoading,
       sortKey,
       isSortReverse
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
            sortKey={sortKey}
            onSort={this.onSort}
            isSortReverse={isSortReverse}
            />
            
          

        <div className="interactions">
        <ButtonWithLoading
        isLoading={isLoading}
        onClick={() => this.fetchSearchTopStories(searchKey, page +1)}>
                More
           </ButtonWithLoading>
      
        </div>
        
    
      </div>
    );
  }
} 

class Search extends Component{

  componentDidMount(){
    if(this.input){
      this.input.focus();
    }
  }

  render(){
    const{
      value,
      onChange,
      onSubmit,
      children
    } = this.props;

    return(
      
<form onSubmit={onSubmit}>
   <input 
    type="text" 
     onChange={onChange}
    value={value}
    ref={(node) => {this.input = node;}}
        />
        <button type="submit">
        {children}
        </button>
      </form>
    );
  }
}


const Table = ({
list, 
onDismiss,
isSortReverse,
onSort,
sortKey
}) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse
  ? sortedList.reverse()
  : sortedList;

return (
<div className="table">
<div className="table-header">
  <span style={{width: '40%'}}>
  <Sort 
    sortKey={'TITLE'}
    onSort={onSort}
    activeSortKey={sortKey}
    >
    Title
    </Sort>
  </span>
  <span style={{width: '30%'}}>
  <Sort 
    sortKey={'AUTHOR'}
    onSort={onSort}
    activeSortKey={sortKey}
    >
    Author
    </Sort>
  </span>
  <span style={{width: '10%'}}>
  <Sort 
    sortKey={'Comments'}
    onSort={onSort}
    activeSortKey={sortKey}
    >
    Comments
    </Sort>
  </span>
  <span style={{width: '10%'}}>
  <Sort 
    sortKey={'POINTS'}
    onSort={onSort}
    activeSortKey={sortKey}
    >
    Points
    </Sort>
  </span>
  <span style={{width: '10%'}}>
    Archive
  </span>
</div>

 {reverseSortedList.map(item => 
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
);
      }


Table.PropTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

  const Button = ({
      
        onClick,
        className='',
        children,
      }) =>

      
        <button 
        onClick={onClick}
        className={className}
        type="button">
        {children}
        </button>

        Button.PropTypes = {
         onClick: PropTypes.func.isRequired,
         className: PropTypes.string,
         children: PropTypes.node.isRequired,
        };

        Button.defaultProps = {
          className: '',
        };


const Loading = () =>
<div>Loading...</div>

const withLoading = (Component) => ({isLoading, ...rest}) =>
isLoading
? <Loading />
: <Component {...rest} />

const ButtonWithLoading = withLoading(Button);


const Sort = ({
  sortKey, 
  onSort, 
  children,
  activeSortKey
  }) => 

  {
    const sortClass = className(
      'button-iline',
      {'button-active':sortKey === activeSortKey}
    );

   
    return(
      <Button 
      onClick={() => onSort(sortKey)}
      className={sortClass}
      >
      {children}
      </Button>
    );
  }

  
export default App;

export {
  Button,
  Search,
  Table
};