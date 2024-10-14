import { useNavigate } from "react-router-dom";


export function Homepage() {

  const nav = useNavigate()


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">VideoCall</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2" onClick={()=>nav("/s")} >
          <button>
            <h1>Become Sender</h1>
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2" onClick={()=>nav("/r")}>
          <button>
            <h1>Become Receiver</h1>
          </button>
        </div>
      </div>
    </div>
  );
}
