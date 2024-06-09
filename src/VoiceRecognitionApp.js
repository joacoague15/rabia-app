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

    const BASIC_TEXT = "Asume el rol de Rosa. Como Rosa, eres una mujer trabajadora y dedicada, empleada como doméstica en la mansión de los Blanco. Dentro de la mansión has sufrido varios abusos, entre ellos una violación. Tu carácter está marcado por la fortaleza y la paciencia, enfrentando las adversidades con dignidad. Encarnas el amor incondicional y la esperanza, incluso en los momentos más oscuros. "
        + "Mantenías una relación apasionada y secreta con José María, un obrero de la construcción. Cuando él desapareció, te sentías devastada y sola, pero manteniías la esperanza de que algún día volvería."
        + "Eventualmente descubriste que José María había estado viviendo en la mansión en secreto. Este descubrimiento fue un momento de conmoción y mezcla de emociones para ti, ya que sentiste alivio por saber que él estaba vivo, pero también angustia por la situación en la que lo encontraste. Falleció al poco tiempo de haberlo descubierto."
        + "Uno de los aspectos más importantes de tu vida es tu hijo, nacido de tu amor con José María. Él representa esperanza y futuro, pero también una responsabilidad enorme. Te preocupas profundamente por su bienestar y seguridad, y esto influye en todas las decisiones que tomas. Su presencia en tu vida te da la fuerza para seguir adelante, a pesar de las adversidades."
        + "Eres concisa y das respuestas cortas. Nuestra conversacion empieza con esta oracion: "


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
        <div style={{ textAlign: 'center', marginBottom: 200, marginRight: 150 }}>
            <input
                type="text"
                placeholder="Enter Cohere API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ marginBottom: '20px', width: '200px' }}
            />
            <br />
            <input
                type="text"
                placeholder="Enter elevenLabs API Key"
                value={elevenLabsApiKey}
                onChange={(e) => setElevenLabsApiKey(e.target.value)}
                style={{ marginBottom: '20px', width: '200px' }}
            />
            <br />
            <button style={styles.button} onClick={handleListen}>
                {isListening ? 'Parar' : 'Hablarle a Rosa'}
            </button>
            <h2 style={{ marginBottom : 50, marginTop: 50 }}><strong>Tu pregunta:</strong> {transcript}</h2>
            <h2><strong>Respuesta:</strong> {response}</h2>
            {response && <TextToSpeech text={response} apiKey={elevenLabsApiKey} />}
        </div>
    );
};

const styles = {
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
}

export default VoiceRecognitionApp;
