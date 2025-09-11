import { useState } from "react";
import { imageGenerationUseCase, imageVariationUseCase } from "../../../core/use-cases";
import { GptMessages, GptMessagesImageSelectableImage, MyMessages, TextMessageBox, TypingLoader } from "../../components";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}

export const ImageTunningPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: 'Imagen Base',
      info: {
        alt: 'Imagen Base',
        imageUrl: 'http://localhost:3000/gpt/image-generation/1757588971760.png'
      }
    }
  ]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async () => {
    setIsLoading(true);
    const resp = await imageVariationUseCase(originalImageAndMask.original);
    setIsLoading(false);

    if (!resp) return;
    setMessages((prev) => [
      ...prev,
      {
        text: 'Variacion',
        isGpt: true,
        info: {
          imageUrl: resp.url,
          alt: resp.alt
        }
      }
    ])
  }

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const { original, mask } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase(text, original, mask)
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
    <>

      {
        originalImageAndMask.original && (
          <div className="fixed flex flex-col items-center top-14 right-40 z-10 fade-in">
            <span>Editando</span>
            <img
              className="border rounded-xl w-28 h-28 object-contain"
              src={originalImageAndMask.mask ?? originalImageAndMask.original}
              alt="Imagen Original"
            />
            <button
              className="btn-primary mt-2"
              onClick={handleVariation}
            >Generar Variacion</button>
          </div>
        )
      }
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            <GptMessages text='Hola, ¿Que imagen te gustaria editar?' />

            {
              messages.map((message, index) => (
                message.isGpt
                  ? (
                    // <GptMessagesImage
                    <GptMessagesImageSelectableImage
                      key={index}
                      text={!message.info?.imageUrl ? 'Error al generar la imagen' : ''}
                      imageUrl={message.info?.imageUrl!}
                      alt={message.info?.alt!}
                      onImageSelected={maskImageUrl => setOriginalImageAndMask({
                        original: message.info?.imageUrl,
                        mask: maskImageUrl
                      })}
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
    </>
  )
}
