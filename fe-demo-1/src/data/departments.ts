import { Department, ReportCategory } from '../types';

export const reportCategories: ReportCategory[] = [
  { id: 'goals', name: 'Mục tiêu và kế hoạch' },
  { id: 'finance', name: 'Tài chính' },
  { id: 'partners', name: 'Đối tác' },
  { id: 'orders', name: 'Đơn hàng' },
  { id: 'production', name: 'Sản xuất' },
  { id: 'technical', name: 'Kỹ thuật' },
  { id: 'requirements', name: 'Yêu cầu' },
];

export const departments: Department[] = [
  {
    id: 'quality',
    name: 'Bộ phận chất lượng',
    subDepartments: [
      { id: 'quality-personnel', name: 'Thông tin nhân sự' },
      { id: 'quality-office', name: 'Chất lượng khối văn phòng' },
      { id: 'quality-production', name: 'Chất lượng khối sản xuất' },
      { id: 'quality-process', name: 'Quy trình' },
    ],
  },
  {
    id: 'synthesis',
    name: 'Bộ phận tổng hợp',
    subDepartments: [
      { id: 'synthesis-quote', name: 'Tính báo giá' },
      { id: 'synthesis-partners', name: 'Đối tác' },
    ],
  },
  {
    id: 'business',
    name: 'Bộ phận kinh doanh',
    subDepartments: [
      { id: 'business-international', name: 'Phòng KD Quốc Tế' },
      { id: 'business-domestic', name: 'Phòng KD Nội Địa' },
    ],
  },
  {
    id: 'accounting',
    name: 'Bộ phận kế toán',
    subDepartments: [
      { id: 'accounting-admin', name: 'Phòng KT Hành chính' },
      { id: 'accounting-tax', name: 'Phòng KT thuế' },
    ],
  },
  {
    id: 'purchasing',
    name: 'Bộ phận Thu mua',
    subDepartments: [
      { id: 'purchasing-materials', name: 'Thu mua NVL' },
      { id: 'purchasing-equipment', name: 'Thu mua Thiết bị' },
    ],
  },
  {
    id: 'production',
    name: 'Bộ phận sản xuất',
    subDepartments: [
      { id: 'production-management', name: 'Phòng QLSX' },
      { id: 'production-warehouse', name: 'Quản lý kho' },
    ],
  },
  {
    id: 'technical',
    name: 'Bộ phận kỹ thuật',
    subDepartments: [
      { id: 'technical-system', name: 'Phòng QLHTM' },
      { id: 'technical-mechanical', name: 'Phòng cơ- điện' },
    ],
  },
];
