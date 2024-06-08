import React, { useState } from 'react';
import axios from 'axios';
import TextToSpeech from "./TextToSpeech";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'es-ES';

const VoiceRecognitionApp = () => {
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');

    const BASIC_TEXT = 'Asume el rol de Rosa, un personaje de la novela "Rabia" escrita por Sergio Bizzio. Rosa es una joven empleada doméstica en una opulenta mansión. Tiene el cabello oscuro, que suele llevar recogido, y viste ropa modesta y práctica acorde a su trabajo. Aunque su vida es sencilla y está marcada por el arduo trabajo, Rosa es una persona amable, compasiva y decidida.\n' +
        '\n' +
        'Rosa está en una relación con José María, un obrero de la construcción. Hace poco descubrio que José María se habia escondido en la mansión después de cometer un asesinato. La mansión es un lugar de contrastes: mientras Rosa trabaja incansablemente para mantenerla impecable, los dueños viven en lujo y comodidad. La historia de "Rabia" explora temas como la soledad, el amor y la alienación, elementos que Rosa vive de cerca.\n' +
        '\n' +
        'Recuerda, eres Rosa: una mujer joven y fuerte, enfrentando desafíos en un entorno que resalta las diferencias de clase y los secretos ocultos. Responderás a las preguntas y participarás en conversaciones desde esta perspectiva, manteniendo la esencia de tu carácter y tus circunstancias. Procura hablar conciso y con pocas palabras. Nuestra conversacion empieza con esta oracion: ';


    const handleListen = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                startRecognition();
            })
            .catch((error) => {
                console.error('Error accessing the microphone', error);
                alert('Please connect a microphone and allow access to it.');
            });
    };

    const startRecognition = () => {
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    recognition.onstart = () => {
        console.log('Microphone is listening...');
    };

    recognition.onresult = async (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        console.log(transcriptText);
        await sendToCohere(transcriptText);
    };

    recognition.onerror = (event) => {
        console.error('Error occurred in recognition: ', event.error);
        if (event.error === 'not-allowed') {
            alert('Permission to use microphone was denied. Please allow access to the microphone.');
        }
    };

    const sendToCohere = async (text) => {
        if (!apiKey) {
            alert('Please enter your Cohere API key.');
            return;
        }

        try {
            const response = await axios.post('https://api.cohere.ai/v1/chat', {
                model: 'command-r',
                message: BASIC_TEXT + text,
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            setResponse(response.data.text);
        } catch (error) {
            console.error('Error calling the Cohere API: ', error);
            if (error.response && error.response.data) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('An unknown error occurred.');
            }
        }
    };

    recognition.onaudiostart = () => {
        console.log('Audio capturing started');
    };

    recognition.onaudioend = () => {
        console.log('Audio capturing ended');
    };

    recognition.onspeechend = () => {
        console.log('Speech has stopped being detected');
        recognition.stop();
        setIsListening(false);
    };

    recognition.onspeechstart = () => {
        console.log('Speech has been detected');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <input
                type="text"
                placeholder="Enter Cohere API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ marginBottom: '20px', width: '300px' }}
            />
            <br />
            <input
                type="text"
                placeholder="Enter elevenLabs API Key"
                value={elevenLabsApiKey}
                onChange={(e) => setElevenLabsApiKey(e.target.value)}
                style={{ marginBottom: '20px', width: '300px' }}
            />
            <button onClick={handleListen}>
                {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
            <p><strong>Transcription:</strong> {transcript}</p>
            <p><strong>Response:</strong> {response}</p>
            {response && <TextToSpeech text={response} apiKey={elevenLabsApiKey} />}
        </div>
    );
};

export default VoiceRecognitionApp;