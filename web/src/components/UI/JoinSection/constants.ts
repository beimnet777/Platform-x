import { StaticImageData } from 'next/image';
import default_person from '../../../../public/images/default_person.png';

export const desktopHeaderPhrase = ['Join over 50,000', 'members in data excellence'];

export type Props = {
  testimony: string;
  person: string;
  avatar: StaticImageData;
};

export const testimonials = [
  {
    testimony:
      "Platform X has revolutionized our data management process. The efficient tools for data validation and collection have significantly improved our workflow, making it easier to handle complex datasets.",
    person: 'Abebe Kebede',
    avatar: default_person,
  },
  {
    testimony:
      "I have been impressed by Platform X's task management features. As a data collection agent, it has simplified my job, allowing me to focus on quality rather than logistics.",
    person: 'Lemlem Tadesse',
    avatar: default_person,
  },
  {
    testimony:
      "The platform's subscription management has been instrumental in helping us choose the right plan for our needs, providing flexibility and control over our data access and usage.",
    person: 'Fikre Haile',
    avatar: default_person,
  },
];
