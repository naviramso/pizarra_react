import { text } from "@fortawesome/fontawesome-svg-core";
import zIndex from "@mui/material/styles/zIndex";
import { borderRadius } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { context } from "./app";
import "./whiteboard.css";
import {dataURItoBlob} from "./API/api"

import io from "socket.io-client";
import { useParams } from "react-router-dom";

export const socket = io("http://localhost:3001");

let canvasize;
let canvasCtx;

export function Whiteboard() {
  const [
    pencil,
    setPencil,
    color,
    setColor,
    thicknessValue,
    ,
    figuras,
    setfiguras,
    cuadrado,
    setCuadrado,
    textValue,
    setTextValue,
    triangulo,
    setTriangulo,
    circulo,
    setCirculo,
    setAdmin,
    ,
    setUsuarios,
    imageRoute,
    ,,,
    admin
  ] = useContext(context);
  const [bandera, setbandera] = useState(false);
  const [dibujarcuadrado, setDibujarCuadrado] = useState(false);
  const [escribir, setEscribir] = useState(false);
  const [dibujarCirculo, setDibujarCirculo] = useState(false);
  const [dibujarTriangulo, setDibujarTriangulo] = useState(false);
  const [puntosCuad, setPuntosCuad] = useState([0, 0, 0, 0]);
  const [puntosCir, setPuntosCir] = useState([0, 0]);
  const [valueScroll, setValueScroll] = useState(0);
  const [urlId, setUrlID] = useState(useParams());

  const [message, setMessage] = useState({
    color: color,
    beginLine: false,
    line: false,
    linePunto: [0, 0],
    cuadrado: false,
    puntosCuadrado: [0, 0, 0, 0],
    circulo: false,
    radio: 0,
    triangulo: false,
    text: "",
    grosor: thicknessValue,
    id: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const canvas = document.getElementById("micanvas");
    canvasCtx = canvas.getContext("2d");
    canvasCtx.fillStyle = "white";
    canvasCtx.fillRect(0, 0, 1800, 1920);
    socket.emit("id", "" + id);
    socket.on("message", (message) => {
      //console.log(message);
      setMessage(message);
    });
    socket.on("usuarios", (usuarios) => {
      console.log(usuarios);
      if (usuarios.length == 1) {
        setAdmin(true);
      }
      setUsuarios(usuarios);
    });
    socket.on("admin",(adm)=>{
      console.log("este es admin"+adm)
      setAdmin(adm);
      
    })
   /* socket.on("canvas",(idUsu)=>{
      console.log("este wye te pide imagen"+idUsu)
      const canvas = getCanvas();
    let image = dataURItoBlob(canvas.toDataURL());
      //const imagen="";
      socket.emit("imagen",image,idUsu)
    })
   /* socket.on("guardarImagen",(imagen)=>{
        const canvas = document.getElementById("micanvas");
        canvasCtx = canvas.getContext("2d");
        canvasCtx.fillStyle = "white";

        canvasCtx.drawImage(imagen, 0, 0);
    })*/
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("micanvas");
    canvasCtx = canvas.getContext("2d");
    canvasCtx.fillStyle = "white";
    let img = new Image();
    img.src = imageRoute;
    console.log(imageRoute);
    canvasCtx.drawImage(img, 0, 0);
  }, [urlId]);

  useEffect(() => {
    if (urlId != id) {
      setUrlID(id);
    }
    if (!figuras) {
      const canvas = document.getElementById("micanvas");
      canvasCtx = canvas.getContext("2d");
      canvasize = canvas.getBoundingClientRect();
    } else {
      const canvas = document.getElementById("figuras");
      canvasCtx = canvas.getContext("2d");
      canvasize = canvas.getBoundingClientRect();
    }

    if (message.beginLine) {
      setColor(message.color);
      canvasCtx.beginPath();
      canvasCtx.strokeStyle = message.color;
      canvasCtx.lineWidth = message.grosor;
      canvasCtx.moveTo(message.linePunto[0], message.linePunto[1]);
    } else {
      if (message.line) {
        canvasCtx.lineTo(message.linePunto[0], message.linePunto[1]);

        canvasCtx.stroke();
      }

      if (message.cuadrado) {
        canvasCtx.strokeStyle = message.color;
        canvasCtx.lineWidth = message.grosor;
        canvasCtx.strokeRect(
          message.puntosCuadrado[0],
          message.puntosCuadrado[1],
          message.puntosCuadrado[2],
          message.puntosCuadrado[3]
        );
      }
      if (message.circulo) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = message.color;
        canvasCtx.lineWidth = message.grosor;

        canvasCtx.arc(
          message.puntosCuadrado[0],
          message.puntosCuadrado[1],
          message.radio,
          0,
          Math.PI * 2
        );
        canvasCtx.stroke();
      }
      if (message.triangulo) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = message.color;
        canvasCtx.lineWidth = message.grosor;
        canvasCtx.moveTo(message.linePunto[0], message.linePunto[1]);
        canvasCtx.lineTo(message.puntosCuadrado[0], message.puntosCuadrado[1]);
        canvasCtx.lineTo(message.puntosCuadrado[2], message.puntosCuadrado[3]);
        canvasCtx.closePath();
        canvasCtx.stroke();
      }
      if (message.text != "") {
        canvasCtx.fillStyle = message.color;
        canvasCtx.font = message.grosor * 3 + 10 + "px Comic Sans MS";
        canvasCtx.textAlign = "center";
        canvasCtx.fillText(
          message.text,
          message.linePunto[0],
          message.linePunto[1]
        );

      }
      //console.log(admin);
    }
  });
  /*const scroll = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > valueScroll) {
      console.log("a");
      setValueScroll(scrolled);
    } else if (scrolled < valueScroll) {
      console.log("b");
      setValueScroll(scrolled);
    }
  };
  window.addEventListener("scroll", scroll);
  window.scroll({
    top: 100,
    left: 100,
    behavior: "smooth",
  });*/

  useEffect(() => {
    var fig = document.getElementById("figuras");
    if (figuras) {
      fig.style.zIndex = 2;
    } else {
      fig.style.zIndex = -1;
    }
  }, [figuras]);

  return (
    <div className="canvas">
      <canvas
        id="micanvas"
        width={1000}
        height={600}
        onMouseDown={(event) => {
          if (pencil) {
            setbandera(true);
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = color;
            canvasCtx.lineWidth = thicknessValue;
            const x = event.clientX - canvasize.left;
            const y = event.clientY - canvasize.top;
            canvasCtx.moveTo(x, y);

            socket.emit("message", {
              color: color,
              beginLine: true,
              line: false,
              linePunto: [x, y],
              cuadrado: false,
              puntosCuadrado: [0, 0, 0],
              circulo: false,
              radio: 0,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
          }
        }}
        onMouseMove={(e) => {
          if (bandera) {
            const x = e.clientX - canvasize.left;
            const y = e.clientY - canvasize.top;
            canvasCtx.lineTo(x, y);
            canvasCtx.stroke();

            socket.emit("message", {
              color: message.color,
              beginLine: false,
              line: true,
              linePunto: [x, y],
              cuadrado: false,
              puntosCuadrado: [0, 0, 0],
              circulo: false,
              radio: 0,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
          }
        }}
        onMouseUp={() => {
          if (bandera) {
            setbandera(false);
            socket.emit("message", {
              color: message.color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: false,
              puntosCuadrado: [0, 0, 0],
              circulo: false,
              radio: 0,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
          }
        }}
      ></canvas>
      <canvas
        id="figuras"
        width={1000}
        height={600}
        onMouseDown={(event) => {
          if (cuadrado) {
            setDibujarCuadrado(true);
            canvasCtx.strokeStyle = color;
            canvasCtx.lineWidth = thicknessValue;
            setPuntosCuad([
              event.clientX - canvasize.left,
              event.clientY - canvasize.top,
              event.clientX - canvasize.left,
              event.clientY - canvasize.top,
            ]);
          }

          if (textValue != "") {
            setEscribir(true);
            canvasCtx.font = thicknessValue * 3 + 10 + "px Comic Sans MS";
            console.log(textValue);
            canvasCtx.fillStyle = color;
            canvasCtx.textAlign = "center";
            canvasCtx.fillText(
              textValue,
              event.clientX - canvasize.left,
              event.clientY - canvasize.top
            );
            //setTextPosition([event.clientX -canvasize.left,event.clientY - canvasize.to ])
          }
          if (circulo) {
            canvasCtx.strokeStyle = color;
            canvasCtx.lineWidth = thicknessValue;
            setPuntosCir([
              event.clientX - canvasize.left,
              event.clientY - canvasize.top,
            ]);
            setDibujarCirculo(true);
          }
          if (triangulo) {
            canvasCtx.strokeStyle = color;
            canvasCtx.lineWidth = thicknessValue;
            setPuntosCir([
              event.clientX - canvasize.left,
              event.clientY - canvasize.top,
            ]);
            setDibujarTriangulo(true);
          }
        }}
        onMouseMove={(event) => {
          if (dibujarcuadrado) {
            canvasCtx.clearRect(0, 0, 1800, 1920);
            setPuntosCuad([
              puntosCuad[0],
              puntosCuad[1],
              event.clientX - canvasize.left,
              event.clientY - canvasize.top,
            ]);
            canvasCtx.strokeRect(
              puntosCuad[0],
              puntosCuad[1],
              puntosCuad[2] - puntosCuad[0],
              puntosCuad[3] - puntosCuad[1]
            );
          }
          if (escribir) {
            canvasCtx.clearRect(0, 0, 1800, 1920);
            canvasCtx.fillText(
              textValue,
              event.clientX - canvasize.left,
              event.clientY - canvasize.top
            );
          }
          if (dibujarCirculo) {
            canvasCtx.beginPath();
            canvasCtx.clearRect(0, 0, 1800, 1920);
            const x = Math.abs(event.clientX - canvasize.left - puntosCir[0]);
            canvasCtx.arc(puntosCir[0], puntosCir[1], x, 0, Math.PI * 2);
            canvasCtx.stroke();
          }
          if (dibujarTriangulo) {
            canvasCtx.clearRect(0, 0, 1800, 1920);
            canvasCtx.beginPath();
            canvasCtx.moveTo(puntosCir[0], puntosCir[1]);
            canvasCtx.lineTo(
              event.clientX - canvasize.left,
              event.clientY - canvasize.top
            );
            const x = event.clientX - canvasize.left - puntosCir[0];
            canvasCtx.lineTo(puntosCir[0] - x, event.clientY - canvasize.top);
            canvasCtx.closePath();
            canvasCtx.stroke();
          }
        }}
        onMouseUp={(event) => {
          canvasCtx.clearRect(0, 0, 1800, 1920);
          const canvas = document.getElementById("micanvas");
          canvasCtx = canvas.getContext("2d");

          if (cuadrado) {
            canvasCtx.strokeStyle = color;
            canvasCtx.lineWidth = thicknessValue;
            puntosCuad[2] = puntosCuad[2] - puntosCuad[0];
            puntosCuad[3] = puntosCuad[3] - puntosCuad[1];
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: true,
              puntosCuadrado: puntosCuad,
              circulo: false,
              radio: 0,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: true,
              puntosCuadrado: puntosCuad,
              circulo: false,
              radio: 0,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: true,
              puntosCuadrado: puntosCuad,
              circulo: false,
              radio: 0,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
            canvasCtx.strokeRect(
              puntosCuad[0],
              puntosCuad[1],
              puntosCuad[2],
              puntosCuad[3]
            );
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: false,
              puntosCuadrado: puntosCuad,
              circulo: false,
              radio: 0,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
            setPuntosCuad([0, 0, 0, 0]);
            setDibujarCuadrado(false);
            setfiguras(false);
            setCuadrado(false);
          }

          if (escribir) {
            canvasCtx.fillStyle = color;
            canvasCtx.font = thicknessValue * 3 + 10 + "px Comic Sans MS";
            canvasCtx.textAlign = "center";
            canvasCtx.fillText(
              textValue,
              event.clientX - canvasize.left,
              event.clientY - canvasize.top
            );
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [
                event.clientX - canvasize.left,
                event.clientY - canvasize.top,
              ],
              cuadrado: false,
              puntosCuadrado: puntosCuad,
              circulo: false,
              radio: 0,
              triangulo: false,
              text: textValue,
              grosor: thicknessValue,
              id: "" + id,
            });
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [
                event.clientX - canvasize.left,
                event.clientY - canvasize.top,
              ],
              cuadrado: false,
              puntosCuadrado: puntosCuad,
              circulo: false,
              radio: 0,
              triangulo: false,
              text: textValue,
              grosor: thicknessValue,
              id: "" + id,
            });
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [
                event.clientX - canvasize.left,
                event.clientY - canvasize.top,
              ],
              cuadrado: false,
              puntosCuadrado: puntosCuad,
              circulo: false,
              radio: 0,
              triangulo: false,
              text: textValue,
              grosor: thicknessValue,
              id: "" + id,
            });
            setEscribir(false);
            setfiguras(false);
            setTextValue("");
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: false,
              puntosCuadrado: puntosCuad,
              circulo: false,
              radio: 0,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
          }
          if (circulo) {
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = color;
            canvasCtx.lineWidth = thicknessValue;
            const x = Math.abs(event.clientX - canvasize.left - puntosCir[0]);
            canvasCtx.arc(puntosCir[0], puntosCir[1], x, 0, Math.PI * 2);
            canvasCtx.stroke();
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: false,
              puntosCuadrado: [puntosCir[0], puntosCir[1], 0, 0],
              circulo: true,
              radio: x,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: false,
              puntosCuadrado: [puntosCir[0], puntosCir[1], 0, 0],
              circulo: true,
              radio: x,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: false,
              puntosCuadrado: [puntosCir[0], puntosCir[1], 0, 0],
              circulo: true,
              radio: x,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
            setPuntosCir([0, 0]);
            setDibujarCirculo(false);
            setfiguras(false);
            setCirculo(false);
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: false,
              puntosCuadrado: puntosCuad,
              circulo: false,
              radio: 0,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
          }
          if (triangulo) {
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = color;
            canvasCtx.lineWidth = thicknessValue;
            canvasCtx.moveTo(puntosCir[0], puntosCir[1]);
            canvasCtx.lineTo(
              event.clientX - canvasize.left,
              event.clientY - canvasize.top
            );
            const x = event.clientX - canvasize.left - puntosCir[0];
            canvasCtx.lineTo(puntosCir[0] - x, event.clientY - canvasize.top);
            canvasCtx.closePath();
            canvasCtx.stroke();
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [puntosCir[0], puntosCir[1]],
              cuadrado: false,
              puntosCuadrado: [
                event.clientX - canvasize.left,
                event.clientY - canvasize.top,
                puntosCir[0] - x,
                event.clientY - canvasize.top,
              ],
              circulo: false,
              radio: 0,
              triangulo: true,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [puntosCir[0], puntosCir[1]],
              cuadrado: false,
              puntosCuadrado: [
                event.clientX - canvasize.left,
                event.clientY - canvasize.top,
                puntosCir[0] - x,
                event.clientY - canvasize.top,
              ],
              circulo: false,
              radio: 0,
              triangulo: true,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [puntosCir[0], puntosCir[1]],
              cuadrado: false,
              puntosCuadrado: [
                event.clientX - canvasize.left,
                event.clientY - canvasize.top,
                puntosCir[0] - x,
                event.clientY - canvasize.top,
              ],
              circulo: false,
              radio: 0,
              triangulo: true,
              text: "",
              grosor: thicknessValue,
              id: "" + id,
            });
            setPuntosCir([0, 0]);
            setTriangulo(false);
            setfiguras(false);
            setDibujarTriangulo(false);
            socket.emit("message", {
              color: color,
              beginLine: false,
              line: false,
              linePunto: [0, 0],
              cuadrado: false,
              puntosCuadrado: [0, 0, 0, 0],
              circulo: false,
              radio: 0,
              triangulo: false,
              text: "",
              grosor: thicknessValue,
              id: "" + { id },
            });
          }
        }}
      ></canvas>
      <h1>{id}</h1>
    </div>
  );
}

export function borrar() {
  canvasCtx.fillStyle = "white";
  canvasCtx.fillRect(0, 0, 1800, 1920);
}

export const getCanvas = () => {
  let canvas = document.getElementById("micanvas");
  canvas.name = "image";
  return canvas;
};
