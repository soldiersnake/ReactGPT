import { useState } from "react";
import { GptMessages, GptMessagesAudio, MyMessages, TextMessageBoxSelect, TypingLoader } from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";

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

interface TextMessage {
  text: string
  isGpt: boolean
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio';
}

type Message = TextMessage | AudioMessage


export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false, type: 'text' }]);

    // TODO: useCase
    const { ok, message, audioUrl } = await textToAudioUseCase(text, selectedVoice)
    setIsLoading(false);

    if (!ok) return 'No se pudo generar el audio';

    setMessages((prev) =>
      [...prev, { text: `${selectedVoice} - ${message}`, isGpt: true, type: 'audio', audio: audioUrl! }
      ]);

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessages text={displamer} />

          {
            messages.map((message, index) => (
              message.isGpt ?
                (
                  message.type === 'audio' ? (
                    <GptMessagesAudio
                      key={index}
                      text={message.text}
                      audio={message.audio}
                    />
                  ) : (
                    <GptMessages key={index} text={message.text} />
                  )
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
