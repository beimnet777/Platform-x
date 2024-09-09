"use client";

import React from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  setCurrentQuestionIndex,
  setSurveyIsOpen,
  setSurveyTitle,
  setSurveyDescription,
  addQuestion,
} from '../../../store/surveySlice';
import { fetcher } from '@/utils/axios';
import DefaultLayout from '@/components/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/components/Breadcrumbs/Breadcrumb';



const fallbackData = {
  totalForms: 2,
  forms: [
    {
      id: 1,
      organizationId: 1,
      formName: "Sample Form 1",
      formDescription: "This is a sample form for testing.",
      isOpen: true,
      numberOfQuestion: 3,
      totalResponse: 5,
      currentResponse: 3,
      minAgentAge: 18,
      maxAgentAge: 60,
      agentGender: ["Male", "Female"],
      createdAt: "2024-09-06T09:46:28.170Z",
      updatedAt: "2024-09-06T09:46:28.171Z",
      questions: [
        { id: 'q1', questionType: 'short_answer', questionText: 'What is your name?', inputType: 'text', maxLength: 50 },
        { id: 'q2', questionType: 'multiple_choice', questionText: 'Choose your favorite color:', options: ['Red', 'Blue', 'Green'], maxSelections: 1 },
        { id: 'q3', questionType: 'audio', questionText: 'Please record a brief introduction.', maxSize: 10, maxDuration: 60 },
      ],
    },
    {
      id: 2,
      organizationId: 1,
      formName: "Sample Form 2",
      formDescription: "Another sample form for testing.",
      isOpen: false,
      numberOfQuestion: 3,
      totalResponse: 8,
      currentResponse: 4,
      minAgentAge: 21,
      maxAgentAge: 50,
      agentGender: ["Female"],
      createdAt: "2024-09-06T15:07:56.248Z",
      updatedAt: "2024-09-06T15:07:56.250Z",
      questions: [
        { id: 'q1', questionType: 'short_answer', questionText: 'What is your favorite hobby?', inputType: 'text', maxLength: 100 },
        { id: 'q2', questionType: 'multiple_choice', questionText: 'Select your preferred work environment:', options: ['Office', 'Remote', 'Hybrid'], maxSelections: 1 },
        { id: 'q3', questionType: 'audio', questionText: 'Describe your ideal day.', maxSize: 15, maxDuration: 90 },
      ],
    },
  ],
};

const FormList: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, error } = useSWR('http://localhost:3000/api/v1/orgAdmin/get-forms', fetcher, { fallbackData });

  const forms = data?.forms || fallbackData.forms;

  const handleEditSurvey = (form: any) => {
    // Set survey details in Redux store for editing
    dispatch(setSurveyTitle(form.formName));
    dispatch(setSurveyDescription(form.formDescription));
    dispatch(setSurveyIsOpen(form.isOpen));

    // Add the questions for the form
    form.questions.forEach((question: any) => {
      dispatch(addQuestion(question));
    });

    dispatch(setCurrentQuestionIndex(0)); // Set to the first question
    router.push(`/forms/create-form?isEditMode=true`); 
  };

 
  if (!data) return <div>Loading...</div>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Form List"} />
    <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {forms.map((form:any) => (
          <div
            key={form.id}
            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">{form.formName}</h3>
            </div>
            <div className="p-7">
              <p className="text-sm font-medium text-black dark:text-white mb-2">
                Description: {form.formDescription}
              </p>
              <p className="text-sm font-medium text-black dark:text-white mb-2">
                Number of Questions: {form.numberOfQuestion}
              </p>
              <p className="text-sm font-medium text-black dark:text-white mb-2">
                Responses: {form.currentResponse}/{form.totalResponse}
              </p>
              <p className="text-sm font-medium text-black dark:text-white mb-2">
                Agent Age Range: {form.minAgentAge} - {form.maxAgentAge}
              </p>
              <p className="text-sm font-medium text-black dark:text-white mb-4">
                Agent Gender: {form.agentGender.join(', ')}
              </p>
              <button
                onClick={() => handleEditSurvey(form)}
                className="bg-primary text-white px-4 py-2 rounded-md mt-4 flex items-center "
              >
                Edit Form
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </DefaultLayout>
  );
};

export default FormList;
