"use client";

import { useEffect,useState,useRef } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { socket } from "@/lib/socket";

export default function ChatRoom(){

const {id} = useParams();

const chatId = String(id);

const [messages,setMessages] = useState([]);

const [text,setText] = useState("");

const scrollRef = useRef(null);

const userId =
typeof window !== "undefined"
? localStorage.getItem("userId")
: null;

useEffect(()=>{

async function load(){

const res = await api.get(`/chats/${chatId}`);

setMessages(res.data);

}

load();

socket.connect();

socket.emit("join_chat",chatId);

socket.on("receive_message",(msg)=>{

setMessages(prev=>[...prev,msg]);

});

return()=>{

socket.off("receive_message");

};

},[chatId]);

useEffect(()=>{

scrollRef.current?.scrollIntoView({
behavior:"smooth"
});

},[messages]);

const sendMessage = async()=>{

if(!text.trim()) return;

const res = await api.post(`/chats/${chatId}`,{text});

const saved = res.data;

setMessages(prev=>[...prev,saved]);

socket.emit("send_message",{
chatId,
text:saved.text,
sender:userId,
_id:saved._id
});

setText("");

};

return(

<div className="max-w-3xl mx-auto h-[85vh] flex flex-col">

<div className="flex-1 overflow-y-auto p-4 space-y-3">

{messages.map((m:any)=>(

<div
key={m._id}
className={`p-3 rounded-lg w-fit max-w-[70%] ${
m.sender===userId
? "ml-auto bg-blue-600 text-white"
: "bg-gray-200"
}`}
>

{m.text}

</div>

))}

<div ref={scrollRef}/>

</div>

<div className="flex gap-2 p-4">

<input
value={text}
onChange={(e)=>setText(e.target.value)}
onKeyDown={(e)=>e.key==="Enter" && sendMessage()}
className="flex-1 border rounded px-3 py-2"
/>

<button
onClick={sendMessage}
className="bg-blue-600 text-white px-6 rounded"
>

Send

</button>

</div>

</div>

);

}