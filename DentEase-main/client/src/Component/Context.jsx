import { createContext, useState, useEffect } from "react";
import runChat from "./gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [resultData,setResultData] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    //remove lang kay bati
    useEffect(() => {
        setChatHistory([
          {
            prompt: "...",
            response: "Hello! Welcome to DentEase Dental Clinic. How can I assist you today?",
          },
        ]);
    }, []);

    const onSent = async (prompt) => {

        setResultData("")
        setRecentPrompt(input)
        const response = await runChat(input)

        //for response Text formatting
        let responseArray = response.split("**");
        let newResponse = "";
        for (let i=0; i< responseArray.length; i++) 
        {
            if(i === 0 || i%2 !== 1) {
                newResponse += responseArray[i];
            }
            else {
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")

        setResultData(newResponse2)
        //save chat history
        setChatHistory((prevHistory) => [
            ...prevHistory,
            { prompt: input, response: newResponse2 },
        ]);

        setInput("")
    }

    const contextValue = {
        onSent,
        setRecentPrompt,
        recentPrompt,
        resultData,
        input,
        setInput,
        chatHistory,
        setChatHistory
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider