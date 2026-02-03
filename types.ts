
export interface Employee {
  id: string;
  name: string;
  department: string;
}

export interface Prize {
  id: string;
  name: string;
  level: string; // e.g. "Grand Prize", "First Prize"
  icon: string;  // emoji or icon representation
}

export interface DrawResult {
  winner: Employee;
  prize: Prize;
  timestamp: number;
}
