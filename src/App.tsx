import React, { useState, useEffect } from "react";
import "./App.css";

type Event = {
  x: number;
  y: number;
  z: number;
  timestamp: number;
};

function App() {
  const [eventLog, updateEvents] = useState<Event[]>([]);
  //@ts-ignore
  useEffect(() => {
    async function initPlot() {
        //@ts-ignore
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

    initPlot();

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
        //@ts-ignore
        if(Plotly){
          //@ts-ignore
          Plotly.extendTraces('plot',{x:[[x]],y:[[y]],z:[[z]]},[0]);
        }
        
      }
    });
  });
  return <div id="plot"></div>;
}

export default App;
