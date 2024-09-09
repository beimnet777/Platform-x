import styled from '@emotion/styled';
import { FaTrashAlt } from 'react-icons/fa';

// Enhanced Button styling
export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #0070f3;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 10px;
  transition: background-color 0.3s ease;
  margin-right:10px;

  &:hover {
    background-color: #005bb5;
  }
`;

// Enhanced Save Button styling
export const SaveButton = styled(Button)`
  margin-left: auto;
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

// Enhanced container styles
export const Container = styled.div`
  display: flex;
  padding: 20px;
  background-color: #f3f4f6;
  min-height: 100vh;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

// Enhanced sidebar styling
export const Sidebar = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  height: fit-content;

  @media (min-width: 768px) {
    width: 250px;
    border-right: 1px solid #ddd;
    border-bottom: none;
    margin-bottom: 0;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 10px;
  }
`;

// Enhanced sidebar button styling
export const SidebarButton = styled(Button)`
  font-size: 0.9rem;
  padding: 8px;
`;

// Enhanced main content styling
export const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  margin-left: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    margin-left: 20px;
    padding: 40px;
  }

  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 20px;
  }
`;

// Enhanced question navigation styles
export const QuestionNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

// Enhanced question button styling
export const QuestionButton = styled.button`
  padding: 10px 20px;
  margin: 5px 5px 5px 0;
  border: none;
  background-color: #0070f3;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005bb5;
  }

  &:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
  }
`;

// Enhanced delete icon styling
export const DeleteIcon = styled(FaTrashAlt)`
  cursor: pointer;
  color: red;
  width: 24px;
  height: 24px;
  margin-left: 10px;
  transition: color 0.3s ease;

  &:hover {
    color: #ff4d4d;
  }
`;

// Enhanced form field styling
export const FormField = styled.div`
  margin-bottom: 20px;
  font-size: 1rem;

  label {
    font-weight: 600;
    margin-right: 10px;
  }

  input {
    padding: 8px;
    width: 300px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    margin-top: 5px;
  }
`;

// Style for displaying the question number
export const QuestionNumber = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 15px;
`;