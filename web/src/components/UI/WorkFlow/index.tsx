'use client';
import React from 'react';
import { Wrapper, Inner, WorkflowItem, WorkflowTitle, WorkflowDescription, WorkflowLine } from './styles';
import { workflowData } from './constants';

const WhatWeDoSection = () => {
  return (
    <Wrapper>
      <Inner>
        <WorkflowTitle>What We Do</WorkflowTitle>
        <div className="workflow-container">
          {workflowData.map((item, index) => (
            <WorkflowItem key={index} position={item.position}>
              <h3>{item.title}</h3>
              <WorkflowDescription>{item.description}</WorkflowDescription>
            </WorkflowItem>
          ))}
          <WorkflowLine />
        </div>
      </Inner>
    </Wrapper>
  );
};

export default WhatWeDoSection;
