import type { AudioToTextResponse } from "../../interfaces";


export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
    try {
        const formData = new FormData();
        formData.append('file', audioFile);
        if (prompt) {
            formData.append('prompt', prompt);
        }

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/audio-to-text`, {
            method: 'POST',
            body: formData,
        })
        const data = resp.json() as AudioToTextResponse;

        console.log({ data });

        return { ok: true, data };
    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo realizar la correccion'
        }
    }
}