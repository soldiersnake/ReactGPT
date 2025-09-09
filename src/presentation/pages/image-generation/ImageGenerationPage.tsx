import { useState } from "react"
import { GptMessages, MyMessages, TypingLoader, TextMessageBox, GptMessagesImage } from "../../components";
import { imageGenerationUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}

export const ImageGenerationPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const imageInfo = await imageGenerationUseCase(text)
    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [...prev, { text: 'No se pudo generar la imagen', isGpt: true }])
    }

    setMessages(prev => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt,
        }
      }
    ])

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessages text='Hola, ¿Que imagen te gustaria generar?' />

          {
            messages.map((message, index) => (
              message.isGpt
                ? (
                  <GptMessagesImage
                    key={index}
                    text={!message.info?.imageUrl ? 'Error al generar la imagen' : ''}
                    imageUrl={message.info?.imageUrl!}
                    alt={message.info?.alt!}
                  />
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
