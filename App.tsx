
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { QuotationRowData, AIAnalysisResult, MasterItem } from './types';
import { analyzeQuotationContext } from './services/geminiService';
import QuotationRow from './components/QuotationRow';
import { MASTER_ITEMS } from './constants';
import { 
  Plus, Wand2, FileText, Download, Loader2, Eye, Settings, X, 
  User, CheckCircle2, Save, Trash2, ArrowLeft, Upload, FileUp, Lock, ShieldCheck, AlertCircle, Users, Mail, Maximize
} from 'lucide-react';
import * as XLSX from 'xlsx';

const SUPER_ADMIN = "seungyeop1031@gmail.com";

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

const QuotationDocument: React.FC<{ 
  docInfo: any, 
  clientName: string, 
  rows: QuotationRowData[], 
  masterItems: MasterItem[], 
  totals: any,
  id?: string,
  isPDF?: boolean
}> = ({ docInfo, clientName, rows, masterItems, totals, id, isPDF }) => {
  if (!masterItems || masterItems.length === 0) {
    return (
      <div id={id} className="p-12 text-center text-gray-400 bg-white border border-dashed rounded-xl">
        견적 항목 데이터가 없습니다. 관리자 모드에서 데이터를 업로드해주세요.
      </div>
    );
  }

  return (
    <div 
      id={id} 
      className={`quotation-doc bg-white p-12 flex flex-col font-sans text-gray-900 ${isPDF ? '' : 'border border-gray-100 shadow-sm'}`} 
      style={{ 
        minHeight: isPDF ? '296mm' : '297mm',
        width: '210mm', 
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      <h2 className="text-4xl font-black mb-12 text-center tracking-[0.2em] border-b-4 border-gray-900 pb-6 uppercase">견 적 서</h2>
      
      <div className="flex justify-between items-start mb-10 gap-4">
        <div className="flex-grow space-y-3 border-l-4 border-gray-900 pl-6">
          <div className="flex text-[13px] items-center"><span className="w-20 text-gray-500 font-bold">문서번호</span> <span className="font-semibold text-gray-800">{docInfo.docNo}</span></div>
          <div className="flex text-[13px] items-center"><span className="w-20 text-gray-500 font-bold">견적일자</span> <span className="font-semibold text-gray-800">{docInfo.dateFormatted}</span></div>
          <div className="flex items-end pt-1 whitespace-nowrap">
            <span className="w-20 text-gray-500 font-bold text-[13px] pb-1">수 신</span> 
            <span className="font-bold text-2xl border-b-2 border-gray-900 pb-1 min-w-[150px] inline-block">
              {clientName || '(고객사명 미입력)'}
            </span> 
            <span className="ml-2 font-semibold text-lg pb-1 text-gray-700">귀하</span>
          </div>
          <div className="flex text-[13px] items-center pt-1"><span className="w-20 text-gray-500 font-bold">유효기간</span> <span className="font-semibold text-gray-800">{docInfo.validity}</span></div>
        </div>

        <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg text-[10.5px] leading-tight text-gray-700 w-[360px] flex-shrink-0">
          <div className="flex mb-1.5"><span className="w-24 font-bold text-gray-400">사업자등록번호</span> <span className="font-bold text-gray-800 tracking-tight">101-86-69214</span></div>
          <div className="flex mb-1.5"><span className="w-24 font-bold text-gray-400">상호 및 대표자</span> <span className="font-bold text-gray-800 tracking-tight">(주)에이치에스지휴먼솔루션그룹 최철규</span></div>
          <div className="flex mb-1.5"><span className="w-24 font-bold text-gray-400">사업장 주소</span> <span className="font-medium text-gray-800">서울특별시 중구 장충단로 200 혜인빌딩 4, 5층</span></div>
          <div className="flex mb-0.5"><span className="w-24 font-bold text-gray-400">업태 / 종목</span> <span className="font-medium text-gray-800">서비스업 / 경영컨설팅외</span></div>
          <div className="mt-4 text-right italic font-black text-brand/80 tracking-tighter text-[12px]">HSG Human Solution Group</div>
        </div>
      </div>

      <div className="mb-10 bg-gray-900 text-white p-4 text-center rounded shadow-sm">
        <span className="text-sm font-medium mr-4 opacity-80">견적 총액 (VAT 포함):</span>
        <span className="text-2xl font-black tracking-wide">KRW {totals.grandTotal.toLocaleString()}</span>
      </div>

      <div className="flex-grow">
        <table className="w-full border-collapse border border-gray-300 text-[11.5px] mb-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left bg-gray-100 font-bold text-gray-600">항목</th>
              <th className="border border-gray-300 p-2 text-right w-24 bg-gray-100 font-bold text-gray-600">단가</th>
              <th className="border border-gray-300 p-2 text-center w-28 bg-gray-100 font-bold text-gray-600">수량/단위</th>
              <th className="border border-gray-300 p-2 text-right w-32 bg-gray-100 font-bold text-gray-600">공급가액</th>
              <th className="border border-gray-300 p-2 text-right w-24 bg-gray-100 font-bold text-gray-600">세액(10%)</th>
              <th className="border border-gray-300 p-2 text-left w-32 bg-gray-100 font-bold text-gray-600">비고</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter(r => r.isSelected).map(row => {
              const item = masterItems.find(m => m.id === row.itemId);
              if (!item) return null;

              const unitDisplay = item.units.map((u, i) => `${row.unitValues[i] || 0}${u}`).join(' x ');
              const itemName = item.name ? item.name.split('(')[0].trim() : '(알 수 없는 항목)';
              
              return (
                <tr key={row.id}>
                  <td className="border border-gray-300 p-2 font-semibold text-gray-800">{itemName}</td>
                  <td className="border border-gray-300 p-2 text-right text-gray-500">₩{(row.unitPrice || 0).toLocaleString()}</td>
                  <td className="border border-gray-300 p-2 text-center text-[10px] font-mono text-gray-600">{unitDisplay}</td>
                  <td className="border border-gray-300 p-2 text-right font-bold text-gray-900">₩{(row.cost || 0).toLocaleString()}</td>
                  <td className="border border-gray-300 p-2 text-right text-gray-400 italic">₩{Math.floor((row.cost || 0) * 0.1).toLocaleString()}</td>
                  <td className="border border-gray-300 p-2 text-[10px] text-gray-500 whitespace-pre-wrap">{row.notes}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 font-bold border-t-2 border-gray-900">
              <td colSpan={3} className="border border-gray-300 p-3 text-center text-gray-500 uppercase tracking-widest text-[11px]">합 계 (Subtotal)</td>
              <td className="border border-gray-300 p-3 text-right text-base text-gray-900">₩{totals.costSum.toLocaleString()}</td>
              <td className="border border-gray-300 p-3 text-right text-gray-500">₩{totals.taxSum.toLocaleString()}</td>
              <td className="border border-gray-300 p-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-2 pt-6 border-t border-gray-200 text-[11px] leading-relaxed text-gray-500">
        <p className="font-bold text-gray-700 mb-1.5">※ 견적 참고 사항</p>
        <p>• 위 비용은 부가세(VAT) 별도 금액이 합산되어 표기되었습니다.</p>
        <p>• 2시간 30분 이하 강의는 최소 출강비용 기준에 따라 250만원의 교육비용이 발생됩니다. (VAT 별도)</p>
        <p>• 교육을 위한 장소는 고객사 제공을 기준으로 합니다. 서울/경기 외 지역은 별도 교통비를 청구합니다.</p>
        <p>• 온라인 교육 진행 시, HSG 스튜디오 및 전문 PD 투입에 따른 운영비가 별도 추가될 수 있습니다.</p>
        <div className="flex justify-between text-[10px] text-gray-300 uppercase tracking-widest pt-8">
            <p>Generated by HSG Quotation Maker</p>
            <p>© {new Date().getFullYear()} HSG. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [clientName, setClientName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSavingPDF, setIsSavingPDF] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isUserMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'user';
  }, []);

  const [adminEmails, setAdminEmails] = useState<string[]>(() => {
    const saved = localStorage.getItem('hsg_admin_emails');
    return saved ? JSON.parse(saved) : [SUPER_ADMIN];
  });
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [masterItems, setMasterItems] = useState<MasterItem[]>(() => {
    const saved = localStorage.getItem('hsg_master_items_v7');
    return saved ? JSON.parse(saved) : MASTER_ITEMS;
  });
  
  const [selectedMasterIds, setSelectedMasterIds] = useState<string[]>([]);
  const [rows, setRows] = useState<QuotationRowData[]>([]);

  const fullscreenTriggered = useRef(false);
  const handleUserInteraction = useCallback(() => {
    if (isUserMode && !fullscreenTriggered.current) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      }
      fullscreenTriggered.current = true;
    }
  }, [isUserMode]);

  useEffect(() => {
    if (isUserMode) {
      window.addEventListener('mousedown', handleUserInteraction);
      return () => window.removeEventListener('mousedown', handleUserInteraction);
    }
  }, [isUserMode, handleUserInteraction]);

  useEffect(() => {
    localStorage.setItem('hsg_master_items_v7', JSON.stringify(masterItems));
  }, [masterItems]);

  useEffect(() => {
    localStorage.setItem('hsg_admin_emails', JSON.stringify(adminEmails));
  }, [adminEmails]);

  const totals = useMemo(() => {
    const costSum = rows.reduce((sum, row) => sum + (row.isSelected ? row.cost : 0), 0);
    const taxSum = Math.floor(costSum * 0.1);
    const grandTotal = costSum + taxSum;
    return { costSum, taxSum, grandTotal };
  }, [rows]);

  const docInfo = useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return {
      docNo: `HSG-${String(now.getFullYear()).slice(-2)}${mm}${dd}-${Math.floor(Math.random() * 900) + 100}`,
      dateFormatted: `${now.getFullYear()}.${mm}.${dd}`,
      validity: `${now.getFullYear()}.${mm}.${dd} (발행일로부터 1개월)`
    };
  }, [rows.length]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAdminAuth = () => {
    const trimmedEmail = authEmail.trim().toLowerCase();
    if (adminEmails.some(email => email.toLowerCase() === trimmedEmail)) {
      setIsAdmin(true);
      setIsAuthModalOpen(false);
      setAuthEmail('');
      triggerToast('관리자 인증에 성공했습니다.');
    } else {
      alert("접근 권한이 없는 이메일입니다. 관리자에게 문의하세요.");
    }
  };

  const handleAddAdmin = () => {
    const emailToAdd = newAdminEmail.trim().toLowerCase();
    if (!emailToAdd) return;
    if (!emailToAdd.includes('@')) {
      alert('유효한 이메일 형식이 아닙니다.');
      return;
    }
    if (adminEmails.includes(emailToAdd)) {
      alert('이미 등록된 관리자 이메일입니다.');
      return;
    }
    setAdminEmails(prev => [...prev, emailToAdd]);
    setNewAdminEmail('');
    triggerToast('새로운 관리자가 추가되었습니다.');
  };

  const handleRemoveAdmin = (email: string) => {
    if (email === SUPER_ADMIN) {
      alert('최초 소유주 계정은 삭제할 수 없습니다.');
      return;
    }
    setAdminEmails(prev => prev.filter(e => e !== email));
    triggerToast('관리자 권한이 삭제되었습니다.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];

        const newItems: MasterItem[] = data.slice(1)
          .filter(row => row[0] && String(row[0]).trim() !== "")
          .map(row => ({
            id: generateId(),
            name: String(row[0] || '').trim(),
            units: String(row[1] || '단위').split(',').map(u => u.trim()),
            defaultPrice: Number(String(row[2] || '0').replace(/[^0-9]/g, '')),
            description: String(row[3] || '').trim()
          }));

        if (newItems.length > 0) {
          setMasterItems(prev => [...prev, ...newItems]);
          triggerToast(`${newItems.length}개의 항목이 등록되었습니다.`);
        }
      } catch (err) {
        alert("파일 처리 중 오류가 발생했습니다.");
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerateDraft = async () => {
    if (!userInput.trim() || masterItems.length === 0) return;
    setIsGenerating(true);
    try {
      const results: AIAnalysisResult[] = await analyzeQuotationContext(userInput, masterItems);
      const newRows: QuotationRowData[] = results.map((res) => {
        const item = masterItems.find(m => m.id === res.itemId) || masterItems[0];
        const finalValues = new Array(item.units.length).fill(1);
        res.unitValues.forEach((v, i) => { if (i < finalValues.length) finalValues[i] = v; });
        return {
          id: generateId(),
          isSelected: true,
          itemId: item.id,
          unitPrice: item.defaultPrice,
          unitValues: finalValues,
          notes: '', // AI 분석 로그 대신 비어있는 비고란 제공
          cost: item.defaultPrice * finalValues.reduce((a, b) => a * b, 1)
        };
      });
      setRows(newRows);
      triggerToast('초안 작성이 완료되었어요!');
    } catch (error) {
      console.error(error);
      alert("분석 중 오류 발생");
    } finally {
      setIsGenerating(false);
    }
  };

  const addMasterItem = () => {
    setMasterItems(prev => [{
      id: generateId(),
      name: '새 항목',
      units: ['단위'],
      defaultPrice: 0,
      description: ''
    }, ...prev]);
  };

  const removeMasterItem = (id: string) => {
    setMasterItems(prev => prev.filter(i => i.id !== id));
    setSelectedMasterIds(prev => prev.filter(selectedId => selectedId !== id));
    triggerToast('항목이 삭제되었습니다.');
  };

  const handleBulkDeleteMaster = useCallback(() => {
    if (selectedMasterIds.length === 0) return;
    setMasterItems(prev => prev.filter(item => !selectedMasterIds.includes(item.id)));
    setSelectedMasterIds([]);
    triggerToast('선택한 항목들이 삭제되었습니다.');
  }, [selectedMasterIds]);

  const toggleAllMaster = () => {
    if (selectedMasterIds.length === masterItems.length && masterItems.length > 0) {
      setSelectedMasterIds([]);
    } else {
      setSelectedMasterIds(masterItems.map(i => i.id));
    }
  };

  const handleSavePDF = async () => {
    const element = document.getElementById('print-area');
    if (!element) return;
    setIsSavingPDF(true);
    try {
      const opt = {
        margin: 0,
        filename: `HSG_견적서_${clientName || '고객'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await (window as any).html2pdf().set(opt).from(element).save();
    } catch (e) {
      alert("PDF 생성 실패");
    } finally {
      setIsSavingPDF(false);
    }
  };

  return (
    <div className="w-screen min-h-screen pb-24 text-gray-900 bg-[#f8fafc] relative overflow-x-hidden">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 no-print shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => !isUserMode && setIsAdmin(false)}>
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white shadow-lg">
              <FileText size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">HSG Quotation Maker</h1>
          </div>
          <div className="flex items-center gap-6">
            {!isAdmin && (
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-brand">₩{totals.grandTotal.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-brand/60 uppercase tracking-wider">VAT 포함</span>
              </div>
            )}
            
            {!isUserMode && (
              <button 
                onClick={() => isAdmin ? setIsAdmin(false) : setIsAuthModalOpen(true)} 
                className={`p-3 rounded-xl transition-all flex items-center gap-2 font-bold ${isAdmin ? 'bg-brand text-white shadow-md' : 'hover:bg-gray-100 text-gray-400'}`}
              >
                {isAdmin ? <><ArrowLeft size={20} /> 관리자 종료</> : <Settings size={20} />}
              </button>
            )}
            
            {isUserMode && (
              <button 
                onClick={handleUserInteraction}
                className="p-3 rounded-xl hover:bg-gray-100 text-gray-400"
                title="전체 화면"
              >
                <Maximize size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 no-print">
        {isAdmin ? (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-12">
            <div>
              <div className="sticky top-[73px] z-20 bg-[#f8fafc]/90 backdrop-blur-md -mx-6 px-6 py-4 mb-8 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                      <FileUp className="text-brand" size={28} /> 마스터 데이터 관리
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium text-sm">데이터를 엑셀로 업로드하거나 편집하세요.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xlsx, .xls, .csv" />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white border border-brand/40 text-brand px-5 py-3 rounded-xl font-bold hover:bg-brand/5 transition-all shadow-sm mr-4">
                      <FileUp size={20} /> 엑셀 파일 업로드
                    </button>

                    <button onClick={toggleAllMaster} className="bg-white border border-gray-300 text-gray-600 px-5 py-3 rounded-xl font-bold hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                      <CheckCircle2 size={20} className="inline mr-2" />
                      {selectedMasterIds.length === masterItems.length && masterItems.length > 0 ? '전체 해제' : '전체 선택'}
                    </button>

                    <button 
                      onClick={handleBulkDeleteMaster} 
                      disabled={selectedMasterIds.length === 0} 
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 ${
                        selectedMasterIds.length > 0 
                        ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100' 
                        : 'bg-gray-50 text-gray-300 border border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <Trash2 size={20} /> {selectedMasterIds.length > 0 ? `${selectedMasterIds.length}개 삭제` : '삭제'}
                    </button>

                    <button 
                      onClick={() => { localStorage.setItem('hsg_master_items_v7', JSON.stringify(masterItems)); triggerToast('브라우저에 저장되었습니다.'); }} 
                      className="bg-white border border-brand/20 text-brand px-5 py-3 rounded-xl font-bold hover:bg-brand/5 shadow-sm transition-all active:scale-95"
                    >
                      <Save size={20} /> 저장
                    </button>

                    <button onClick={addMasterItem} className="bg-brand text-white px-5 py-3 rounded-xl font-bold hover:bg-brand-dark shadow-lg transition-all active:scale-95">
                      <Plus size={20} /> 항목 추가
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {masterItems.length === 0 ? (
                  <div className="p-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-inner">
                    <Upload size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="text-lg font-bold">등록된 항목이 없습니다.</p>
                    <p className="text-sm mt-1">파일을 업로드하거나 '항목 추가'를 눌러 시작하세요.</p>
                  </div>
                ) : masterItems.map((item) => (
                  <div key={item.id} className={`bg-white rounded-2xl p-6 border transition-all ${selectedMasterIds.includes(item.id) ? 'border-brand ring-1 ring-brand bg-brand/5 shadow-md' : 'border-gray-200 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-start gap-4">
                      <div className="pt-8">
                        <input 
                          type="checkbox" 
                          checked={selectedMasterIds.includes(item.id)} 
                          onChange={() => {
                            setSelectedMasterIds(prev => 
                              prev.includes(item.id) 
                                ? prev.filter(id => id !== item.id) 
                                : [...prev, item.id]
                            );
                          }} 
                          className="w-5 h-5 text-brand rounded cursor-pointer border-gray-300" 
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4">
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">항목명</label>
                          <input type="text" value={item.name} onChange={(e) => setMasterItems(prev => prev.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand font-bold text-gray-800" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">단위 (쉼표 구분)</label>
                          <input type="text" value={item.units.join(', ')} onChange={(e) => setMasterItems(prev => prev.map(i => i.id === item.id ? { ...i, units: e.target.value.split(',').map(u => u.trim()) } : i))} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand font-mono text-sm" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">기본 단가</label>
                          <input type="number" value={item.defaultPrice} onChange={(e) => setMasterItems(prev => prev.map(i => i.id === item.id ? { ...i, defaultPrice: Number(e.target.value) } : i))} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand font-bold text-brand" />
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">설명 (AI 참고용)</label>
                          <textarea value={item.description} onChange={(e) => setMasterItems(prev => prev.map(i => i.id === item.id ? { ...i, description: e.target.value } : i))} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand text-xs h-[46px] resize-none leading-normal" />
                        </div>
                        <div className="md:col-span-1 flex items-end justify-end">
                          <button onClick={() => removeMasterItem(item.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={24} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Users className="text-brand" size={24} /> 관리자 계정 권한 관리
                </h2>
                <p className="text-gray-500 text-sm mt-1">접속을 허용할 관리자 이메일 주소를 등록하고 관리하세요.</p>
              </div>
              <div className="p-8">
                <div className="flex gap-3 mb-8">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="email" 
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="추가할 관리자 이메일 입력"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand focus:outline-none font-medium"
                    />
                  </div>
                  <button 
                    onClick={handleAddAdmin}
                    className="bg-brand text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-dark transition-all flex items-center gap-2 active:scale-95 shadow-lg"
                  >
                    <Plus size={20} /> 계정 추가
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminEmails.map(email => (
                    <div key={email} className="flex items-center justify-between p-4 bg-slate-50 border border-gray-100 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand border border-gray-100">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{email}</p>
                          {email === SUPER_ADMIN && <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Owner</span>}
                        </div>
                      </div>
                      {email !== SUPER_ADMIN && (
                        <button 
                          onClick={() => handleRemoveAdmin(email)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center">
              <AlertCircle size={40} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">관리자 전용 기능입니다. 편집 완료 후 안전하게 로그아웃 하세요.</p>
              <button onClick={() => setIsAdmin(false)} className="mt-4 bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all">편집 종료 및 사용자 모드로 전환</button>
            </div>
          </section>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 tracking-tight">
                    <User size={18} className="text-brand" /> 고객사명
                  </label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand focus:outline-none text-gray-800 font-bold placeholder:text-gray-300 placeholder:font-normal" placeholder="예: (주)에이치에스지" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-gray-700 mb-3 tracking-tight">업무 맥락 상세 입력 (AI 분석용)</label>
                  <textarea className="w-full h-[64px] p-4 bg-slate-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand focus:outline-none resize-none leading-relaxed font-medium placeholder:text-gray-300 placeholder:font-normal" placeholder="예: 리더십 교육 3시간 2회 진행, 충청도 지역 출장, 교재 50부 인쇄 필요" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handleGenerateDraft} disabled={isGenerating || !userInput.trim() || masterItems.length === 0} className="group flex items-center gap-3 bg-brand hover:bg-brand-dark disabled:bg-purple-200 text-white font-black py-5 px-12 rounded-[20px] shadow-xl shadow-brand/20 transition-all active:scale-95 disabled:shadow-none">
                  {isGenerating ? <><Loader2 className="animate-spin" size={22} /> AI가 견적 분석 중...</> : <><Wand2 size={24} className="group-hover:rotate-12 transition-transform" /> 견적서 자동 작성</>}
                </button>
              </div>
            </section>

            <section className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <div className="p-8 bg-slate-50/50 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-black text-gray-800 flex items-center gap-3 text-xl tracking-tight">
                  견적 상세 내역 
                  <span className="bg-brand text-white text-[11px] px-2.5 py-1 rounded-full uppercase tracking-widest font-black">{rows.length}</span>
                </h2>
                <button onClick={() => {
                  setRows([...rows, { 
                    id: generateId(), 
                    isSelected: true, 
                    itemId: '', // 빈 값으로 설정하여 '항목 선택'이 기본으로 나오도록 함
                    unitPrice: 0,
                    unitValues: [], 
                    cost: 0, 
                    notes: '' 
                  }]);
                }} className="text-sm text-brand hover:text-brand-dark font-black flex items-center gap-2 bg-brand/5 px-5 py-2.5 rounded-2xl transition-colors"><Plus size={20} /> 항목 직접 추가</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/30 text-gray-400 text-[11px] font-black uppercase tracking-[0.15em] text-left">
                    <tr>
                      <th className="p-5 w-12 text-center"></th>
                      <th className="p-5">비용 항목</th>
                      <th className="p-5 text-right">기본 단가</th>
                      <th className="p-5" colSpan={2}>수량</th>
                      <th className="p-5">공급가액</th>
                      <th className="p-5">세액</th>
                      <th className="p-5">비고</th>
                      <th className="p-5 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rows.length === 0 ? (
                      <tr><td colSpan={9} className="p-24 text-center text-gray-300 font-bold italic tracking-tight">입력된 내역이 없습니다. AI 자동 작성을 이용해 보세요!</td></tr>
                    ) : rows.map((row, idx) => (
                      <QuotationRow key={row.id} data={row} onUpdate={(id, up) => setRows(prev => prev.map(r => r.id === id ? { ...r, ...up } : r))} onRemove={(id) => setRows(prev => prev.filter(r => r.id !== id))} onMove={(id, dir) => {
                        const idx = rows.findIndex(r => r.id === id);
                        if (idx === -1) return;
                        const next = [...rows];
                        const offset = dir === 'up' ? -1 : 1;
                        [next[idx], next[idx+offset]] = [next[idx+offset], next[idx]];
                        setRows(next);
                      }} isFirst={idx === 0} isLast={idx === rows.length - 1} masterItems={masterItems} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      {!isAdmin && rows.length > 0 && (
        <div className="fixed bottom-10 right-10 flex gap-4 no-print animate-in fade-in slide-in-from-right-4 duration-500">
          <button onClick={() => setIsPreviewOpen(true)} className="flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-10 py-5 rounded-[24px] shadow-2xl transition-all font-black active:scale-95"><Eye size={24} /> 미리보기</button>
          <button onClick={handleSavePDF} disabled={isSavingPDF} className="flex items-center gap-3 bg-brand hover:bg-brand-dark text-white px-10 py-5 rounded-[24px] shadow-2xl shadow-brand/30 transition-all font-black active:scale-95 disabled:bg-purple-300">
            {isGenerating || isSavingPDF ? <><Loader2 className="animate-spin" size={24} /> 작업 중...</> : <><Download size={24} /> PDF 다운로드</>}
          </button>
        </div>
      )}

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center text-brand mb-6">
                <Lock size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">관리자 인증</h3>
              <p className="text-gray-500 text-sm mt-2 font-bold opacity-70">등록된 관리자 계정으로 접속해 주세요.</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase mb-3 block tracking-widest">관리자 이메일</label>
                <input 
                  type="email" 
                  value={authEmail} 
                  onChange={(e) => setAuthEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
                  className="w-full p-5 bg-slate-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand focus:outline-none font-bold"
                  placeholder="admin@hsg.co.kr"
                />
              </div>
              <button onClick={handleAdminAuth} className="w-full bg-brand text-white py-5 rounded-2xl font-black hover:bg-brand-dark transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-brand/20">
                <ShieldCheck size={24} /> 관리자 모드 접속
              </button>
              <button onClick={() => setIsAuthModalOpen(false)} className="w-full text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors">취소</button>
            </div>
          </div>
        </div>
      )}

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-xl no-print overflow-y-auto pt-6 pb-12 sm:pt-10">
          <div className="bg-white w-full max-w-[1000px] rounded-[48px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 mx-4 sm:mx-6">
            <div className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="font-black text-2xl text-gray-800 tracking-tight">견적서 미리보기</h3>
              <button onClick={() => setIsPreviewOpen(false)} className="p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={32} /></button>
            </div>
            
            <div className="flex-1 p-6 sm:p-12 bg-slate-100/50 flex justify-center overflow-x-auto min-h-[500px]">
              <div className="shadow-2xl rounded-sm transform origin-top scale-[0.5] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 transition-transform mb-[-200px] sm:mb-[-100px] lg:mb-0">
                <QuotationDocument docInfo={docInfo} clientName={clientName} rows={rows} masterItems={masterItems} totals={totals} />
              </div>
            </div>
            
            <div className="p-8 bg-white border-t flex flex-wrap justify-end gap-5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] sticky bottom-0 z-10">
              <button onClick={() => setIsPreviewOpen(false)} className="px-10 py-5 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-colors">닫기</button>
              <button onClick={handleSavePDF} disabled={isSavingPDF} className="bg-brand text-white px-10 py-5 rounded-2xl font-black hover:bg-brand-dark transition-all flex items-center gap-3 shadow-xl shadow-brand/20">
                {isSavingPDF ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />} PDF 다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="print-only">
        <QuotationDocument id="print-area" docInfo={docInfo} clientName={clientName} rows={rows} masterItems={masterItems} totals={totals} isPDF={true} />
      </div>

      <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 pointer-events-none ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-gray-900 text-white px-10 py-5 rounded-[24px] shadow-2xl flex items-center gap-4 font-black border border-white/10 backdrop-blur-md">
          <CheckCircle2 size={24} className="text-brand" />
          <span className="tracking-tight">{toastMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
