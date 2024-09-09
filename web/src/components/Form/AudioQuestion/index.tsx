// src/components/AudioQuestion.tsx
import React from "react";
import { Field, ErrorMessage } from "formik";

const AudioQuestion: React.FC<{ id: string; questionText: string; onChange: Function; maxSize: number; maxDuration: number }> = ({
  id,
  questionText,
  onChange,
  maxSize,
  maxDuration,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default p-6.5">
      <div className="mb-5">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Question Text:</label>
        <Field
          name="questionText"
          placeholder="Enter question"
          value={questionText}
          onChange={(e: any) => onChange(id, "questionText", e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
        <ErrorMessage name="questionText" component="div" className="text-red-500 text-sm mt-1" />
      </div>

      <div className="mb-5">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Max Size (MB):</label>
        <Field
          type="number"
          name="maxSize"
          value={maxSize}
          onChange={(e: any) => onChange(id, "maxSize", e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
        <ErrorMessage name="maxSize" component="div" className="text-red-500 text-sm mt-1" />
      </div>

      <div className="mb-5">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Max Duration (seconds):</label>
        <Field
          type="number"
          name="maxDuration"
          value={maxDuration}
          onChange={(e: any) => onChange(id, "maxDuration", e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
        <ErrorMessage name="maxDuration" component="div" className="text-red-500 text-sm mt-1" />
      </div>
    </div>
  );
};

export default AudioQuestion;
