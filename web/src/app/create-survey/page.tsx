"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Field, Form } from 'formik';
import {
  addQuestion,
  replaceQuestion,
  deleteQuestion,
  setCurrentQuestionIndex,
  setSurveyTitle,
  setSurveyDescription,
  setSurveyIsOpen,
  setSurveyMinAge,
  setSurveyMaxAgents,
  setSurveyGender,
  ShortAnswerQuestionType,
  MultipleChoiceQuestionType,
  AudioQuestionType,
  AgentGender,
} from '../../store/surveySlice';
import { RootState } from '../../store/store';
import { ShortAnswerQuestion, MultipleChoiceQuestion, AudioQuestion } from '@/components';
import {
  Button,
  Container,
  FormField,
  MainContent,
  QuestionButton,
  QuestionNavigation,
  QuestionNumber,
  SaveButton,
  Sidebar,
  SidebarButton,
} from './styles';
import styled from '@emotion/styled';

// Enhanced styling for the new fields
const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
`;

const SurveyOptionsField = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;

  label {
    font-weight: 600;
    margin-right: 10px;
  }

  input,
  select {
    padding: 8px;
    width: 200px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
`;

const CreateSurvey: React.FC = () => {
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex, title, description, isOpen, minAgentAge, maxAgents, agentGender } =
    useSelector((state: RootState) => state.survey);

  const handleAddQuestion = () => {
    const newQuestion: ShortAnswerQuestionType = {
      id: Date.now().toString(),
      questionType: 'short_answer',
      questionText: '',
      inputType: 'text',
      maxLength: 100,
    };
    dispatch(addQuestion(newQuestion));
    dispatch(setCurrentQuestionIndex(questions.length));
  };

  const handleFieldChange = (id: string, name: string, value: any) => {
    const updatedQuestion = { ...questions[currentQuestionIndex], [name]: value };
    dispatch(replaceQuestion({ index: currentQuestionIndex, question: updatedQuestion }));
  };

  const renderCurrentQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    switch (question.questionType) {
      case 'short_answer':
        return (
          <ShortAnswerQuestion
            id={question.id}
            questionText={question.questionText}
            onChange={handleFieldChange}
            inputType={question.inputType}
            maxLength={question.maxLength}
          />
        );
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            id={question.id}
            questionText={question.questionText}
            onChange={handleFieldChange}
            options={question.options}
            maxSelections={question.maxSelections}
          />
        );
      case 'audio':
        return (
          <AudioQuestion
            id={question.id}
            questionText={question.questionText}
            onChange={handleFieldChange}
            maxSize={question.maxSize}
            maxDuration={question.maxDuration}
          />
        );
      default:
        return null;
    }
  };

  const handleSave = (values: any) => {
    const surveyData = {
      title: values.title,
      description: values.description,
      isOpen: values.is_open,
      minAgentAge: values.min_agent_age,
      maxAgents: values.max_agent_int,
      agentGender: values.agent_gender,
      questions,
    };
    console.log(surveyData);
  };

  return (
    <Container>
      <Sidebar>
        <h3>Question Types</h3>
        <SidebarButton
          onClick={() =>
            dispatch(
              replaceQuestion({
                index: currentQuestionIndex,
                question: {
                  ...questions[currentQuestionIndex],
                  questionType: 'short_answer',
                  inputType: 'text',
                  maxLength: 100,
                } as ShortAnswerQuestionType
              })
            )
          }
        >
          Short Answer
        </SidebarButton>
        <SidebarButton
          onClick={() =>
            dispatch(
              replaceQuestion({
                index: currentQuestionIndex,
                question: {
                  ...questions[currentQuestionIndex],
                  questionType: 'multiple_choice',
                  options: [],
                  maxSelections: 1,
                } as MultipleChoiceQuestionType
              })
            )
          }
        >
          Multiple Choice
        </SidebarButton>
        <SidebarButton
          onClick={() =>
            dispatch(
              replaceQuestion({
                index: currentQuestionIndex,
                question: {
                  ...questions[currentQuestionIndex],
                  questionType: 'audio',
                  maxSize: 10,
                  maxDuration: 60,
                } as AudioQuestionType
              })
            )
          }
        >
          Audio
        </SidebarButton>
      </Sidebar>

      <MainContent>
        <h1 className="text-4xl font-bold">Create Survey</h1>
        <Formik
          initialValues={{
            title,
            description,
            is_open: isOpen,
            min_agent_age: minAgentAge,
            max_agent_int: maxAgents,
            agent_gender: agentGender,
          }}
          onSubmit={handleSave}
        >
          {({ handleChange, values }) => (
            <Form>
              {/* Survey Details Section */}
              <Section>
                <SectionTitle>Survey Details</SectionTitle>
                <FormField>
                  <label>Survey Title:</label>
                  <Field
                    name="title"
                    placeholder="Enter title"
                    value={values.title}
                    onChange={(e: any) => {
                      handleChange(e);
                      dispatch(setSurveyTitle(e.target.value));
                    }}
                    style={{ marginLeft: '10px', padding: '8px', width: '300px' }}
                  />
                </FormField>
                <FormField>
                  <label>Survey Description:</label>
                  <Field
                    name="description"
                    placeholder="Enter description"
                    value={values.description}
                    onChange={(e: any) => {
                      handleChange(e);
                      dispatch(setSurveyDescription(e.target.value));
                    }}
                    style={{ marginLeft: '10px', padding: '8px', width: '300px' }}
                  />
                </FormField>
              </Section>

              {/* Agent Criteria Section */}
              <Section>
                <SectionTitle>Agent Criteria</SectionTitle>
                <SurveyOptionsField>
                  <label>Is Open:</label>
                  <Field
                    name="is_open"
                    type="checkbox"
                    checked={values.is_open}
                    onChange={(e: any) => {
                      handleChange(e);
                      dispatch(setSurveyIsOpen(e.target.checked));
                    }}
                  />
                </SurveyOptionsField>
                <SurveyOptionsField>
                  <label>Minimum Agent Age:</label>
                  <Field
                    name="min_agent_age"
                    type="number"
                    min="0"
                    value={values.min_agent_age}
                    onChange={(e: any) => {
                      handleChange(e);
                      dispatch(setSurveyMinAge(Number(e.target.value)));
                    }}
                  />
                </SurveyOptionsField>
                <SurveyOptionsField>
                  <label>Max Agents:</label>
                  <Field
                    name="max_agent_int"
                    type="number"
                    min="1"
                    value={values.max_agent_int}
                    onChange={(e: any) => {
                      handleChange(e);
                      dispatch(setSurveyMaxAgents(Number(e.target.value)));
                    }}
                  />
                </SurveyOptionsField>
                <SurveyOptionsField>
                  <label>Agent Gender:</label>
                  <Field
                    as="select"
                    name="agentGender"
                    value={agentGender}
                    onChange={(e: any) => dispatch(setSurveyGender(e.target.value as AgentGender))}
                    style={{ marginLeft: '10px', padding: '8px', width: '300px' }}
                  >
                    <option value={AgentGender.MALE}>Male</option>
                    <option value={AgentGender.FEMALE}>Female</option>
                    <option value={AgentGender.BOTH}>Both</option>
                  </Field>
                </SurveyOptionsField>
              </Section>

              {/* Display Current Question Number */}
              <QuestionNumber>Question {currentQuestionIndex + 1}</QuestionNumber>

              <QuestionNavigation>
                <div>
                  <QuestionButton
                    onClick={() => dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </QuestionButton>
                  <QuestionButton
                    onClick={() => dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === questions.length - 1 || questions.length === 0}
                  >
                    Next
                  </QuestionButton>
                </div>
                <SaveButton type="submit">Save Survey</SaveButton>
              </QuestionNavigation>

              {renderCurrentQuestion()}

              <Button type="button" onClick={handleAddQuestion}>
                Add Question
              </Button>
              <Button type="button" onClick={() => dispatch(deleteQuestion(currentQuestionIndex))}>
                Remove Question
              </Button>
            </Form>
          )}
        </Formik>
      </MainContent>
    </Container>
  );
};

export default CreateSurvey;
