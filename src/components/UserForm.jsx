import React, {useState, useContext} from "react"
import { UserContext } from "./UserContext"

export default function UserForm () {
    const [inputName, setInputName] = useState("");
    const {setName} = useContext(UserContext);

    function handleSubmit(e) {
        e.preventDefault();
        setName(inputName);
        window.history.pushState({}, '', '/quiz');
    }
}