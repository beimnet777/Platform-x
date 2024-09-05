// src/components/ShortAnswerQuestion.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import styled from '@emotion/styled';
import { QuestionProps } from '../type';
import { Container, Input, Label, Select } from './styles';



const ShortAnswerQuestion: React.FC<QuestionProps & { inputType: 'text' | 'number'; maxLength: number }> = ({
  id,
  questionText,
  onChange,
  inputType,
  maxLength,
}) => {
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
        <Label>Input Type:</Label>
        <Select name="inputType" value={inputType} onChange={(e) => onChange(id, 'inputType', e.target.value)}>
          <option value="text">Text</option>
          <option value="number">Number</option>
        </Select>
      </div>

      <div>
        <Label>Max Length:</Label>
        <Input
          type="number"
          name="maxLength"
          value={maxLength}
          onChange={(e:any) => onChange(id, 'maxLength', e.target.value)}
        />
        <ErrorMessage name="maxLength" component="div" className="error" />
      </div>
    </Container>
  );
};

export default ShortAnswerQuestion;
