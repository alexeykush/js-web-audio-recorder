const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const TYPE = "audio/webm;codecs=opus";

startBtn.addEventListener("click", () => {
    navigator.mediaDevices
        .getUserMedia({audio: true})
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream, {type: TYPE});

            const recordedChunks = [];

            mediaRecorder.addEventListener("dataavailable", e => recordedChunks.push(e.data));

            mediaRecorder.addEventListener("stop", () => {
                const blob = new Blob(recordedChunks, {type: TYPE});
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.download = `audio-${Date.now()}.webm`;
                a.href = url;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });

            mediaRecorder.start();

            stopBtn.onclick = () => {
                mediaRecorder.stop();
                stream.getAudioTracks()[0].stop();
            }
        });
});