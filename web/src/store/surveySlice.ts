// surveySlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Option {
  id: string;
  text: string;
}
export enum AgentGender {
  MALE = 'Male',
  FEMALE = 'Female',
  BOTH = 'Both'
}

export type ShortAnswerQuestionType = {
  id: string;
  questionType: 'ShortAnswer';
  questionText: string;
  inputType: 'text' | 'number';
  maxLength: number;
};

export type MultipleChoiceQuestionType = {
  id: string;
  questionType: 'multiple_choice';
  questionText: string;
  options: Option[];
  maxSelections: number;
};

export type AudioQuestionType = {
  id: string;
  questionType: 'Audio';
  questionText: string;
  maxSize: number; // Size in MB
  maxDuration: number; // Duration in seconds
};

export type Question = ShortAnswerQuestionType | MultipleChoiceQuestionType | AudioQuestionType;

export interface SurveyState {
  title: string;
  description: string;
  isOpen: boolean;
  minAgentAge: number;
  maxAgents: number;
  agentGender: AgentGender;
  questions: Question[];
  currentQuestionIndex: number;
}

const initialState: SurveyState = {
  title: '',
  description: '',
  isOpen: false,
  minAgentAge: 18,
  maxAgents: 100,
  agentGender: AgentGender.BOTH,
  questions: [],
  currentQuestionIndex: 0,
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setSurveyTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setSurveyDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setSurveyIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setSurveyMinAge: (state, action: PayloadAction<number>) => {
      state.minAgentAge = action.payload;
    },
    setSurveyMaxAgents: (state, action: PayloadAction<number>) => {
      state.maxAgents = action.payload;
    },
    setSurveyGender: (state, action: PayloadAction<AgentGender>) => {
      state.agentGender = action.payload;
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },
    replaceQuestion: (state, action: PayloadAction<{ index: number; question: Question }>) => {
      state.questions[action.payload.index] = action.payload.question;
    },
    deleteQuestion: (state, action: PayloadAction<number>) => {
      state.questions.splice(action.payload, 1);
      if (state.currentQuestionIndex >= state.questions.length) {
        state.currentQuestionIndex = state.questions.length - 1;
      }
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    resetSurvey: () => initialState, 
  },
});

export const {
  setSurveyTitle,
  setSurveyDescription,
  setSurveyIsOpen,
  setSurveyMinAge,
  setSurveyMaxAgents,
  setSurveyGender,
  addQuestion,
  replaceQuestion,
  deleteQuestion,
  setCurrentQuestionIndex,
  resetSurvey,
} = surveySlice.actions;

export default surveySlice.reducer;