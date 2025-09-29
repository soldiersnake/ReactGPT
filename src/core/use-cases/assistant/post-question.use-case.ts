import type { QuestionResponse } from "../../../interfaces";


export const postQuestionuseCase = async (threadId: string, question: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_ASSISTANT_API}/user-thread`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadId, question })
        });

        const replies = await resp.json() as QuestionResponse[];
        console.log(replies);

        return replies;
    } catch (error) {
        console.log(error);
        throw new Error('Error posting question');
    }
}