"use client";

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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
  setSurveyMaxAge,
  setSurveyEstimatedTime,
  setSurveyReward,
  setSurveyTags,
} from '../../../../store/surveySlice';
import { RootState } from '../../../../store/store';
import ShortAnswerQuestion from '@/components/Form/ShortAnswerQuestion';
import MultipleChoiceQuestion from '@/components/Form/MultipleChoiceQuestion';
import AudioQuestion from '@/components/Form/AudioQuestion';
import Breadcrumb from '@/components/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/components/Layouts/DefaultLayout';
import SwitcherOne from '@/components/components/Switchers/SwitcherOne';
import { useRouter, useSearchParams } from 'next/navigation';
import { createForm, updateForm } from '@/api/forms';
import Loader from '@/components/components/common/Loader';

const SearchParamsWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('isEditMode') === 'true';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isEditMode) {
      dispatch(resetSurvey());
    }
    setLoading(false); 
  }, [isEditMode]);

  if (loading) {
    return <Loader />;
  }

  return <Breadcrumb pageName={isEditMode ? "Edit Form" : "Create Form"} />;
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Form title is required'),
  description: Yup.string().required('Form description is required'),
  estimated_time: Yup.number().min(1, 'Estimated time must be at least 1 minute').required('Estimated time is required'),
  tags: Yup.array(),
  reward: Yup.number().min(0, 'Reward must be at least 0').required('Reward is required'),
  min_agent_age: Yup.number()
    .min(18, 'Minimum age must be at least 18')
    .required('Minimum age is required'),
  max_agent_age: Yup.number()
    .min(Yup.ref('min_agent_age'), 'Maximum age must be greater than or equal to minimum age')
    .required('Maximum age is required'),
  max_agent_int: Yup.number()
    .min(1, 'Max agents must be at least 1')
    .required('Max agents is required'),
});

