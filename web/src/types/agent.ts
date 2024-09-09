// types/agent.ts

export interface Agent {
    id: number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: "Agent";
    agent: {
      id: number;
      gender: string;
      age: number;
      currentBalance: number;
      approved: boolean;
    };
  }
  