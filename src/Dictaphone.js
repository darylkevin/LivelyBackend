import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [isListening, setIsListening] = useState(false);

  const beginListening = () => {
    setIsListening(true)
    SpeechRecognition.startListening({ continuous: true })
  }

  const stopListening = () => {
    SpeechRecognition.stopListening() 
  }

  const resetAll = () => {
    setIsListening(false)
    resetTranscript()
  }

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
  }, [])

  return (
    <div className='flex flex-col gap-2 h-[100vh] w-full justify-center items-center'>
        <div className=''>
            <p className='text-center'>Microphone: {listening ? 'on' : 'off'}</p>
            <div className='mt-1'>
                <div className='w-full flex gap-1'>
                    <button className="border rounded bg-green-800 hover:bg-green-700" onClick={() => beginListening()}>Start</button>
                    <button className="border rounded bg-red-800 hover:bg-red-700" onClick={() => stopListening()}>Stop</button>
                    <button className="border rounded bg-slate-800 hover:bg-slate-700" onClick={() => resetAll()}>Reset</button>
                </div>
            </div>
        </div>
        <p>
            {
                isListening ? (
                    transcript.length === 0 ? 
                    'Listening...' : 
                    transcript
                ) : 'Press start to begin'
            }
        </p>        
    </div>
  );
};

export default Dictaphone;