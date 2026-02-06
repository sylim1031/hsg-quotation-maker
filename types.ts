
export interface MasterItemUnit {
  name: string;
}

export interface MasterItem {
  id: string;
  name: string;
  units: string[]; // ['시간', '횟수'] 등 가변적 단위 배열
  defaultPrice: number;
  description?: string;
}

export interface QuotationRowData {
  id: string;
  isSelected: boolean;
  itemId: string;
  unitPrice: number; // 사용자가 수정한 단가를 저장하기 위한 필드
  unitValues: number[]; // 각 단위에 대응하는 수치 배열
  cost: number;
  notes: string;
}

export interface AIAnalysisResult {
  itemId: string;
  unitValues: number[];
  notes: string;
}