const CreateSurvey: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [tagsList, setTags] = useState<string[]>([]); // State for tags input

  const { formId, questions, currentQuestionIndex, title, description, isOpen, minAgentAge, maxAgentAge, maxAgents, agentGender, reward, estimatedTime, tags } =
    useSelector((state: RootState) => state.survey);

  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('isEditMode') === 'true';

  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    estimated_time: 10,
    tags: [] as string[],
    reward: 0,
    is_open: false,
    min_agent_age: 18,
    max_agent_age: 18,
    max_agent_int: 100,
    agent_gender: AgentGender.BOTH,
  });

  useEffect(() => {
    if (!isEditMode) {
      setInitialValues({
        title: '',
        description: '',
        estimated_time: 10,
        tags: [],
        reward: 0,
        is_open: false,
        min_agent_age: 18,
        max_agent_age: 18,
        max_agent_int: 100,
        agent_gender: AgentGender.BOTH,
      });
    } else {
      setInitialValues({
        title,
        description,
        estimated_time: estimatedTime, 
        tags, 
        reward: reward, 
        is_open: isOpen,
        min_agent_age: minAgentAge,
        max_agent_age: maxAgentAge,
        max_agent_int: maxAgents,
        agent_gender: agentGender,
      });
      console.log(initialValues,"init")
    }
  }, [isEditMode, title, description, isOpen, minAgentAge, maxAgentAge, maxAgents, agentGender, tags]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default form submission behavior
      const newTag = e.currentTarget.value.trim();
      if (newTag && !tagsList.includes(newTag)) {
        setTags([...tagsList, newTag]);
        dispatch(setSurveyTags([...tagsList, newTag]));
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tagsList.filter(t => t !== tag);
    setTags(newTags);
    dispatch(setSurveyTags(newTags));
  };

  if (loading) {
    return (
      <DefaultLayout>
        <Loader />
      </DefaultLayout>
    );
  }

  const handleAddQuestion = () => {
    setQuestionError(null); // Reset question error when adding a question
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

  const handleSave = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    console.log(values);
    setQuestionError(null); 
    if (questions.length === 0) {
      setQuestionError('Please add at least one question.');
      setSubmitting(false);
      return;
    }

    const formattedQuestions = questions.map((question: any) => ({
      questionTitle: question.questionText,
      questionDescription: question.inputType === 'number' ? 'Please enter a number.' : `Please provide your ${question.inputType}.`,
      questionType: question.questionType,
    }));

    const surveyData = {
      formName: values.title,
      formDescription: values.description,
      estimatedTime: values.estimated_time,
      reward: values.reward,
      tags: tagsList,
      numberOfQuestion: questions.length,
      totalResponse: values.max_agent_int,
      isOpen: isOpen,
      minAgentAge: values.min_agent_age,
      maxAgentAge: values.max_agent_age,
      maxAgents: values.max_agent_int,
      agentGender: values.agent_gender === 'Both' ? ['Male', 'Female'] : [values.agent_gender],
      questions: formattedQuestions,
    };

    try {
      dispatch(resetSurvey());
      if (isEditMode) {
        await updateForm(formId, surveyData);
      } else {
        await createForm(surveyData);
      }
      router.push('/dashboard/forms/form-list');
    } catch (error) {
      console.error('Error creating form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleIsOpenChange = (isOpen: boolean) => {
    dispatch(setSurveyIsOpen(isOpen));
  };

  return (
    <DefaultLayout>
      <Suspense fallback={<Loader />}>
        <SearchParamsWrapper />
      </Suspense>
      <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ handleChange, values, errors, touched, isSubmitting }) => (
            <Form>
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
                      className={`w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-primary ${errors.title && touched.title ? 'border-red-500' : 'border-stroke'} dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
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
                      className={`w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-primary ${errors.description && touched.description ? 'border-red-500' : 'border-stroke'} dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">Estimated Time (minutes)</label>
                    <Field
                      name="estimated_time"
                      type="number"
                      min="1"
                      value={values.estimated_time}
                      onChange={(e: any) => {
                        handleChange(e);
                        dispatch(setSurveyEstimatedTime(Number(e.target.value)));
                      }}
                      className={`w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-primary ${errors.estimated_time && touched.estimated_time ? 'border-red-500' : 'border-stroke'} dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                    />
                    <ErrorMessage name="estimated_time" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tagsList.map(tag => (
                        <div key={tag} className="flex items-center bg-gray-200  rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-red-500">x</button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a tag"
                      onKeyDown={handleAddTag}
                      className="w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">Reward(in Birr)</label>
                    <Field
                      name="reward"
                      type="number"
                      min="0"
                      value={values.reward}
                      onChange={(e: any) => {
                        handleChange(e);
                        dispatch(setSurveyReward(Number(e.target.value)));
                      }}
                      className={`w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-primary ${errors.reward && touched.reward ? 'border-red-500' : 'border-stroke'} dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                    />
                    <ErrorMessage name="reward" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Agent Criteria Section */}
                <div>
                  <h2 className="text-xl font-extrabold mb-2">Agent Criteria</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">Is Open </label>
                      <SwitcherOne isOpen={isOpen} onToggle={handleIsOpenChange} />
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
                        className={`w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-primary ${errors.min_agent_age && touched.min_agent_age ? 'border-red-500' : 'border-stroke'} dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                      />
                      <ErrorMessage name="min_agent_age" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">Maximum Agent Age </label>
                      <Field
                        name="max_agent_age"
                        type="number"
                        min="0"
                        value={values.max_agent_age}
                        onChange={(e: any) => {
                          handleChange(e);
                          dispatch(setSurveyMaxAge(Number(e.target.value)));
                        }}
                        className={`w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-primary ${errors.max_agent_age && touched.max_agent_age ? 'border-red-500' : 'border-stroke'} dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                      />
                      <ErrorMessage name="max_agent_age" component="div" className="text-red-500 text-sm mt-1" />
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
                        className={`w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-primary ${errors.max_agent_int && touched.max_agent_int ? 'border-red-500' : 'border-stroke'} dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                      />
                      <ErrorMessage name="max_agent_int" component="div" className="text-red-500 text-sm mt-1" />
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
                        className="bg-primary text-white px-4 py-2 rounded-md mr-2"
                        hidden= {currentQuestionIndex <= 0}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1))}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="bg-secondary text-white px-4 py-2 rounded-md"
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
                {questionError && <div className="text-red-500 text-sm mt-2">{questionError}</div>} {/* Display question error */}
              </div>

              {/* Navigation and Actions */}
              
              {/* Save Survey Button */}
              <div className="flex justify-end mt-6">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md" disabled={isSubmitting}>
                { isSubmitting &&        <svg  aria-hidden="true" role="status" className="inline w-6 h-6 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
</svg> } Save Survey
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

const SurveyCreateEdit: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <CreateSurvey />
    </Suspense>
  );
};

export default SurveyCreateEdit;
