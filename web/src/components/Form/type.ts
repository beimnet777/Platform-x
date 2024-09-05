export interface QuestionProps {
    id: string;
    questionText: string;
    onChange: (id: string, name: string, value: any) => void; 
}
  