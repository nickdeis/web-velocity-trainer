import React, { useState, useEffect} from "react";
import "./App.css";
import {debounce} from 'lodash';


declare const Plotly:any;


function rand(){
  return Math.random() * 10;
}

function wait(t:number){
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(true);
    },t)
  })  
}

function testEvent(){
  const x = rand();
  const y = rand();
  const z = rand();
  const event = new DeviceMotionEvent('devicemotion',{acceleration:{x,y,z},interval:16})
  window.dispatchEvent(event);
}

async function test(){
  let idx:any;
  let cnt = 0;
  idx = setInterval(() => {
    testEvent();
    cnt++
    if(cnt > 100){
      clearInterval(idx);
    }
  },16)
}
//@ts-ignore
window.test = test;

type Event = {
  x: number;
  y: number;
  z: number;
  timestamp: number;
};

function updatePlot(x:number,y:number,z:number){
  if(Plotly){
    requestAnimationFrame(() => {
      Plotly.extendTraces('plot',{x:[[x]],y:[[y]],z:[[z]]},[0]);
    });
    
  }
}

async function initPlot() {
  Plotly.newPlot(
    "plot",
    [
      {
        type: "scatter3d",
        mode: "lines",
        x: [0],
        y: [0],
        z: [0],
        opacity: 1,
        line: {
          width: 6,
        }
      }
    ],
    {
      height: 640
    }
  );
}

function App() {
  const [eventLog, updateEvents] = useState<Event[]>([]);
  useEffect(() => {
    initPlot()
    window.addEventListener('devicemotion', ({acceleration,interval}) => {
      if(acceleration){
        const timestamp =  Date.now();
        const x = acceleration?.x || 0;
        const y = acceleration?.y || 0;
        const z = acceleration?.z || 0;
        if(!x && !y && !z){
          return;
        }
        const newEventLog = eventLog.concat([{x,y,z,timestamp}])
        updateEvents(newEventLog);
        updatePlot(x,y,z);
      }
    });
  },[]);
  return <div><div id="plot"></div></div>;
}

export default App;
