import React from 'react';
import DepartmentFactory from './departments/DepartmentFactory';

interface DepartmentViewProps {
  departmentId: string;
  subDepartmentId: string | null;
  setActiveSubDepartment?: (id: string | null) => void;
}

const DepartmentView: React.FC<DepartmentViewProps> = ({ departmentId, subDepartmentId, setActiveSubDepartment }) => {
  return <DepartmentFactory departmentId={departmentId} subDepartmentId={subDepartmentId} setActiveSubDepartment={setActiveSubDepartment} />;
};

export default DepartmentView;
