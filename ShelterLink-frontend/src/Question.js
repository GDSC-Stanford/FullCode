import React from 'react';

const Question = ({ data, inputValue, onInputChange, onNext, currentStep, totalQuestions }) => {
  // Calculate the progress percentage
  const progress = ((currentStep + 1) / totalQuestions) * 100;
  const isMultipleChoice = [4, 5, 6].includes(currentStep);

  const handleOptionChange = (event) => {
    onInputChange(event);
  };
  return (
    <div className="question-container">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="question-count">
        <span>Question {currentStep + 1} out of {totalQuestions}</span>
      </div>
      <h2>{data.question}</h2>
      {
        isMultipleChoice ? (
          <div className="options-container">
            {data.options.map((option, index) => (
              <label key={index} className="custom-radio-button">
                <input
                  type="radio"
                  name="option"
                  value={option}
                  checked={inputValue === option}
                  onChange={handleOptionChange}
                  className="option-input"
                />
                {option}
              </label>
            ))}
          </div>
        ) : (
          <input
            type="text"
            value={inputValue}
            onChange={onInputChange}
            autoFocus
            className="question-input"
          />
        )
      }
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Question;