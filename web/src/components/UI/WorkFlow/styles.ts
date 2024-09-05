'use client';
import styled from 'styled-components';

export const Wrapper = styled.section`
  padding: 5rem 0;
  background-color: #0a0a0a;
  text-align: center;
`;

export const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export const WorkflowTitle = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: #00d1b2;
`;

export const WorkflowItem = styled.div<{ position: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.position === 'center' ? 'center' : props.position === 'right' ? 'flex-end' : 'flex-start')};
  max-width: 300px;
  padding: 1rem;
  background: #1b1b1b;
  border-radius: 8px;
  color: #fff;
  position: relative;

  &:after {
    content: '';
    width: ${(props) => (props.position === 'bottom' ? '100%' : '0.5px')};
    height: ${(props) => (props.position === 'bottom' ? '0.5px' : '50px')};
    background: #00d1b2;
    position: absolute;
    ${(props) =>
      props.position === 'left' ? 'right: -1rem; top: 50%; transform: translateY(-50%);' : ''}
    ${(props) =>
      props.position === 'right' ? 'left: -1rem; top: 50%; transform: translateY(-50%);' : ''}
    ${(props) =>
      props.position === 'bottom' ? 'top: -1rem; left: 50%; transform: translateX(-50%);' : ''}
  }
`;

export const WorkflowDescription = styled.p`
  font-size: 1rem;
  color: #ccc;
`;

export const WorkflowLine = styled.div`
  width: 100%;
  height: 1px;
  background: #00d1b2;
  position: absolute;
  top: 50%;
  left: 0;
`;
