export function playAudioFromStart(audio, volume) {
    audio.muted = false;
    if (volume) audio.volume = volume;
    audio.currentTime = 0;
    audio.play();
}