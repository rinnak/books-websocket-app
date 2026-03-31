import {useCallback, useEffect, useRef, useState} from "react";
type Packet<T = unknown> = { //структура, отправляемая через сокет
    type: string;
    data?: T
};

type ChatEntry = {
    id: number;
    text: string;
    system: boolean;
}


export default function Chat(){
    const [userName, setUserName] = useState("");
    const [message, setMessage] = useState("");
    const [connected, setConnected] = useState(false);
    const [entries, setEntries] = useState<ChatEntry[]>([]);

    const socketRef = useRef<WebSocket | null>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const entryIdRef = useRef(0);

    useEffect(() => {
        if(chatRef.current){
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [entries]);

    const addToChat = useCallback((text: string, system = false) => {
        setEntries(prev => [...prev, {id:entryIdRef.current++, text, system}]);
    }, []);

    const sendPacket = useCallback((type: string, data?:object) => {
        const ws = socketRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        ws.send(JSON.stringify({type, data}));
    }, []);

    const handlePacket = useCallback((packet: Packet) => {
        const {type, data} = packet;
        switch (type){
            case "status":
                setConnected(true);
                break
            case "incomingMessage":
                if (data && typeof data === "object" && "name" in data && "message" in data) {
                    addToChat(`${data.name}: ${data.message}`);
                }
                break;
            case "systemMessage":
                if (
                    data &&
                    typeof data === "object" &&
                    "message" in data &&
                    typeof (data as { message: string }).message === "string"
                ) {
                    addToChat(`system: ${(data as { message: string }).message}`, true);
                }
                break;

            case "error":
                if (
                    data &&
                    typeof data === "object" &&
                    "message" in data &&
                    typeof (data as { message: string }).message === "string"
                ) {
                    addToChat(`error: ${(data as { message: string }).message}`, true);
                }
                break;
            default:
                addToChat(`Неизвестный пакет: ${type}`, true);
        }
    }, [addToChat]);

    const connect = useCallback(() => {
        const name = userName.trim();
        if(!name) return alert("Введите имя пользователя");
        const ws = new WebSocket(
            window.location.hostname === 'localhost'
                ? "ws://158.160.203.172:8082"
                : "wss://158.160.203.172:8082"
        );
        socketRef.current = ws;

        ws.onopen = () => {
            addToChat(`Соединение установлено`, true);
            ws.send(JSON.stringify({type: "login", data: {name}}))
        };
        ws.onmessage = (e) => handlePacket(JSON.parse(e.data));
        ws.onerror = () => addToChat("Ошибка соединения", true);
        ws.onclose = () => {
            addToChat("Соединение закрыто", true);
            setConnected(false);
            socketRef.current = null;
        };
    }, [userName, addToChat, handlePacket]);

    const sendMessage = useCallback (() => {
        const text = message.trim();
        if (!text) return;
        sendPacket("outgoingMessage", {message: text});
        setMessage("");
    }, [message, sendPacket]);

    return(
        <div className="border p-4 rounded-xl flex flex-col h-full mb-4">
            <div className="mb-2 flex gap-2">
                <input
                    className="flex-1 border p-2 rounded-xl"
                    placeholder="Имя пользователя"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={connected}
                />
                <button onClick={connect} disabled={connected} className="bg-green-500 text-white px-4 rounded-xl cursor-pointer">подключиться к чату</button>
            </div>
            <div className="mb-2 flex-col gap-2">

                <div ref={chatRef} className="flex-1 overflow-y-auto border p-2 rounded-xl h-72">
                    {entries.map(e => (
                        <div key={e.id} className={e.system ? "text-gray-500 italic" : ""}>{e.text}</div>
                    ))}
                </div>
                <div className="w-full mt-2 flex gap-2">
                    <input
                        className="flex-1  mr-2 border p-2 rounded-xl"
                        placeholder="Сообщение"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={!connected}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}

                    />
                    <button onClick={sendMessage} disabled={!connected} className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-xl">Отправить</button>
                </div>
            </div>
        </div>
    )

}