import { useState } from "react"
import { orthographyUseCase } from "../../../core/use-cases"
import { GptMessages, GptOrthographyMessage, MyMessages, TextMessageBox, TypingLoader } from "../../components"

interface Message {
  text: string
  isGpt: boolean
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const { ok, errors, message, userScore } = await orthographyUseCase(text);
    if (!ok) {
      setMessages((prev) => [...prev, { text: 'No se pudo realizar la correccion', isGpt: true }])
    } else {
      setMessages((prev) => [...prev, {
        text: message, isGpt: true,
        info: {
          errors,
          message,
          userScore,
        }
      }])
    }

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
                  <GptOrthographyMessage
                    key={index}
                    errors={message.info!.errors}
                    message={message.info!.message}
                    userScore={message.info!.userScore}
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
