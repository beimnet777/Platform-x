// src/components/AudioQuestion.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import styled from '@emotion/styled';
import { QuestionProps } from '../type';
import { Container, Input, Label } from './styles';


const AudioQuestion: React.FC<QuestionProps & { maxSize: number; maxDuration: number }> = ({ id, questionText, onChange, maxSize, maxDuration }) => {
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
        <Label>Max Size (MB):</Label>
        <Input
          type="number"
          name="maxSize"
          value={maxSize}
          onChange={(e:any) => onChange(id, 'maxSize', e.target.value)}
        />
        <ErrorMessage name="maxSize" component="div" className="error" />
      </div>

      <div>
        <Label>Max Duration (seconds):</Label>
        <Input
          type="number"
          name="maxDuration"
          value={maxDuration}
          onChange={(e:any) => onChange(id, 'maxDuration', e.target.value)}
        />
        <ErrorMessage name="maxDuration" component="div" className="error" />
      </div>
    </Container>
  );
};

export default AudioQuestion;
