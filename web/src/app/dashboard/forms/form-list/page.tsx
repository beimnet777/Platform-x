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
  setSurveyMinAge,
  setSurveyMaxAgents,
  resetSurvey,
  setSurveyMaxAge,
  setFormId,
} from "../../../../store/surveySlice";
import { fetcher } from "@/utils/axios";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";
import { fetchFormQuestions } from "@/api/forms";
import Loader from "@/components/components/common/Loader";



const FormList: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error } = useSWR('/api/v1/orgAdmin/get-forms', fetcher);

  // Show loader while fetching data
  if (!data && !error) return <DefaultLayout>
      <Breadcrumb pageName={"Form List"} /> <Loader /> </DefaultLayout>;

  // Handle errors if any
  if (error) return <div>Error loading forms. Please try again later.</div>;

  const forms = data?.forms || [];

  const handleEditSurvey = async (formId: number, form: any) => {
    try {
      dispatch(resetSurvey())
      const formQuestionsData = await fetchFormQuestions(formId);
      const questions = formQuestionsData;
  
      // Format the questions as needed
      const formattedQuestions = questions.map((question: any) => ({
        questionText: question.questionTitle,
        questionDescription: 'text',
        questionType: question.questionType,
        maxSize: 10,
        maxDuration: 60,
        maxLength: 100
      }));
      console.log(questions,formattedQuestions, "tex" )
  
      // Set the survey data in the Redux store
      dispatch(setFormId(formId))
      dispatch(setSurveyTitle(form.formName));
      dispatch(setSurveyDescription(form.formDescription));
      dispatch(setSurveyIsOpen(form.isOpen));
      dispatch(setSurveyMinAge(form.minAgentAge))
      dispatch(setSurveyMaxAgents(form.totalResponse))
      dispatch(setSurveyMaxAge(form.maxAgentAge))
      formattedQuestions.forEach((question: any) => {
        dispatch(addQuestion(question));
      });
      dispatch(setCurrentQuestionIndex(0));
  
      // Redirect to the responses page
      router.push(`/dashboard/forms/create-form?isEditMode=true`);

    } catch (error) {
      console.error("Error viewing responses:", error);
    }
  };
  

  const handleViewResponses = async (formId: number, form: any) => {
    try {
      dispatch(resetSurvey())
      const formQuestionsData = await fetchFormQuestions(formId);
      const questions = formQuestionsData;

      // Dispatch form details to Redux store
      dispatch(setSurveyTitle(form.formName));
      dispatch(setSurveyDescription(form.formDescription));
      dispatch(setSurveyIsOpen(form.isOpen));
      dispatch(setSurveyMinAge(form.minAgentAge))
      dispatch(setSurveyMaxAge(form.maxAgentAge))
      dispatch(setSurveyMaxAgents(form.totalResponse))

       // Format the questions as needed
       const formattedQuestions = questions.map((question: any) => ({
        questionText: question.questionTitle,
        questionDescription: 'text',
        questionType: question.questionType,
        maxSize: 10,
        maxDuration: 60,
        maxLength: 100,

      }));

      formattedQuestions.forEach((question: any) => {
        dispatch(addQuestion(question));
      });

      // Format and dispatch each question
    

      dispatch(setCurrentQuestionIndex(0));

      // Redirect to the responses page
      router.push(`/dashboard/forms/responses?formId=${formId}`);
    } catch (error) {
      console.error("Error viewing responses:", error);
    }
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
                  onClick={() => handleEditSurvey(form.id,form)}
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
