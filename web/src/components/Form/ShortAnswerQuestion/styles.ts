import styled from '@emotion/styled';
import { Field } from 'formik';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  @media (min-width: 768px) {
    padding: 30px;
  }
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

export const Select = styled.select`
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-top: 5px;
  width: 100%;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

export const Input = styled(Field)`
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;