
export interface Employee {
  id: string;
  name: string;
  department: string;
  isBoss?: boolean;
  hasWon?: boolean;
  neverWins?: boolean; // 新增：永远不会中奖的人员
}

export interface Prize {
  id: string;
  name: string;
  level: string;
  icon: string;
  remaining: number;
  total: number;
  reservedFor?: string;
  winners?: string[];
}

export interface DrawResult {
  winner: Employee;
  prize: Prize;
  timestamp: number;
}
