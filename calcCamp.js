var calculator = new Object();
calculator.actionAdded = 0;
calculator.valueAdded = 0; 
calculator.myFloat = 0;
calculator.dot = 0;
calculator.values = [];
calculator.valuesTail = [];
calculator.val = "";
calculator.counter = 0;
calculator.resultSet = 0;
calculator.notNumber = 0;

function getSingleResult() {
  /*var filterFloat = function(value) {
      if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
        .test(value))
        return Number(value);
    return NaN;
  }*/  
  if (!calculator.valueAdded && !calculator.actionAdded){
    // nothing was entered to count
    calculator.values.push("0");
    return 0;
  }
  if (calculator.actionAdded > 0 ){// remove action wihout value
    calculator.values = calculator.values.slice(0,-1);
    calculator.actionAdded = 0;
  }
  var mathExpression = "";
  if(calculator.values.length){//no values in the chain
    mathExpression = calculator.values.join("");
  } else {
    mathExpression = "0";
  }
  if (mathExpression === "-") {
    mathExpression = "-0";
  };
  setFullScreenMessage(mathExpression);
  // float values stay with expected result
  var result = eval(mathExpression);
  if (calculator.myFloat > 0){
    result = result.toPrecision(12).replace(/0*$/,'');
  }
  return result;
}

function appendString(numb){
  if(calculator.val.length < 1 && numb === "0"){//if first pressed number is zero
    calculator.val = numb;
    return true;
  }
  if(calculator.val.length < 1 && numb === "0"){//if first pressed negative sign
    calculator.val = numb; 
    return false;
  }
  
  if (calculator.val.length < 1 && calculator.dot < 1 && numb != "-") {//if first number is not zero
    calculator.val = numb; 
  } else if(calculator.val.length < 1 && calculator.dot > 0){// if first number is dot
    calculator.val = "0" + numb;
  } else if(calculator.val === "-" && calculator.dot > 0){// if first number is - and second is dot
    calculator.val = "-0" + numb;
  } else {// any other number
    calculator.val += numb;
  }
  return true;
}
function addValue(numb) {

  calculator.valuesTail = [];
  if(calculator.actionAdded === 1){
    setScreenMessage("");
    calculator.actionAdded = 0;
  } else if (calculator.notNumber){
    clearSequence();
  }
  var numExtended = appendString(numb);

  if (numExtended){
    calculator.valueAdded ++;
    
    if(numb === "-"){// if - comes first
      setScreenMessage(calculator.val + "0");
      setFullScreenMessage(calculator.val + "0");
    }else{
      setScreenMessage(calculator.val);
    }
    

    if(numb != "0" && numb != "-" && calculator.valueAdded < 1 
      && calculator.values.length<1){
      setFullScreenMessage(calculator.val);
    } else if(numb != "0" && numb != "-" && calculator.valueAdded < 1){
      setFullScreenMessage(calculator.val, 1);
      calculator.actionAdded = 0;
    } else if(calculator.resultSet){
      var tempV = calculator.val;
      var tempD = calculator.dot;
      
      clearSequence();
      calculator.val = tempV;
      calculator.dot = tempD;

      setScreenMessage(tempV);
      setFullScreenMessage(tempV);
    } else {
      //all from values and from val even if it is partual
      var messageSequence = calculator.values.join("") + calculator.val;
      setFullScreenMessage(messageSequence);
    }
    calculator.valueAdded ++;
    fontUpdate(1);
    fontUpdate(2);
  }
}

function addAction(property){
  var result = "";
  calculator.resultSet = 0;

  if(calculator.dot > 0){//if dot is present without reason
    if(calculator.val.slice(-1) === "."){
      calculator.val = calculator.val.slice(0,-1);
    } 
    calculator.dot = 0;
    calculator.myFloat = 0;
  }  

  if (property === "="){
    if (calculator.val != "") {
      calculator.values.push(calculator.val);
      calculator.valuesTail = calculator.values.slice(-2);// saves last action
      calculator.val = "";
    } else if(calculator.valuesTail.length>1){
      // repeat last action
      calculator.values.push(calculator.valuesTail.join(""));
    }
    result = getSingleResult();
    if (!isFinite(result) || isNaN(result)){
      result="Not a number";
      calculator.notNumber = 1;
    }
    setScreenMessage(result);
    setFullScreenMessage(("=" + result), 1);
    calculator.resultSet = 1;
    
    // result was set, so we have new first value
    calculator.values = [];
    calculator.values.push(result);
    calculator.actionAdded = 0;
    calculator.valueAdded = 1;
  } else if(calculator.notNumber > 0){
    calculator.actionAdded = 1;
    calculator.valueAdded = 1;
    calculator.val = "";
  } else {
    calculator.valuesTail = [];//new chain,so new tail
    if(calculator.valueAdded > 0 && calculator.actionAdded < 1){
      // move number from container to storage
      calculator.values.push(calculator.val);
      calculator.val = "";
      calculator.actionAdded = 1;
      calculator.values.push(property);
      setFullScreenMessage(calculator.values.join(""));
    } else if (property === "-" && calculator.valueAdded === 0 && !calculator.values.length) {//first button is -
      addValue(property);
    } else if (calculator.valueAdded >= 0 && calculator.actionAdded > 0){
      calculator.values = calculator.values.slice(0, -1);
      calculator.values.push(property);
      setFullScreenMessage(calculator.values.join(""));
    }
  }
  fontUpdate(1);
  fontUpdate(2);
}

