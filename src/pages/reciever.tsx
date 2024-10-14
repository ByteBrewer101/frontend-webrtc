import  { useEffect, useRef, useState } from "react";

export const Receiver = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // Create a ref for the video element
  const [isPlaying, setIsPlaying] = useState(false); // State to track if the video is playing

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "receiver",
        })
      );
    };
    startReceiving(socket);

    // Cleanup WebSocket on component unmount
    return () => {
      socket.close();
    };
  }, []);

  function startReceiving(socket: WebSocket) {
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([event.track]); // Set the stream to the video element
        if (isPlaying) {
          videoRef.current.play(); // Play the video only if the user has interacted
        }
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createOffer") {
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp)).then(
          () => {
            pc.createAnswer().then((answer) => {
              pc.setLocalDescription(answer);
              socket.send(
                JSON.stringify({
                  type: "createAnswer",
                  sdp: answer,
                })
              );
            });
          }
        );
      } else if (message.type === "iceCandidate") {
        pc.addIceCandidate(new RTCIceCandidate(message.candidate));
      }
    };
  }

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true); // Update the state to indicate the video is playing
        })
        .catch((error) => {
          console.error("Error trying to play the video:", error);
        });
    }
  };

  return (
    <div className="flex flex-col flex justify-center items-center justify-start rounded-xl shadow-xl w-[500px] h-[500px]">
      <h2>Receiver</h2>

      <video ref={videoRef} autoPlay playsInline className="w-full  h-auto" />
      <button
        onClick={handlePlayClick}
        className=" rounded-full shadow-xl w-fit p-2 bg-blue-500 text-white mt-4"
      >
        Play Video
      </button>
    </div>
  );
};
