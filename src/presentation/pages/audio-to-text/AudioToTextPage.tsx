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
    const tokens = data?.usage.total_tokens ?? 0;
    const textoGenerado = data?.text ?? '';

    const gptMessage = `
    ## Transcripcion:
    __Total Tokens__ ${Math.round(tokens)}
    ## El Texto es:
    ${textoGenerado}
    `
    setMessages(prev => [
      ...prev,
      { text: gptMessage, isGpt: true },
    ])

    // si en la respuesta existen segmentos podria hacerse asi
    // for (const segment of data?.segments) {
    //   const segmentMessage = `
    //   __De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos: __ ${segment.text}
    //   `
    //   setMessages(prev => [
    //     ...prev,
    //     { text: segmentMessage, isGpt: true },
    //   ])
    // }

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
                  <GptMessages key={index} text={message.text} />
                ) : (
                  <MyMessages key={index} text={(message.text === '') ? 'Transcribe el audio' : message.text} />
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
