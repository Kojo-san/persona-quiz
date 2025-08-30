import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { UserProvider } from './components/UserContext'
import Header from './components/Header'
import UserForm from './components/UserForm'
import Question from './components/Question'
import Results from './components/Results'
import './App.css'

function App() {
  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
  ];

  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
  };

  const elements = {
    "Red 🔴": "Fire",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",
  };

  const [currentQuestionIndex,setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userName, setUserName] = useState("");
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);
  
  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  function handleUserFormSubmit(name) {
    setUserName(name);
  };

  function determineElement(answers) {
  
    const counts = {};
    answers.forEach(function(answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
  
    return Object.keys(counts).reduce(function(a, b) {
      return counts[a] > counts[b] ? a : b
    });
  };

async function fetchArtwork(element) {
  try {
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keywords[element]}`
    );
    const data = await response.json();
    if (data.objectIDs && data.objectIDs.length > 0) {
      const artId = data.objectIDs[0];
      const artResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artId}`
      );
      const artData = await artResponse.json();
      setArtwork(artData);
    }
  } catch (error) {
    console.error("Error fetching artwork:", error);
  }
}

useEffect(
  function () {
    if (currentQuestionIndex === questions.length) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(selectedElement);
    }
  },
  [currentQuestionIndex]
);
  return (
   <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
          <Route
            path="/quiz"
            element={
              currentQuestionIndex < questions.length ? (
                <Question
                  question={questions[currentQuestionIndex].question}
                  options={questions[currentQuestionIndex].options}
                  onAnswer={handleAnswer}
                />
              ) : (
                <Results element={element} artwork={artwork} />
              )
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App
