import {useEffect, useRef} from 'react';
import axios from 'axios';

const TextToSpeech = ({ text, apiKey }) => {
    const currentText = useRef('')

    useEffect(() => {
        const fetchAudio = async () => {
            if (currentText.current === text) return;

            currentText.current = text;

            try {
                const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/od8yrcXVeq6RTJZOLGH0', {
                    text: text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.6,
                        similarity_boost: 0.75,
                        style: 0.1,
                        use_speaker_boost: false
                    }
                }, {
                    headers: {
                        'xi-api-key': apiKey,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                });

                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const audioBuffer = await audioContext.decodeAudioData(response.data);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start(0);
            } catch (error) {
                console.error('Error calling the Eleven Labs API: ', error);
            }
        };

        fetchAudio();
    }, [text]);

    return null;
};

export default TextToSpeech;
