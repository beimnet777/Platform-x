"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetcher } from "@/utils/axios";
import DefaultLayout from "@/components/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/components/Breadcrumbs/Breadcrumb";
import { RootState } from "@/store/store";

const fallbackData = {
  totalResponses: 2,
  responses: [
    {
      id: 3,
      agentId: 1,
      formId: 4,
      isValid: false,
      createdAt: "2024-09-06T15:41:49.991Z",
      updatedAt: "2024-09-06T15:41:49.994Z",
      responseDetails: [
        {
          id: 1,
          questionId: 10,
          responseId: 3,
          responseText: "Answer to question 1",
          responseFilePath: "",
        },
        {
          id: 2,
          questionId: 11,
          responseId: 3,
          responseText: "Blue",
          responseFilePath: "uploads/audio_answer.mp3",
        },
        {
          id: 3,
          questionId: 12,
          responseId: 3,
          responseText: "",
          responseFilePath: "uploads/audio_answer.mp3",
        },
      ],
    },
    {
      id: 4,
      agentId: 1,
      formId: 4,
      isValid: false,
      createdAt: "2024-09-06T16:51:57.817Z",
      updatedAt: "2024-09-06T16:51:57.817Z",
      responseDetails: [
        {
          id: 4,
          questionId: 10,
          responseId: 4,
          responseText: "Different answer to question 1",
          responseFilePath: "",
        },
        {
          id: 5,
          questionId: 11,
          responseId: 4,
          responseText: "Red",
          responseFilePath: "uploads/audio_answer_2.mp3",
        },
        {
          id: 6,
          questionId: 12,
          responseId: 4,
          responseText: "",
          responseFilePath: "uploads/audio_answer_2.mp3",
        },
      ],
    },
  ],
};

const ResponseList: React.FC = () => {
  const router = useRouter();
  const { data: responsesData } = useSWR(
    "http://localhost:3000/api/v1/orgAdmin/get-responses/4",
    fetcher,
    { fallbackData }
  );

  const { questions, title } = useSelector((state: RootState) => state.survey);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const responses = responsesData.responses;
  const currentResponse = responses[currentResponseIndex];

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentResponse.responseDetails.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousResponse = () => {
    if (currentResponseIndex > 0) {
      setCurrentResponseIndex(currentResponseIndex - 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleNextResponse = () => {
    if (currentResponseIndex < responses.length - 1) {
      setCurrentResponseIndex(currentResponseIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const renderQuestionResponse = () => {
    const question = questions[currentQuestionIndex];
    const responseDetail = currentResponse.responseDetails.find(
      (detail: any) => detail.questionId === question.id
    );

    if (!responseDetail) return null;

    switch (question.questionType) {
      case "ShortAnswer":
        return (
          <div className="p-4 bg-white shadow-sm rounded-md border border-gray-200">
            <h4 className="font-semibold text-lg mb-2">Q{currentQuestionIndex + 1}: {question.questionText}</h4>
            <div className="p-3 bg-gray-50 rounded-md text-black">{responseDetail.responseText || "No answer provided."}</div>
          </div>
        );
      case "multiple_choice":
        return (
          <div className="p-4 bg-white shadow-sm rounded-md border border-gray-200">
            <h4 className="font-semibold text-lg mb-2">Q{currentQuestionIndex + 1}: {question.questionText}</h4>
            <ul className="list-none space-y-1">
              {question.options.map((option: any, index: number) => (
                <li
                  key={index}
                  className={`px-3 py-2 rounded-md border ${
                    responseDetail.responseText === option
                      ? "border-primary bg-green-100 text-green-700"
                      : "border-gray-200 bg-white text-gray-800"
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        );
      case "Audio":
        return (
          <div className="p-4 bg-white shadow-sm rounded-md border border-gray-200">
            <h4 className="font-semibold text-lg mb-2">Q{currentQuestionIndex + 1}: {question.questionText}</h4>
            <audio controls className="w-full">
              <source
                src={`http://localhost:3000/${responseDetail.responseFilePath}`}
                type="audio/mp3"
              />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Response List" />
      <div className="container mx-auto p-6">
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-2xl font-bold mb-6">Responses for Form: {title}</h2>
          <div className="my-4">
            <div>{renderQuestionResponse()}</div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className=" text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2B892E"  className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"  />
</svg>
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={
                  currentQuestionIndex === currentResponse.responseDetails.length - 1
                }
                className=" text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2B892E" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" color="#2B892E"/>
</svg>
              </button>
            </div>
          </div>
        </div>
        {/* Response Navigation Buttons Outside the Card */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousResponse}
            disabled={currentResponseIndex === 0}
            className="bg-secondary text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Previous Response
          </button>
          <button
            onClick={handleNextResponse}
            disabled={currentResponseIndex === responses.length - 1}
            className="bg-secondary text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Next Response
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ResponseList;
