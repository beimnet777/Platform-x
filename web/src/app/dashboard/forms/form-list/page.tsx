"use client";

import React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  setCurrentQuestionIndex,
  setSurveyIsOpen,
  setSurveyTitle,
  setSurveyDescription,
  addQuestion,
} from "../../../../store/surveySlice";
import { fetcher } from "@/utils/axios";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";

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
        { id: 10, questionType: 'ShortAnswer', questionText: 'What is your name?', inputType: 'text', maxLength: 50 },
        { id: 11, questionType: 'multiple_choice', questionText: 'Choose your favorite color:', options: ['Red', 'Blue', 'Green'], maxSelections: 1 },
        { id: 12, questionType: 'audio', questionText: 'Please record a brief introduction.', maxSize: 10, maxDuration: 60 },
      ],
    },
    // Additional forms...
  ],
};

const FormList: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, error } = useSWR('http://localhost:3000/api/v1/orgAdmin/get-forms', fetcher, { fallbackData });

  const forms = data?.forms || fallbackData.forms;

  const handleEditSurvey = (form: any) => {
    dispatch(setSurveyTitle(form.formName));
    dispatch(setSurveyDescription(form.formDescription));
    dispatch(setSurveyIsOpen(form.isOpen));

    form.questions.forEach((question: any) => {
      dispatch(addQuestion(question));
    });

    dispatch(setCurrentQuestionIndex(0));
    router.push(`/dashboard/forms/create-form?isEditMode=true`);
  };

  const handleViewResponses = (formId: number, form:any) => {
    dispatch(setSurveyTitle(form.formName));
    dispatch(setSurveyDescription(form.formDescription));
    dispatch(setSurveyIsOpen(form.isOpen));

    form.questions.forEach((question: any) => {
      dispatch(addQuestion(question));
    });

    dispatch(setCurrentQuestionIndex(0));
    form.questions.forEach((question: any) => {
      dispatch(addQuestion(question));
    });
    router.push(`/dashboard/forms/responses?formId=${formId}`);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Form List"} />
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {forms.map((form: any) => (
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
                <div className="flex flex-row sm:flex-row justify-between">
                <button
                  onClick={() => handleEditSurvey(form)}
                  className="bg-primary text-white px-4 py-2 rounded-md mt-4 flex items-center"
                >
                  Edit Form
                </button>
                <button
                  onClick={() => handleViewResponses(form.id,form)}
                  className="bg-secondary text-white px-4 py-2 rounded-md mt-4 flex items-center"
                >
                  View Responses
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FormList;
