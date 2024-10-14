
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import { Sender } from './pages/sender';
import { Receiver} from './pages/reciever';
import { Homepage } from './pages/Home';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/s" element={<Sender />} />
        <Route path="/r" element={<Receiver />} />
        <Route path="/home" element={<Homepage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
