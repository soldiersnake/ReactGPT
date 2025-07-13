import { useState } from "react"
import { GptMessages, MyMessages, TypingLoader, TextMessageBox } from "../components";

interface Message {
    text: string
    isGpt: boolean
}

export const ChatTemplate = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async (text: string) => {
        setIsLoading(true);
        setMessages((prev) => [...prev, { text: text, isGpt: false }]);

        // TODO: useCase

        setIsLoading(false);
        // Todo: añadir el emensaje de isGPE en TRUE

    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className="grid grid-cols-12 gap-y-2">
                    <GptMessages text='Hola, puedes escribir tu texto en español para ayudarte' />

                    {
                        messages.map((message, index) => (
                            message.isGpt
                                ? (
                                    <GptMessages key={index} text="Esto es de OpenAI" />
                                ) : (
                                    <MyMessages key={index} text={message.text} />
                                )

                        ))
                    }

                    {
                        isLoading &&
                        <div className="col-start-1 col-end-12 fade-in">
                            <TypingLoader />
                        </div>
                    }


                </div>
            </div>

            <TextMessageBox
                onSendMessage={handlePost}
                placeholder="Escribe aqui lo que deseas"
                disableCorrections
            />

        </div>
    )
}
