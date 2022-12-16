import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { context } from "./app";
import "./image.css";

export function Image() {
  let [images, setImage] = useState({
    images: [],
    state: false,
  });

  let imgUpdate = useContext(context)[21];
  let setRoute = useContext(context)[20];
  const [menuI, setI] = useState(false);

  useEffect(() => {
    const getImages = async () => {
      const result = await axios.get("/api/get");
      setImage({ images: result.data });
      console.log(result.data);
    };
    getImages();
  }, [imgUpdate]);

  let image = images.images.map((ima) => {
    console.log(ima);
    return (
      <div className="ficha">
        <li className="li" key={ima.id}>
          <Link to={"/" + ima.id}>
            <img
              className="imageCanvas"
              src={ima.route}
              key={ima.id}
              onClick={() => {
                setRoute(ima.route);
              }}
            />
            <h2>{ima.id}</h2>
          </Link>
        </li>
      </div>
    );
  });

  return (
    <>
      <button
        className="button-up"
        onClick={() => {
          setI(!menuI);
        }}
      >
        {" "}
        <FontAwesomeIcon icon="chevron-up" />
      </button>
      {menuI ? <div className="container2">
        <button className="button-arrow">
          <FontAwesomeIcon icon="chevron-left" />
        </button>
        <div className="middle">
        <ul>
          {image}
        </ul>
        </div>
        <button className="button-arrow">
          <FontAwesomeIcon icon="chevron-right" />
        </button>
        <button className="button-down" onClick={()=>{
          setI(!menuI);
        }}>
          <FontAwesomeIcon icon="chevron-down" />
        </button>
        <Outlet />
      </div>:<></>}
    </>
  ); 
      
}
