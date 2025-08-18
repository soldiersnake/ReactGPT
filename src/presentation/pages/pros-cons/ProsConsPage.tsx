import { useState } from "react";
import { GptMessages, MyMessages, TextMessageBox, TypingLoader } from "../../components";
import { ProsConsUseCase } from "../../../core/use-cases";

interface Message {
  text: string
  isGpt: boolean
}

export const ProsConsPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    // TODO: useCase
    const { ok, content } = await ProsConsUseCase(text);
    setIsLoading(false);

    if (!ok) return;
    setMessages((prev) => [...prev, { text: content, isGpt: true }])

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessages text='Hola, puedes escribir lo que sea que quieras que compare o puntos de vista' />

          {
            messages.map((message, index) => (
              message.isGpt
                ? (
                  <GptMessages key={index} text={message.text} />
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
