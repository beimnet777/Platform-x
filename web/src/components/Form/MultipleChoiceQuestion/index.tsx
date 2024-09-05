// src/components/MultipleChoiceQuestion.tsx
import React from 'react';
import { Field, FieldArray, ErrorMessage } from 'formik';
import { QuestionProps } from '../type';
import { Button, Container, Input, Label } from './styles';



const MultipleChoiceQuestion: React.FC<QuestionProps & { options: { id: string; text: string }[]; maxSelections: number }> = ({
  id,
  questionText,
  onChange,
  options,
  maxSelections,
}) => {
  const handleOptionChange = (index: number, value: string) => {
    // Update the specific option text
    const updatedOptions = options.map((option, i) => (i === index ? { ...option, text: value } : option));
    onChange(id, 'options', updatedOptions); // Update state with new options
  };

  const handleRemoveOption = (index: number) => {
    // Remove the specific option
    const updatedOptions = options.filter((_, i) => i !== index);
    onChange(id, 'options', updatedOptions); // Update state after removing option
  };

  return (
    <Container>
      <div>
        <Label>Question Text:</Label>
        <Input
          name="questionText"
          placeholder="Enter question"
          value={questionText}
          onChange={(e:any) => onChange(id, 'questionText', e.target.value)}
        />
        <ErrorMessage name="questionText" component="div" className="error" />
      </div>

      <div>
        <Label>Max Selections:</Label>
        <Input
          type="number"
          name="maxSelections"
          value={maxSelections}
          onChange={(e:any) => onChange(id, 'maxSelections', e.target.value)}
        />
        <ErrorMessage name="maxSelections" component="div" className="error" />
      </div>

      {/* FieldArray to handle dynamic option management */}
      <FieldArray
        name="options"
        render={(arrayHelpers) => (
          <div>
            {options.map((option, index) => (
              <div key={option.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Input
                  name={`options[${index}].text`}
                  placeholder="Enter option"
                  value={option.text}
                  onChange={(e:any) => handleOptionChange(index, e.target.value)}
                />
                <Button type="button" onClick={() => handleRemoveOption(index)}>Remove</Button>
              </div>
            ))}
            {/* Button to add new options */}
            <Button
              type="button"
              onClick={() => {
                const newOption = { id: Date.now().toString(), text: '' };
                arrayHelpers.push(newOption);
                onChange(id, 'options', [...options, newOption]); // Update state with new option
              }}
            >
              Add Option
            </Button>
          </div>
        )}
      />
    </Container>
  );
};

export default MultipleChoiceQuestion;
