// src/components/ShortAnswerQuestion.tsx
import React from "react";
import { Field, ErrorMessage } from "formik";

const ShortAnswerQuestion: React.FC<{ id: string; questionText: string; onChange: Function; inputType: "text" | "number"; maxLength: number }> = ({
  id,
  questionText,
  onChange,
  inputType,
  maxLength,
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
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Input Type:</label>
        <Field
          as="select"
          name="inputType"
          value={inputType}
          onChange={(e:any) => onChange(id, "inputType", e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
        </Field>
      </div>

      <div className="mb-5">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Max Length:</label>
        <Field
          type="number"
          name="maxLength"
          value={maxLength}
          onChange={(e: any) => onChange(id, "maxLength", e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
        <ErrorMessage name="maxLength" component="div" className="text-red-500 text-sm mt-1" />
      </div>
    </div>
  );
};

export default ShortAnswerQuestion;
