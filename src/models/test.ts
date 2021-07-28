export type TestStatus = 'not_started' | 'in_progress' | 'completed';

export interface Test {
  id: string;
  name: string;
  screenshot: string;
  description: string;
  tags: string[];
  startDate: number;
  dueDate: number;
  progress: number;
  status: TestStatus;
  [key: string]: any;
}
