
import React from 'react';
import { QuotationRowData, MasterItem } from '../types';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface QuotationRowProps {
  data: QuotationRowData;
  onUpdate: (id: string, updates: Partial<QuotationRowData>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  masterItems: MasterItem[];
}

const QuotationRow: React.FC<QuotationRowProps> = ({ 
  data, 
  onUpdate, 
  onRemove, 
  onMove, 
  isFirst, 
  isLast,
  masterItems
}) => {
  const masterItem = masterItems.find(item => item.id === data.itemId);
  const tax = Math.floor(data.cost * 0.1);

  // 항목명 간소화: 괄호 전까지만 표시
  const simplifiedName = masterItem ? masterItem.name.split('(')[0].trim() : '-';

  const calculateCost = (unitPrice: number, values: number[]) => {
    return unitPrice * values.reduce((acc, val) => acc * val, 1);
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const itemId = e.target.value;
    if (!itemId) {
      onUpdate(data.id, { 
        itemId: '', 
        unitPrice: 0, 
        unitValues: [], 
        cost: 0, 
        notes: '' 
      });
      return;
    }

    const newItem = masterItems.find(item => item.id === itemId);
    if (newItem) {
      const newValues = new Array(newItem.units.length).fill(1);
      const newCost = calculateCost(newItem.defaultPrice, newValues);
      onUpdate(data.id, { 
        itemId: itemId, 
        unitPrice: newItem.defaultPrice,
        unitValues: newValues, 
        cost: newCost,
        notes: '' 
      });
    }
  };

  const handleUnitPriceChange = (value: number) => {
    const newCost = calculateCost(value, data.unitValues);
    onUpdate(data.id, { unitPrice: value, cost: newCost });
  };

  const handleValueChange = (index: number, value: number) => {
    const newValues = [...data.unitValues];
    newValues[index] = value;
    const newCost = calculateCost(data.unitPrice, newValues);
    onUpdate(data.id, { unitValues: newValues, cost: newCost });
  };

  const handleManualCostChange = (value: number) => {
    onUpdate(data.id, { cost: value });
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-purple-50 transition-colors group">
      <td className="p-3 text-center">
        <input 
          type="checkbox" 
          checked={data.isSelected} 
          onChange={(e) => onUpdate(data.id, { isSelected: e.target.checked })}
          className="w-4 h-4 text-brand rounded focus:ring-brand"
        />
      </td>
      <td className="p-3 min-w-[150px]">
        <select 
          value={data.itemId} 
          onChange={handleItemChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-brand focus:outline-none text-sm font-medium"
        >
          <option value="">항목 선택</option>
          {masterItems.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <div className="text-[10px] text-gray-400 mt-1 pl-1">표시명: {simplifiedName}</div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-1 justify-end">
          <span className="text-gray-400 text-xs">₩</span>
          <input 
            type="number" 
            value={data.unitPrice}
            onChange={(e) => handleUnitPriceChange(Number(e.target.value))}
            className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand text-sm text-right font-medium text-gray-700"
          />
        </div>
      </td>
      <td className="p-3" colSpan={2}>
        <div className="flex flex-wrap gap-3">
          {masterItem && masterItem.units.map((unitName, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{unitName}</span>
              <input 
                type="number" 
                value={data.unitValues[idx] || 0}
                onChange={(e) => handleValueChange(idx, Number(e.target.value))}
                className="w-16 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand text-sm text-center"
              />
            </div>
          ))}
          {(!masterItem || masterItem.units.length === 0) && <span className="text-xs text-gray-400 italic">-</span>}
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-1">
          <span className="text-gray-400 text-xs">₩</span>
          <input 
            type="number" 
            value={data.cost}
            onChange={(e) => handleManualCostChange(Number(e.target.value))}
            className="w-28 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand text-sm font-semibold text-brand"
          />
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
          <span>₩</span>
          <span>{tax.toLocaleString()}</span>
        </div>
      </td>
      <td className="p-3">
        <input 
          type="text" 
          value={data.notes}
          placeholder="비고 입력"
          onChange={(e) => onUpdate(data.id, { notes: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand text-sm"
        />
      </td>
      <td className="p-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onRemove(data.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
            title="삭제"
          >
            <Trash2 size={16} />
          </button>
          <div className="flex flex-col gap-0.5">
            <button 
              disabled={isFirst}
              onClick={() => onMove(data.id, 'up')}
              className={`p-0.5 hover:bg-gray-200 rounded ${isFirst ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <ChevronUp size={14} />
            </button>
            <button 
              disabled={isLast}
              onClick={() => onMove(data.id, 'down')}
              className={`p-0.5 hover:bg-gray-200 rounded ${isLast ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default QuotationRow;
