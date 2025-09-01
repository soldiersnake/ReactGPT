export interface AudioToTextResponse {
    text: string;
    usage: Usage;
}

export interface Usage {
    type: string;
    total_tokens: number;
    input_tokens: number;
    input_token_details: InputTokenDetails;
    output_tokens: number;
}

export interface InputTokenDetails {
    text_tokens: number;
    audio_tokens: number;
}