function trimSequence(btnTitle){
  if(calculator.val === ""){// remove action
    calculator.values = calculator.values.slice(0,-1);
    setFullScreenMessage(calculator.values.join(""));

    calculator.actionAdded = 0;
    calculator.valueAdded = 1;
    
    // action removed, value set, so next value is to restart
    //calculator.notNumber = 1;    
  } else if (calculator.val != ""){//remove number
    setScreenMessage("0");
    calculator.valueAdded = 0;
    calculator.val = "";
    calculator.actionAdded = 1;
  
    setFullScreenMessage(calculator.values.join(""));
    //setFullScreenMessage(getFullScreenMessage().slice(0,-1));
  } 
}
//////////////////////////////////////////////////////////////////
function clearSequence(btnTitle){
  if (calculator.values.length <= 1 || btnTitle != "DEL"){// only words
    document.getElementById("calcScreen").childNodes.forEach(function(element){
      if(element.innerHTML){
        element.innerHTML = 0;
      };
    });

    calculator.actionAdded = 0;
    calculator.valueAdded = 0;
    calculator.dot = 0;
    calculator.values = [];
    calculator.valuesTail = [];
    calculator.val = ""; 
    calculator.counter = 0;
    calculator.myFloat = 0;//flag for float
    calculator.notNumber = 0;
  } else {
    trimSequence(btnTitle);
  }
}
//dealing with special characters/entities
//also tracking "dot" click
function formatSpecialEntities(property){
  var result;
  switch (property.charCodeAt(0)){
    case 247:
      result = "/";
      break;
    case 215:
      result = "*";
      break;
    case 183:
      if (calculator.dot < 1) {
        result = ".";
      }
      calculator.dot += 1;
      calculator.myFloat = 1;
      break;
    default:
      result = property;
  }
  return result;
}
function fontUpdate(val){
  if(val === 1){
    var currA = document.getElementById("currentAction");
    var currAT = document.getElementById("currentActionTest");
  } else {

    var currA = document.getElementById("allActions");
    var currAT = document.getElementById("allActionsTest");
  }
  var myFontS = window.getComputedStyle(currA, null).getPropertyValue("font-size");
  var myContainerWidth = window.getComputedStyle(currA, null).getPropertyValue("width");
  var widthForChange = currAT.offsetWidth;

  if(myContainerWidth.slice(0, -2) < widthForChange - 5 ){
    var calcFont = Math.round(eval(myFontS.slice(0, -2)* myContainerWidth.slice(0, -2)/ widthForChange));

    //////console.log(window.getComputedStyle(currA, null).getPropertyValue("width"), " after");
    calculator.counter ++;
    if( widthForChange < 250 || calculator.counter >= 1) {
      if(calculator.counter >= 1){
        currAT.style.setProperty("font-size", calcFont + "px");
        currA.style.setProperty("font-size", calcFont + "px");
      } else {
        currA.style.setProperty("font-size", 1 + "em");
        currAT.style.setProperty("font-size", 1 + "em");
      }
    }
  }
  //////console.log(window.getComputedStyle(document.getElementById("currentAction"), null).getPropertyValue("font-size"));
}

// redirecting actions depending on the pressed button "number/action"
function pressButton(val){
  var buttonTitle = formatSpecialEntities(val.innerHTML);

  if (typeof(buttonTitle) != "undefined"){
    if (val.classList.contains("btn-numb")){// number pressed
      addValue(buttonTitle);

    } else if (val.classList.contains("btn-property")){// action pressed
      addAction(buttonTitle);
    
    } else if(val.classList.contains("btn-command")){ // clear commands
      clearSequence(buttonTitle);
    }
  }
}
function getScreenMessage(){
  return document.getElementById("currentAction").innerHTML;
}
function setScreenMessage(val){
  var screenMessage = document.getElementById("currentAction");
  var screenMessageTest = document.getElementById("currentActionTest");
  screenMessage.innerHTML = val;
  screenMessageTest.innerHTML = val;
}
function getFullScreenMessage(){
  return document.getElementById("allActions").innerHTML;
}
function setFullScreenMessage(val, add = 0){
  var fullScreenMessage = document.getElementById("allActions");
  var fullScreenMessageT = document.getElementById("allActionsTest");
  if(add === 0){
    fullScreenMessage.innerHTML = val;
    fullScreenMessageT.innerHTML = val;
  } else {
    fullScreenMessage.innerHTML += val;
    fullScreenMessageT.innerHTML += val;  
  }
}