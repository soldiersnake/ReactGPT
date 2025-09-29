
export async function* ProsConsStreamGeneratorUseCase(prompt: string, abortSignal: AbortSignal) {

    try {
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt }),
            signal: abortSignal   // parametro para cancelar la consulta
        })

        if (!resp.ok) throw new Error('No se pudo realizar la comparacion')

        const reader = resp.body?.getReader();
        if (!reader) {
            console.log('no se pudo generar el reader');
            return null;
        }

        const decoder = new TextDecoder();

        let text = '';
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            };

            const decodedChunk = decoder.decode(value, { stream: true });
            text += decodedChunk;
            yield text; // es el retorno de una funcion generadora
        }


    } catch (error) {
        console.log('Hubo un error', error);

        return null
    }
}