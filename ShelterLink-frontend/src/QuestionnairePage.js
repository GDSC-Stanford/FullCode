// src/QuestionnairePage.js

import React, { useState } from 'react';
import './QuestionnairePage.css'; // Make sure this CSS file exists and is in the correct directory
import Question from './Question'; // Make sure this import path is correct

const questions = [
  { key: 'name', question: 'What is your name?' },
  { key: 'age', question: 'What is your age?' },
  { key: 'gender', question: 'What is your gender?' },
  { key: 'los', question: 'How long do you plan on staying in this shelter?'}, 
  { key: 'relationship', question: 'What is your relationship status?', options: ['Single', 'Partner Without Kids', 'Partner With Kids ']}, 
  { key: 'language', question: 'What is your language?', options: ['English', 'Spanish', 'Chinese', 'Other'] }, 
  { key: 'disability', question: 'Please choose your disability status', options: ['Substance Abuse', 'Mental Illness', 'Sick', 'Disabilities/None'] }
];



function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [predictedShelter, setPredictedShelter] = useState('')
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleNext = () => {
    if (inputValue.trim() === '') {
      alert('Please fill out this field before continuing.');
      return;
    }
    
    const currentQuestionKey = questions[currentStep].key;
    setAnswers(prev => ({ ...prev, [currentQuestionKey]: inputValue }));
    setInputValue('');
    setCurrentStep(prev => prev + 1);
  };

  function mapGenderToCode(gender) {
    const codes = { 'Female': 1, 'Male': 2, 'Nonbinary': 3 };
    return codes[gender] || 0; // Return 0 or another value for unknown genders
  }
  
  function mapRelationshipToCode(relationship) {
    const codes = { 'Single': 1, 'Partner': 2, 'Partner with kids': 3 };
    return codes[relationship] || 0; // Return 0 or another value for unknown relationships
  }
  
  function mapLanguageToCode(language) {
    const codes = { 'English': 1, 'Spanish': 2, 'Chinese': 3, 'Others': 4 };
    return codes[language] || 0; // Return 0 or another value for unknown languages
  }
  
  function mapDisabilityToCode(disability) {
    const codes = { 'Substance abuse': 1, 'Mental illness': 2, 'Sick': 3, 'Other disabilities': 4, 'None': 4 };
    return codes[disability] || 0; // Assuming 'None' is equivalent to 'Other disabilities' or use another value for 'None'
  }
  
  if (currentStep >= questions.length) {

    fetch('http://localhost:8080/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: parseInt(answers.age, 10),
        disability: mapDisabilityToCode(answers.disability),
        gender: mapGenderToCode(answers.gender),
        language: mapLanguageToCode(answers.language),
        los: parseInt(answers.los, 10), // Make sure to map "length of stay" to "los" if that's what your API expects
        relationship: mapRelationshipToCode(answers.relationship), 
        location: 2
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setPredictedShelter(data)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    
    return (
      <div className="questionnaire-complete">
        <h1>Thank you for completing the questionnaire!</h1>
        <div className="shelter-prediction">
          <h2>Your predicted shelter is:</h2>
          <p className="shelter-name"> {predictedShelter.predictedShelter}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="questionnaire-page">
      <Question
        data={questions[currentStep]}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onNext={handleNext}
        currentStep={currentStep}
        totalQuestions={questions.length}
      />

    </div>
  );
}

export default QuestionnairePage;
