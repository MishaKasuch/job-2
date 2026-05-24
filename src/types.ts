export interface Vacancy {
  id: string;
  title: string;
  location: string;
  country: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  publishedAt: string;
}

export interface Application {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  coverLetter: string;
  resumeFileName?: string;
  status: 'new' | 'review' | 'interview' | 'accepted' | 'rejected';
  appliedAt: string;
  adminNotes?: string;
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
  approved: boolean;
}

export interface Branch {
  id: string;
  city: string;
  address: string;
  coords: { x: number; y: number }; // SVG Map percentage coordinate
}
