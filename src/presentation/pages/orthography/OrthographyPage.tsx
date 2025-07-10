import { GptMessages, MyMessages, TextMessageBox, TypingLoader } from "../../components"

export const OrthographyPage = () => {

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessages text='Hola, puedes escribir tu texto en español para ayudarte' />
          <MyMessages text='Hola Mundo' />

          <TypingLoader className="fade-in" />
        </div>
      </div>

      <TextMessageBox
        onSendMessage={(message) => console.log(message)}
        placeholder="Escribe aqui lo que deseas"
        disableCorrections
      />

    </div>
  )
}
