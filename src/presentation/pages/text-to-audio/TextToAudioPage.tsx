import { useState } from "react";
import { GptMessages, MyMessages, TextMessageBoxSelect, TypingLoader } from "../../components";

const displamer = `## Hola, escribe algun texto para generar Audio en base a el.
  * todo el audio generado es por AI.
`
const voices = [
  { id: "alloy", text: "Alloy" },
  { id: "ash", text: "ash" },
  { id: "ballad", text: "ballad" },
  { id: "coral", text: "coral" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "nova", text: "Nova" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
  { id: "sage", text: "sage" },
  { id: "verse", text: "verse" },
];

interface Message {
  text: string
  isGpt: boolean
}


export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
    console.log(selectedVoice); // TODO : ELIMINAR ESTO

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
          <GptMessages text={displamer} />

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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe aqui lo que deseas"
        options={voices}
      />

    </div>
  )
}
