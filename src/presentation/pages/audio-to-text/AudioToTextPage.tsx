import { useState } from "react";
import { GptMessages, MyMessages, TextMessageBoxFile, TypingLoader } from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string
  isGpt: boolean
}

export const AudioToTextPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);


    // TODO: useCase
    const { data, ok } = await audioToTextUseCase(audioFile, text)
    setIsLoading(false);
    if (!ok) return;
    // Todo: añadir el emensaje de isGPE en TRUE
    console.log({ data });

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessages text='Hola, puedes enviar tu audio para transformarlo a texto' />

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

      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Escribe aqui lo que deseas"
        disableCorrections
        accept="audio/*"
      />

    </div>
  )
}
