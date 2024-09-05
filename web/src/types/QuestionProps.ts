// src/types/QuestionProps.ts
export interface QuestionProps {
    id: string;
    questionText: string;
    onChange: (id: string, name: string, value: any) => void; // Function to handle field changes
}
  