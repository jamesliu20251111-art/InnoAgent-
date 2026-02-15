
export interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
  status: 'ideation' | 'prototype' | 'market-ready';
  lastModified: number;
}

export interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
  multiverseAlternatives: string[]; // Ideas from "other dimensions"
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  type?: 'text' | 'feedback' | 'roadmap';
  data?: any;
}

export enum AppState {
  HOME = 'HOME',
  PROJECT_CREATION = 'PROJECT_CREATION',
  DASHBOARD = 'DASHBOARD',
  MIRROR_DIMENSION = 'MIRROR_DIMENSION', // Brainstorming
  SANCTUM = 'SANCTUM', // Chat/Coaching
}
