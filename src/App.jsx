import { useState, useEffect, useRef } from 'react'
import logo from './logo.svg'
import './App.css'

function App(){
  return  ( 
  <div className="App">
  <header className="App-header">
  <p>Hello Vite + React!</p>
   
  </header>
</div>)
}

const Canvas = props => {

  const canvasRef = useRef(null);

  const truncatedCone = (ctx, topDiam,bottomDiam,height,roofPitch) =>{
    //returns Path object
    //used formula at http://mathcentral.uregina.ca/qq/database/qq.09.13/h/josh1.html
  //get the height of the cone Untruncated
  const bottomRadius = bottomDiam/2;
  const topRadius = topDiam/2;
  const untruncatedHeight = (height*bottomRadius/(bottomRadius-topRadius));
  //get slant height for untruncated which is radius of the bottom of the cones arc
  const untruncSlant = Math.sqrt(Math.pow(untruncatedHeight,2) + Math.pow(bottomRadius,2));
  const truncatedSlant = Math.sqrt((Math.pow(bottomRadius-topRadius,2)+ Math.pow(height,2)));
  //get the height for the line above truncation which is the radius of the top of the cones arc
  const aboveTruncationSlant = (untruncSlant - truncatedSlant);
  
  //get circumference of two radii above
  const circUTSLANT = untruncSlant*2*Math.PI;
  const circABOVETSLANT = aboveTruncationSlant*2*Math.PI;
  
  //get circumference of top and bottom of cone
  const circTopCone = (topRadius*2*Math.PI);
  const circBottomCone = bottomRadius*2*Math.PI;
  
  //get degrees of top and bottom arcs
  const degreesBottom = (circBottomCone/circUTSLANT)*360;
  const degreesTop = (circTopCone/circABOVETSLANT)*360;

  const degreesOfCircle = (bottomRadius/ untruncSlant) *360;
  const radiansOfCircle = degreesOfCircle/57.2958;
  
  //convert degrees to radians
  const radiansBottom = degreesBottom/57.2958;
  const radiansTop = degreesTop/57.2958;
  
 //find middle of the canvas
  ctx.canvas.width  = window.innerWidth/2;
  ctx.canvas.height = window.innerHeight/2;
  const middleX = ctx.canvas.width/2;
  const middleY = ctx.canvas.height/2;

  const XcoordEndTop = middleX + (aboveTruncationSlant*(Math.cos(radiansTop)));
  const YcoordEndTop = middleY + (aboveTruncationSlant*(Math.sin(radiansTop)));

  const XcoordEndBottom = middleX + (untruncSlant*(Math.cos(radiansTop)));
  const YcoordEndBottom = middleY + (untruncSlant*(Math.sin(radiansTop)));

  //offsets to recenter the image
  const xOffset = XcoordEndTop-middleX;
  const yOffset = YcoordEndTop-middleY;

  ctx.fillStyle = "white";
ctx.fillRect(0, 0, ctx.canvas.width,ctx.canvas.height);

  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(middleX-xOffset,middleY-yOffset,untruncSlant,0,radiansOfCircle);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(XcoordEndBottom-xOffset,YcoordEndBottom-yOffset);
  ctx.lineTo(XcoordEndTop-xOffset,YcoordEndTop-yOffset);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(middleX-xOffset,middleY-yOffset,aboveTruncationSlant,0,radiansOfCircle);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo((middleX + aboveTruncationSlant)-xOffset,middleY-yOffset);
  ctx.lineTo((middleX+untruncSlant)-xOffset,middleY-yOffset);
  ctx.stroke();
  //bottom of cone arc
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    truncatedCone(context,30,40,80,0);
  }, [truncatedCone]);


  return <canvas ref={canvasRef} {...props}/>
}

export default App()
