// types/organization.ts

export interface Organization {
    id: number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: "OrgAdmin";
    organization: {
      id: number;
      organizationName: string;
      organizationDescription: string;
      approved: boolean;
    };
  }
  