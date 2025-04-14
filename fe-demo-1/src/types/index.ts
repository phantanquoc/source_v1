export interface Department {
  id: string;
  name: string;
  subDepartments: SubDepartment[];
}

export interface SubDepartment {
  id: string;
  name: string;
}

export interface ReportCategory {
  id: string;
  name: string;
}

export interface User {
  username: string;
  fullName: string;
  role: string;
  department?: string;
}

export interface UserInfo {
  username: string;
  email: string;
  department: string;
  room: string;
  position: string;
}

export interface SidebarProps {
  activeDepartment: string | null;
  setActiveDepartment: (id: string | null) => void;
  activeSubDepartment: string | null;
  setActiveSubDepartment: (id: string | null) => void;
  currentUser: string | null;
  onLogout: () => void;
}

export type GoalStatus = 'pending' | 'in-progress' | 'completed' | 'delayed';

export interface GoalPlan {
  _id?: string;
  username: string;
  email: string;
  department: string;
  room: string;
  position: string;
  loaimuctieu: string;
  muctiecaptren: string;
  muctiebanthan: string;
  hmcv: string;
  yccc: string;
  ttcc: string;
  datetao: string;
  dateduyet: string;
  nguoiduyet: string;
  ketqualamduoc: string;
  ketquaptpt: number;
  chualamduoc: string;
  nguyennhan: string;
  nguoibaocao: string;
  status: GoalStatus;
  filekem: string;
}

export interface GoalPlanFormProps {
  onClose: () => void;
  onSave: (goalData: GoalPlan) => void;
  editingGoal?: GoalPlan | null;
  userInfo?: UserInfo | null;
  departmentName?: string; // Thêm departmentName vào props
}
