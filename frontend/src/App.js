import Form from './components/ComplaintForm';
import './App.css';

function App() {
  return (
  <>
    <h1 className="text-4xl font-bold text-center mt-6">
      Welcome to my Complaint Portal
    </h1>
    <h5 className="text-lg italic text-center text-gray-600">
      built with React and Tailwind CSS (backend with Node.js, Express, MongoDB atlas)
    </h5>


    <div className="formContainer">
      <Form />
    </div>
   
    
  </>
  );
}

export default App;
