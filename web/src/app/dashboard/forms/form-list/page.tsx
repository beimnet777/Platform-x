"use client";

import React, { useState } from "react";
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
  setSurveyEstimatedTime,
  setSurveyReward,
  setSurveyTags,
} from "../../../../store/surveySlice";
import { fetcher } from "@/utils/axios";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";
import { fetchFormQuestions } from "@/api/forms";
import Loader from "@/components/components/common/Loader";

const FormList: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error } = useSWR("/api/v1/orgAdmin/get-forms", fetcher);
  const [loadingEdit, setLoadingEdit] = useState<number | null>(null); // State for loading Edit Form
  const [loadingView, setLoadingView] = useState<number | null>(null); // State for loading View Responses

  // Show loader while fetching data
  if (!data && !error)
    return (
      <DefaultLayout>
        <Breadcrumb pageName={"Form List"} /> <Loader />
      </DefaultLayout>
    );

  // Handle errors if any
  if (error)
    return <DefaultLayout>Error loading forms. Please try again later.</DefaultLayout>;

  const forms = data?.forms || [];

  const handleEditSurvey = async (formId: number, form: any) => {
    setLoadingEdit(formId); // Start loading for Edit Form
    try {
      dispatch(resetSurvey());
      const formQuestionsData = await fetchFormQuestions(formId);
      const questions = formQuestionsData;

      // Format the questions as needed
      const formattedQuestions = questions.map((question: any) => ({
        id: question.id,
        questionText: question.questionTitle,
        questionDescription: "text",
        questionType: question.questionType,
        maxSize: 10,
        maxDuration: 60,
        maxLength: 100,
      }));

      // Set the survey data in the Redux store
      dispatch(setFormId(formId));
      dispatch(setSurveyTitle(form.formName));
      dispatch(setSurveyDescription(form.formDescription));
      dispatch(setSurveyIsOpen(form.isOpen));
      dispatch(setSurveyMinAge(form.minAgentAge));
      dispatch(setSurveyMaxAgents(form.totalResponse));
      dispatch(setSurveyMaxAge(form.maxAgentAge));
      dispatch(setSurveyEstimatedTime(form.estimatedTime));
      dispatch(setSurveyReward(form.reward));
      dispatch(setSurveyTags(form.tags));
      formattedQuestions.forEach((question: any) => {
        dispatch(addQuestion(question));
      });
      dispatch(setCurrentQuestionIndex(0));

      // Redirect to the responses page
      router.push(`/dashboard/forms/create-form?isEditMode=true`);
    } catch (error) {
      console.error("Error viewing responses:", error);
    } finally {
      setLoadingEdit(null); // Stop loading for Edit Form
    }
  };

  const handleViewResponses = async (formId: number, form: any) => {
    setLoadingView(formId); // Start loading for View Responses
    try {
      dispatch(resetSurvey());
      const formQuestionsData = await fetchFormQuestions(formId);
      const questions = formQuestionsData;

      // Dispatch form details to Redux store
      dispatch(setSurveyTitle(form.formName));
      dispatch(setSurveyDescription(form.formDescription));
      dispatch(setSurveyIsOpen(form.isOpen));
      dispatch(setSurveyMinAge(form.minAgentAge));
      dispatch(setSurveyMaxAge(form.maxAgentAge));
      dispatch(setSurveyMaxAgents(form.totalResponse));
      dispatch(setSurveyEstimatedTime(form.estimatedTime));
      dispatch(setSurveyReward(form.reward));
      dispatch(setSurveyTags(form.tags));

      // Format the questions as needed
      const formattedQuestions = questions.map((question: any) => ({
        questionText: question.questionTitle,
        questionDescription: "text",
        questionType: question.questionType,
        maxSize: 10,
        maxDuration: 60,
        maxLength: 100,
      }));

      formattedQuestions.forEach((question: any) => {
        dispatch(addQuestion(question));
      });

      dispatch(setCurrentQuestionIndex(0));

      // Redirect to the responses page
      router.push(`/dashboard/forms/responses?formId=${formId}`);
    } catch (error) {
      console.error("Error viewing responses:", error);
    } finally {
      setLoadingView(null); // Stop loading for View Responses
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Form List"} />
      <div className="container mx-auto p-6">
        {forms.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-400">No forms available</p>
          </div>
        ) : (
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
                    Agent Gender: {form.agentGender.join(", ")}
                  </p>
                  <div className="flex flex-row sm:flex-row justify-between">
                    <button
                      onClick={() => handleEditSurvey(form.id, form)}
                      className="bg-primary text-white px-4 py-2 rounded-md mt-4 flex items-center"
                      disabled={loadingEdit === form.id} // Disable button while loading for Edit Form
                    >
                      {loadingEdit === form.id && (
                        <svg  aria-hidden="true" role="status" className="inline w-6 h-6 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg> 
                      )}
                      Edit Form
                    </button>
                    <button
                      onClick={() => handleViewResponses(form.id, form)}
                      className="bg-secondary text-white px-4 py-2 rounded-md mt-4 flex items-center"
                      disabled={loadingView === form.id} // Disable button while loading for View Responses
                    >
                      {loadingView === form.id && (
                             <svg  aria-hidden="true" role="status" className="inline w-6 h-6 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                          </svg> 
                      )}
                      View Responses
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default FormList;
