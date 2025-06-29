import { GptMessages, MyMessages } from "../../components"

export const OrthographyPage = () => {
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessages text={'Hola, puedes escribir tu texto en español para ayudarte'} />
          <MyMessages text={'Hola Mundo'} />
        </div>
      </div>
    </div>
  )
}
