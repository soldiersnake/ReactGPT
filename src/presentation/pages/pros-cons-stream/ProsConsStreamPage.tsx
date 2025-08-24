import { useRef, useState } from "react";
import { GptMessages, MyMessages, TextMessageBox, TypingLoader } from "../../components";
import { ProsConsStreamGeneratorUseCase } from "../../../core/use-cases";


interface Message {
  text: string
  isGpt: boolean
}

export const ProsConsStreamPage = () => {

  const abortController = useRef(new AbortController()); // el abortController es para cancenar una operacion en proceso
  const isRunning = useRef(false)

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {

    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunning.current = true;
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    // TODO: useCase
    const stream = ProsConsStreamGeneratorUseCase(text, abortController.current.signal)
    setIsLoading(false);
    setMessages((messages) => [...messages, { text: '', isGpt: true }]);

    for await (const text of stream) {

      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].text = text;
        return newMessages;
      });
    }

    isRunning.current = false;


    // METODO VIEJO
    // const reader = await ProsConsStreamUseCase(text);
    // setIsLoading(false);

    // if (!reader) return alert('No se pudo generar el reader');
    // // generar el ultimo mensaje

    // const decoder = new TextDecoder();
    // let message = '';
    // setMessages((messages) => [...messages, { text: message, isGpt: true }])

    // while (true) {
    //   const { value, done } = await reader.read();
    //   if (done) break;

    //   const decodedChunk = decoder.decode(value, { stream: true });
    //   message += decodedChunk;

    //   // actualizar el ultimo mensaje
    //   setMessages((messages) => {
    //     const newMessages = [...messages];
    //     newMessages[newMessages.length - 1].text = message;
    //     return newMessages;
    //   });
    // }

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessages text='¿Que deseas comparar hoy?' />

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
