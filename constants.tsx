
import { Employee, Prize } from './types';

export const DEFAULT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'John Doe', department: 'R&D' },
  { id: '2', name: 'Alice Smith', department: 'Marketing' },
  { id: '3', name: 'Bob Wilson', department: 'HR' },
  { id: '4', name: 'Charlie Brown', department: 'Finance' },
  { id: '5', name: 'David Lee', department: 'Admin' },
  { id: '6', name: 'Eve White', department: 'Product' },
  { id: '7', name: 'Frank Miller', department: 'Ops' },
  { id: '8', name: 'Grace Taylor', department: 'Tech Support' }
];

export const DEFAULT_PRIZES: Prize[] = [
  { id: 'p1', level: '1st Prize', name: 'iPhone 17 Pro', icon: '📱' },
  { id: 'p2', level: '2nd Prize', name: 'Electric Scooter', icon: '🛴' },
  { id: 'p3', level: '3rd Prize', name: 'Headphones', icon: '🎧' },
  { id: 'p4', level: '4th Prize', name: 'Smart Bottle', icon: '🥤' },
  { id: 'p5', level: '5th Prize', name: 'MacBook Pro', icon: '💻' },
  { id: 'p6', level: '6th Prize', name: 'Robot Vacuum', icon: '🧹' },
  { id: 'p7', level: '7th Prize', name: 'Gaming Mouse', icon: '🖱️' },
  { id: 'p8', level: '8th Prize', name: 'Gift Box', icon: '🎁' }
];

export const WHEEL_COLORS = [
  '#fefcf0', // Ivory/Light Yellow 1
  '#fff9e6', // Ivory/Light Yellow 2
];
