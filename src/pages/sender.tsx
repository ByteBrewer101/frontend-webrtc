import { useEffect, useRef, useState } from "react";

export const Sender = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const [socket, setSocket] = useState<WebSocket | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setPC] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://signaling-server-7iph.onrender.com");
    setSocket(socket);
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "sender",
        })
      );
    };
  }, []);

  const initiateConn = async () => {
    if (!socket) {
      alert("Socket not found");
      return;
    }

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createAnswer") {
        await pc.setRemoteDescription(message.sdp);
      } else if (message.type === "iceCandidate") {
        pc.addIceCandidate(message.candidate);
      }
    };

    const pc = new RTCPeerConnection();
    setPC(pc);
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: event.candidate,
          })
        );
      }
    };

    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.send(
        JSON.stringify({
          type: "createOffer",
          sdp: pc.localDescription,
        })
      );
    };

    getCameraStreamAndSend(pc,videoRef);
  };

  const getCameraStreamAndSend = (
    pc: RTCPeerConnection,
    videoRef: React.RefObject<HTMLVideoElement>
  ) => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream; // Set the stream to the video element
        videoRef.current.play(); // Play the video
      }

      stream.getTracks().forEach((track) => {
        pc?.addTrack(track); // Add tracks to the peer connection
      });
    });
  };


  return (
    <div className="flex flex-col flex justify-around items-center justify-start rounded-xl shadow-xl w-[500px] h-[500px]">
      Sender
      <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
      <button onClick={initiateConn} className="bg-blue-500 text-white p-2 rounded-full shadow-xl">Send data</button>
    </div>
  );
};
