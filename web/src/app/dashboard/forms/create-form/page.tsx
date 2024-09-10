"use client";

import React, { Suspense, useEffect } from 'react';
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
  resetSurvey,
} from '../../../../store/surveySlice';
import { RootState } from '../../../../store/store';
import ShortAnswerQuestion from '@/components/Form/ShortAnswerQuestion';
import MultipleChoiceQuestion from '@/components/Form/MultipleChoiceQuestion';
import AudioQuestion from '@/components/Form/AudioQuestion';
import Breadcrumb from '@/components/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/components/Layouts/DefaultLayout';
import SwitcherOne from '@/components/components/Switchers/SwitcherOne';
import { useRouter, useSearchParams } from 'next/navigation';
import { createForm } from '@/api/forms';
import Loader from '@/components/components/common/Loader';

const SearchParamsWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('isEditMode') === 'true';

  useEffect(() => {
    if (!isEditMode) {
      dispatch(resetSurvey());
    }
  }, [isEditMode]);

  return   <Breadcrumb pageName={isEditMode ? "Edit Survey" : "Create Survey"} />;
};

const CreateSurvey:  React.FC = ()  => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  


 

  
  const { questions, currentQuestionIndex, title, description, isOpen, minAgentAge, maxAgents, agentGender } =
    useSelector((state: RootState) => state.survey);
  const handleAddQuestion = () => {
    const newQuestion: ShortAnswerQuestionType = {
      id: Date.now().toString(),
      questionType: 'ShortAnswer',
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

  const handleQuestionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    let updatedQuestion;

    switch (selectedType) {
      case 'ShortAnswer':
        updatedQuestion = {
          ...questions[currentQuestionIndex],
          questionType: 'ShortAnswer',
          inputType: 'text',
          maxLength: 100,
        } as ShortAnswerQuestionType;
        break;
      case 'multiple_choice':
        updatedQuestion = {
          ...questions[currentQuestionIndex],
          questionType: 'multiple_choice',
          options: [],
          maxSelections: 1,
        } as MultipleChoiceQuestionType;
        break;
      case 'Audio':
        updatedQuestion = {
          ...questions[currentQuestionIndex],
          questionType: 'Audio',
          maxSize: 10,
          maxDuration: 60,
        } as AudioQuestionType;
        break;
      default:
        return;
    }

    dispatch(replaceQuestion({ index: currentQuestionIndex, question: updatedQuestion }));
  };

  const renderCurrentQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    switch (question.questionType) {
      case 'ShortAnswer':
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
      case 'Audio':
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

  

  const handleSave = async (values: any) => {
    const formattedQuestions = questions.map((question: any) => ({
      questionTitle: question.questionText,
      questionDescription: question.inputType === "number"
        ? "Please enter a number."
        : `Please provide your ${question.inputType}.`,
      questionType: question.questionType,
    }));
  
    const surveyData = {
      formName: values.title,
      formDescription: values.description,
      numberOfQuestion: questions.length,
      totalResponse: values.max_agent_int,
      isOpen: values.is_open,
      minAgentAge: values.min_agent_age,
      maxAgentAge: values.min_agent_age + 30,
      maxAgents: values.max_agent_int,
      agentGender: values.agent_gender === "Both" ? ["Male", "Female"] : [values.agent_gender],
      questions: formattedQuestions,
    };
  
    console.log(surveyData); // For debugging
  
    try {
      const response = await createForm(surveyData);
      console.log("Form created successfully:", response);
      router.push('/dashboard/forms/form-list'); // Redirect to form list page
    } catch (error) {
      console.error("Error creating form:", error);
      // Handle error, show error message to the user
    }
  };

  return (
    <DefaultLayout>
    

      <Suspense fallback={<Loader />}>
        <SearchParamsWrapper />
      </Suspense>

      <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
       
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold mb-2">Form Details</h2>
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">Form Title </label>
                    <Field
                      name="title"
                      placeholder="Enter title"
                      value={values.title}
                      onChange={(e: any) => {
                        handleChange(e);
                        dispatch(setSurveyTitle(e.target.value));
                      }}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">Form Description </label>
                    <Field
                      name="description"
                      placeholder="Enter description"
                      value={values.description}
                      onChange={(e: any) => {
                        handleChange(e);
                        dispatch(setSurveyDescription(e.target.value));
                      }}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                </div>

                {/* Agent Criteria Section */}
                <div>
                  <h2 className="text-xl font-extrabold mb-2">Agent Criteria</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">Is Open </label>
                      <SwitcherOne />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">Minimum Agent Age </label>
                      <Field
                        name="min_agent_age"
                        type="number"
                        min="0"
                        value={values.min_agent_age}
                        onChange={(e: any) => {
                          handleChange(e);
                          dispatch(setSurveyMinAge(Number(e.target.value)));
                        }}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">Max Agents </label>
                      <Field
                        name="max_agent_int"
                        type="number"
                        min="1"
                        value={values.max_agent_int}
                        onChange={(e: any) => {
                          handleChange(e);
                          dispatch(setSurveyMaxAgents(Number(e.target.value)));
                        }}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">Agent Gender </label>
                      <Field
                        as="select"
                        name="agentGender"
                        value={agentGender}
                        onChange={(e: any) => dispatch(setSurveyGender(e.target.value as AgentGender))}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      >
                        <option value={AgentGender.MALE}>Male</option>
                        <option value={AgentGender.FEMALE}>Female</option>
                        <option value={AgentGender.BOTH}>Both</option>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Type Dropdown */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Select Question Type</h2>
                <select
                  onChange={handleQuestionTypeChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="ShortAnswer">Short Answer</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>
              

              {/* Display Current Question */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2" hidden={currentQuestionIndex <= 0}>Question {currentQuestionIndex+1}</h2>
                {renderCurrentQuestion()}
                <div className="flex justify-end items-center mb-6">
                <div>
                  {questions.length > 1 && (
                    <div className="my-1">
                      <button
                        type="button"
                        onClick={() => dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="bg-meta-3 text-white px-4 py-2 rounded-md mr-2"
                        hidden= {currentQuestionIndex <= 0}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1))}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="bg-black text-white px-4 py-2 rounded-md"
                        hidden={currentQuestionIndex === questions.length - 1}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="rounded-full border border-primary text-primary  px-4 py-2 mt-4 flex items-center"
                >
                 
                
                Add Question 
                </button>
              </div>

              {/* Navigation and Actions */}
              

              {/* Save Survey Button */}
              <div className="flex justify-end mt-6">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Save Survey
                </button>
              </div>

              {/* Remove Question */}
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => dispatch(deleteQuestion(currentQuestionIndex))}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Remove Question
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default CreateSurvey;
