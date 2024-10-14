import { Receiver } from "./reciever";
import { Sender } from "./sender";

export function Homepage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">VideoCall</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2">
         
          <Sender />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2">
         
          <Receiver />
        </div>
      </div>
    </div>
  );
}
