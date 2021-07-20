// const BACKEND = 'https://kevin-testing-backend.herokuapp.com';
const BACKEND = 'http://149.28.32.187:3006';
// const BACKEND = 'http://localhost:3000';

const API_ENDPOINT = `${BACKEND}/api/v1`
export const Config = {
    BACKEND,
    API_ENDPOINT,
    AI_MODEL: 'http://34.194.227.208:5000/get_gpt_data',
    MORE_TEST: 'https://jqyw8hhkig.execute-api.us-east-1.amazonaws.com/default/kevin-testing-text',
    JS_SCRIPT: `<script src="${API_ENDPOINT}/domain/kevin-stevens.js"></script>`
}