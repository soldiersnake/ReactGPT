
import { useEffect, useState } from "react"
import { GptMessages, MyMessages, TextMessageBox, TypingLoader } from "../../components";
import { createThreadUseCase, postQuestionuseCase } from "../../../core/use-cases";

interface Message {
  text: string
  isGpt: boolean
}

export const AssistantPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<string>();

  // obtener el thread y si no existe crearlo
  useEffect(() => {
    const threadId = localStorage.getItem('threadId')

    if (threadId) {
      setThreadId(threadId)
    } else {
      createThreadUseCase()
        .then((id) => {
          setThreadId(id);
          localStorage.setItem('threadId', id)
        })
    }

  }, []);

  useEffect(() => {
    if (!threadId) return;

    setMessages(prev => {
      const yaExiste = prev.some(m => m.isGpt && m.text.includes(`Numero de thread es ${threadId}`));
      if (yaExiste) return prev;
      return [...prev, { text: `Numero de thread es ${threadId}`, isGpt: true }];
    });
  }, [threadId]);


  const handlePost = async (text: string) => {
    if (!threadId) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    // TODO: useCase
    const replies = await postQuestionuseCase(threadId, text)

    setIsLoading(false);
    // Todo: añadir el emensaje de isGPE en TRUE

    for (const reply of replies) {
      for (const message of reply.content) {
        setMessages((prev) => [
          ...prev,
          { text: message, isGpt: (reply.role === 'assistant'), info: reply }
        ])
      }
    }

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessages text='Hola soy tu asintete Sam, puedes escribir tu texto en español para ayudarte' />

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
