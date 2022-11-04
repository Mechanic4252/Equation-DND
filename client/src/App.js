import "./App.css";
import { useState, useEffect, useRef } from "react";


function App() {
  //Required States for application
  const [tileName, setTileName] = useState([]);
  const [operatorType,setOperatorType] = useState(["+","-","*","/"]);
  const [equatorType,setEquatorType] = useState(['<','==','>']);
  const [dragging,setDragging] = useState(false);
  const [equation,setEquation] = useState([]);
  const [insertIdx,setInsertIdx] = useState(-1);
  const [equality,setEquality] = useState();
  const [rhs,setRhs] = useState();
  const dragItem = useRef();
  const dragNode = useRef();

  //Creates Dictionary of symbols and their associated valued fetched from server.
  var symbolTable = {};
  tileName.forEach((el)=>{
    symbolTable[el.symbol]=el.value;
  })

  //Logic for Drag and Drop
  //This function is triggered when dragging of element is started.
  //Then it stores information of draggind node i.e index of element in symbols
  const handleDragStart = (e,params)=>{
      dragItem.current=params;
      dragNode.current = e.target;
      dragNode.current.addEventListener('dragend',handleDragEnd);
      setDragging(true);
  }

  //This function removes information of dragging element after dragging is stopped
  const handleDragEnd = ()=>{    
      dragNode.current.removeEventListener('dragend',handleDragEnd);
      dragItem.current=null;
      dragNode.current = null;
      setDragging(false);
  }

  //This is fuction which handles drop event;
  //When this function is called it stores the symbol dragged into equation array
  const handleDrop=(e,params)=>{
    
    let sym="";
      if(dragItem.current.type===0){
        sym=tileName[dragItem.current.idx].symbol;
      }
      else{
        sym=operatorType[dragItem.current.idx];
      }
      if(insertIdx===-1){
      setEquation([...equation,sym]);
    }
    else{
      setEquation(oldArray=>{
        let newArr = structuredClone(oldArray);
        newArr.splice(insertIdx,0,sym);
        return newArr;
      })
    }     
    setInsertIdx(-1);
  }
  
  //This function is called when the component is dragged into dropping area
  //It stored the index of dragging element
  const handleTileHover=(e,params)=>{
    e.preventDefault(); 
    setInsertIdx(params.idx);       
  }
  const handleAreaHover=(e,params)=>{
    e.preventDefault();
  }

  //These functions are called when corresponding buttons are clicked 
  const setOperation = (e,params)=>{
    setEquality(equatorType[params.idx]);
  }
  const takeRhsInput = ()=>{
    const rhs = prompt("Enter Right Hand Side Value");
    setRhs(rhs);
  }
  const deleteRhs=()=>{
    setRhs("");
  }
  const deleteEquality=()=>{
    setEquality("");
  }
  //This function calculates the expression which is converted to string and solved using eval() function.
  const evaluate=()=>{
    if(equation.length===0){
      alert("please provide operants")
    }
    else if(!equality){
      alert("please provide euality sign");
    }
    else if(!rhs){
      alert("please provide right hand side value");
    }
    else{
      var equationstr="";
      equation.forEach((el)=>{
        if(symbolTable[el]){
          equationstr+=(symbolTable[el]+" ");
        }
        else{
          equationstr+=(el+" ");
        }
        
      })
      equationstr=equationstr+equality+" "+rhs;
      try{

        alert(eval(equationstr));
      }
      catch{
        alert("Not a valid Equation")
      }
    }
  }

  //This triggers an alert showing values of all symbols
  const showHints=()=>{
    let str="Values for symbol are - \r\n";
    for(const [key,value] of Object.entries(symbolTable)){
      str=str+`\r\n ${key} - ${value}`;
    }
    alert(str);
  }

  //This function is used to delete element from equation
  //It is triggered on onClick action on close button
  const deleteElement = (e,idx) =>{
    setEquation(oldArray=>{
        let newArr = structuredClone(oldArray);
        newArr.splice(idx,1);
        return newArr;
      })
  }

  //This function makes a delete request to backend to delete a symbol
  const removeTile = (e) => {
    e.preventDefault();
    let symbol = prompt("Enter Symbol only [A-Z]");
    let isPresent = false;
    let id = 0;
    tileName.forEach((el) => {
      if (el.symbol === symbol) {
        isPresent = true;
        id = el._id;
      }
    });
    if (!isPresent) alert("Provided symbol not present");
    else {
      fetch(`https://dnd-tiles-backend.herokuapp.com/${id}`, {
        method: "DELETE",
      });
    }
  };

  //This function performs a push request to backend and add a new symbol
  const addTile = (e) => {
    e.preventDefault();
    let symbol = prompt("Enter Symbol only [A-Z]");
    let value = prompt("Enter value for symbol");
    let isTaken = false;
    if(symbol==="" || value===""){
      alert("Please provide valid value or symbol");
      return;
    }
    tileName.forEach((el) => {
      if (el.symbol === symbol) {
        alert("Symbol already taken");
        isTaken = true;
      }
    });

    if (!isTaken && symbol!==null && value!==null) {
      fetch("https://dnd-tiles-backend.herokuapp.com/", {
        method: "POST",
        body: JSON.stringify({
          symbol: symbol,
          value: value * 1,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    }
  };

  //This use effect runc=s everytime when list of symbols is updated and first render of page
  useEffect(() => {
    fetch("https://dnd-tiles-backend.herokuapp.com/", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        setTileName(data);
      });
    });
  }, [tileName]);


  //This is the JSX code for site
  return (
    <div className="App">
      <div className="tiles-container">
        <h2>Symbols</h2>
        <div className="tiles-frame">
          {/* Fetch symbols and create tiles corresponding them */}
          {tileName.map((tile, idx) => (
            <div className="tile" draggable="true" onDragStart={(e)=>{handleDragStart(e,{type:0,idx})}} key={tile._id}>
              <p className="innerText">{tile.symbol}</p>
            </div>
          ))}
          {/*Add symbol and remove symbol button */}
          <button className="btn add" onClick={addTile}>
              Add Tile
          </button>
          <button className="btn remove" onClick={removeTile}>
              Remove Tile
          </button>
        </div>
      </div>
      <div>
        <div className="tiles-container">
          <h2>Operators</h2>
          <div className="tiles-frame">
            {/* Operators equators and RHS Input Button*/}
            {operatorType.map((op,idx)=>(
              <div className="tile operator" draggable="true" onDragStart={(e)=>{handleDragStart(e,{type:1,idx})}} key={op}>
                <p className="innerText">{op}</p>
                </div>
            ))}
            <div className="tile blank"></div>
            {equatorType.map((eq,idx)=>(
              <div>
                  <button className="btn operator" onClick={(e)=>{setOperation(e,{idx})}} key={eq}><p className="innerText">{eq}</p></button>
              </div>
              
            ))}
            <div className="tile blank"></div>
            <div className="solver" key="evaluate">
              <button className="btn operator" onClick={takeRhsInput}>
                <p className="innerText">RHS Integer</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <h2>Equation</h2>
      {/*Drop Area Dragged tiles will appear here*/}
      <div className="tiles-frame" id="dropLoc" onDrop={(e)=>{handleDrop(e)}} onDragOver={handleAreaHover} >
                {equation.map((op,idx)=>(
                  <div className="tile equation" onDragOver={(e)=>{handleTileHover(e,{idx})}}  key={idx}>
                    <button className="cancel" onClick={(el)=>{deleteElement(el,idx)}}>x</button>
                    <p className="innerText dark">{op}</p>
                    </div>
                ))}
                <div className="tile blank"></div>
                {
                  equality && <div className="tile equation">
                    <button className="cancel" onClick={deleteEquality}>x</button><p className="innerText dark">{equality}</p></div>
                } 
                <div className="tile blank"></div>
                {
                  rhs && <div className="tile equation">
                    <button className="cancel" onClick={deleteRhs}>x</button><p className="innerText dark">{rhs}</p>
                  </div>
                }            
      </div>
      {/* evaluate button and show hints button */}
      <div className="submitbtn">
        <button className="last-btn" type="submit" onClick={evaluate}>
          Evaluate
        </button>
        <button className="last-btn hint" onClick={showHints}>
          show hints
        </button>
      </div>
    </div>
  );
}

export default App;
