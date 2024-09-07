import React, { useEffect, useState, useRef } from 'react';
import { azureTranslationApi } from './api/AxiosClient';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
  const RATE_LIMITER_DELAY = process.env.REACT_APP_RATE_LIMITER_DELAY
  const MAX_TRANSCRIPT_LENGTH = process.env.REACT_APP_MAX_TRANSCRIPT_LENGTH

  const { transcript, finalTranscript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [rateLimiter, setRateLimiter] = useState(false);
  const [error, setError] = useState(null);

  const timeoutRef = useRef(null);

  const fetchTranslation = async () => {
    try {
      const translated = await azureTranslationApi(transcript, 'en', 'id');
      setTranslatedText(translated);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const beginListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const resetAll = () => {
    setIsListening(false);
    setTranslatedText('');
    resetTranscript();
  };

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (transcript && !rateLimiter) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      setRateLimiter(true);
      fetchTranslation()
    
      timeoutRef.current = setTimeout(() => {
        setRateLimiter(false);
      }, RATE_LIMITER_DELAY)
    }
  }, [transcript]);

  useEffect(() => {
    if (transcript.length > MAX_TRANSCRIPT_LENGTH) resetTranscript()
    
    fetchTranslation()
  }, [finalTranscript])

  return (
    <div className="flex flex-col gap-2 h-[100vh] w-full justify-center items-center">
      <div className="text-center">
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <div className="mt-1">
          <div className="w-full flex gap-1">
            <button className="border rounded bg-green-800 hover:bg-green-700" onClick={beginListening}>Start</button>
            <button className="border rounded bg-red-800 hover:bg-red-700" onClick={stopListening}>Stop</button>
            <button className="border rounded bg-slate-800 hover:bg-slate-700" onClick={resetAll}>Reset</button>
          </div>
        </div>
      </div>
      <p>{isListening ? (transcript.length === 0 ? 'Listening...' : transcript) : 'Press start to begin'}</p>
      <div className="text-center">
        <span>Translated text:</span>
        <p>{translatedText}</p>
      </div>
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default Dictaphone;