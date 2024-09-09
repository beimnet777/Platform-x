// src/components/MultipleChoiceQuestion.tsx
import React from "react";
import { Field, FieldArray, ErrorMessage } from "formik";

const MultipleChoiceQuestion: React.FC<{ id: string; questionText: string; onChange: Function; options: { id: string; text: string }[]; maxSelections: number }> = ({
  id,
  questionText,
  onChange,
  options,
  maxSelections,
}) => {
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = options.map((option, i) => (i === index ? { ...option, text: value } : option));
    onChange(id, "options", updatedOptions);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    onChange(id, "options", updatedOptions);
  };

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
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Max Selections:</label>
        <Field
          type="number"
          name="maxSelections"
          value={maxSelections}
          onChange={(e: any) => onChange(id, "maxSelections", e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
        <ErrorMessage name="maxSelections" component="div" className="text-red-500 text-sm mt-1" />
      </div>

      <FieldArray
        name="options"
        render={(arrayHelpers) => (
          <div>
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3 mb-3">
                <Field
                  name={`options[${index}].text`}
                  placeholder="Enter option"
                  value={option.text}
                  onChange={(e: any) => handleOptionChange(index, e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                <button type="button" onClick={() => handleRemoveOption(index)} className="text-red-500">
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newOption = { id: Date.now().toString(), text: "" };
                arrayHelpers.push(newOption);
                onChange(id, "options", [...options, newOption]);
              }}
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark"
            >
              Add Option
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default MultipleChoiceQuestion;
