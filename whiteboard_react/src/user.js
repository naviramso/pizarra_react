import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { context } from "./app";
import "./user.css";
import {socket} from "./whiteboard"

export function User() {
  let setAdmin=useContext(context)[16]
  let admin=useContext(context)[23]
  let users = useContext(context)[17];
  const [menuUsers, setUsers] = useState(false);
  const [usu, setUsu] = useState();
  
  console.log(socket.id);
  useEffect(() => {
    if (users !== undefined) {
      console.log(users);
      setUsu( users.map((res) => {
        console.log(res.usuario);
        return (
          <div className="ficha" key={1}>
            <span>
              <FontAwesomeIcon icon="user" />
            </span>
            <span className="span">{res.usuario}</span>
            {admin&&(socket.id!=res.usuario) ?(<div> <button class="admin" onClick={()=>{
              socket.emit("newAdmin",{usuario:res.usuario,rom:res.rom});
              setAdmin(false);
            }}>Admin</button>
              <button class="admin">Disconnect</button></div>):(<></>)}

            
          </div>
        );
      }));
    }
  }, [users,admin]);

  return (
    <div>
        
      <button
        className="button-user"
        onClick={() => {
          setUsers(!menuUsers);
        }}
      >
        <FontAwesomeIcon icon={"users"} />
      </button>
      {menuUsers ? (
        <div className="container3">
            <h3>Conectados</h3>
          <button
            className="button-user"
            onClick={() => {
              setUsers(!menuUsers);
            }}
          >
            <FontAwesomeIcon icon={"users"} />
          </button>

          {usu}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
