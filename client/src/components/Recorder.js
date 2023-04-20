import React, { useState, useEffect } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import shortid from 'shortid'

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

function Recorder({songId, fileIncrement}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blobURL, setBlobURL] = useState(null);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      () => {
        setIsBlocked(false);
      },
      () => {
        setIsBlocked(true);
      }
    );
  }, []);

  const startRecording = () => {
    if (isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start().then(() => {
        setIsRecording(true);
        setTimerId(
          setTimeout(() => {
            stopRecording();
          }, 30000)
        );
      });
    }
  };

  const stopRecording = () => {
    Mp3Recorder.stop().getMp3().then(([buffer, blob]) => {
      setIsRecording(false);
      clearTimeout(timerId);
      setBlobURL(URL.createObjectURL(blob));

      const formData = new FormData();

      formData.append('file', blob, `${shortid.generate()}${songId}.mp3`);
      formData.append('title', `${songId}`);

      fetch(`/fileupload/${songId}`, {
        method: "POST",
        body: formData
      }).then((response) => {fileIncrement(prev=>!prev);console.log('Server response:', response)})
    });
    
  };

  return (
    <div>
      {isBlocked && <div>Permission Denied</div>}
      {isRecording && (
        <div>
          Recording...
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      )}
      {!isRecording  && (
        <button onClick={startRecording}>Start Recording</button>
      )}
    </div>
  );
}

export default Recorder;