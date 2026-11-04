import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  PhoneCall, 
  Mail, 
  Calendar, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Search,
  CheckSquare,
  FileText
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('form');
  
  // Form State
  const [companyName, setCompanyName] = useState('ILSUNG MEASUREMENT CO., LTD.');
  const [companyAddress, setCompanyAddress] = useState('65-1, Jwadong-ro, Haeundae-gu, Busan, Korea');
  const [contactPerson, setContactPerson] = useState('Han, Seung Jun');
  const [phoneEmail, setPhoneEmail] = useState('+82 10 2624 7623 / contact@ismm.co.kr');
  const [requestDate, setRequestDate] = useState('2026-11-10 @10:00');
  const [note, setNote] = useState('');
  
  // Items State (No. 5 Table)
  const [items, setItems] = useState([
    {
      id: 1,
      poNo: '4500012322',
      itemNo: '00010',
      qty: '25 pcs',
      drawingRev: 'PTAA015861 (Rev.0)',
      reportNo: 'IS261103-01',
      rae: '',
      ncr: ''
    }
  ]);

  // Request History State
  const [requests, setRequests] = useState([
    {
      id: 'REQ-2026-001',
      company: 'ILSUNG MEASUREMENT CO., LTD.',
      date: '2026-11-10 @10:00',
      status: 'Pending Review',
      itemsCount: 1,
      poNo: '4500012322',
      contact: 'Han, Seung Jun',
      note: '초도 검사 요청'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Add Item Row
  const addItemRow = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        poNo: '',
        itemNo: '',
        qty: '',
        drawingRev: '',
        reportNo: '',
        rae: '',
        ncr: ''
      }
    ]);
  };

  // Remove Item Row
  const removeItemRow = (id) => {
    if (items.length === 1) {
      alert('최소 1개의 품목 행은 유지되어야 합니다.');
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  // Update Item Field
  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // 7-day Advance Notice Validation
  const checkSevenDayRule = (dateStr) => {
    if (!dateStr) return false;
    const cleanDate = dateStr.split('@')[0].trim();
    const targetDate = new Date(cleanDate);
    const today = new Date();
    
    // Reset time for accurate day comparison
    today.setHours(0,0,0,0);
    targetDate.setHours(0,0,0,0);

    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays < 7;
  };

  const isUrgent = checkSevenDayRule(requestDate);

  // Auto-generated Subject (No. 1) - 백틱(``) 적용 완료
  const primaryPo = items[0]?.poNo || 'PO_NO';
  const primaryItem = items[0]?.itemNo || '00010';
 const generatedSubject = '[Inspection Request] ' + primaryPo + '-' + primaryItem + '_' + (companyName || 'COMPANY') + '_' + (requestDate || 'YYYY-MM-DD');

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert('검사 위치(업체명)를 입력해주세요.');
      return;
    }

    const newReq = {
      id: `REQ-2026-${String(requests.length + 1).padStart(3, '0')}`,
      company: companyName,
      date: requestDate,
      status: 'Pending Review',
      itemsCount: items.length,
      poNo: primaryPo,
      contact: contactPerson,
      note: note || '-'
    };

    setRequests([newReq, ...requests]);
    alert('검사 신청이 성공적으로 접수되었습니다!');
    setActiveTab('history');
  };

  // Filtered Requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.poNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">WinGD Supplier Inspection Portal</h1>
              <p className="text-xs text-slate-400">공급사 품질 검사 신청 및 일정 조율 시스템</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'form' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              검사 신청서 작성
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'history' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              신청 내역 및 관리 ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'calendar' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              검사 일정 현황
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TAB 1: Inspection Form */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Form Title Header */}
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-200 flex justify-between items-center flex-wrap gap-4">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Inspection Request Form</span>
                <h2 className="text-lg font-bold text-slate-900">신규 검사 신청서 등록</h2>
              </div>
              <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded border border-amber-200 shadow-sm">
                💡 규정 안내: 검사 신청은 <strong className="text-blue-600">일주일(7일) 전</strong>에 접수해 주시기 바랍니다.
              </div>
            </div>

            <div className="p-6 space-y-6">
              
              {/* No. 1: Basic Info & Subject */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="md:col-span-3 font-semibold text-sm text-slate-700 flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">1</span>
                  기본 정보 (Subject)
                </div>
                <div className="md:col-span-9">
                  <div className="text-xs font-medium text-slate-500 mb-1">메일 자동 생성 제목:</div>
                  <div className="bg-white p-3 rounded border border-blue-200 text-sm font-mono text-blue-900 font-semibold shadow-inner break-all">
                    {generatedSubject}
                  </div>
                </div>
              </div>

              {/* No. 2: Company Name / Location */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-4 border-b border-slate-100">
                <div className="md:col-span-3 font-semibold text-sm text-slate-700 flex items-center gap-2">
                  <span className="bg-slate-200 text-slate-700 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">2</span>
                  검사 위치 (업체명)
                </div>
                <div className="md:col-span-9">
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="업체명 및 주소 입력"
                    />
                  </div>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="상세 주소"
                  />
                </div>
              </div>

              {/* No. 3: QM Contact Person */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-4 border-b border-slate-100">
                <div className="md:col-span-3 font-semibold text-sm text-slate-700 flex items-center gap-2">
                  <span className="bg-slate-200 text-slate-700 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">3</span>
                  검사 진행 QM 담당자
                </div>
                <div className="md:col-span-9">
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="담당자 성명"
                    />
                  </div>
                </div>
              </div>

              {/* No. 4: Phone / Email */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-4 border-b border-slate-100">
                <div className="md:col-span-3 font-semibold text-sm text-slate-700 flex items-center gap-2">
                  <span className="bg-slate-200 text-slate-700 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">4</span>
                  연락처 / 이메일
                </div>
                <div className="md:col-span-9">
                  <div className="relative">
                    <PhoneCall className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={phoneEmail}
                      onChange={(e) => setPhoneEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="전화번호 / 이메일 주소"
                    />
                  </div>
                </div>
              </div>

              {/* No. 5: Detailed Items Table */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-700 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">5</span>
                    내용 상세 (Item Details)
                  </div>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> 품목 추가하기
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-xs border-b border-slate-200">
                        <th className="p-3 font-semibold">발주번호 (WinGD PO NO.)</th>
                        <th className="p-3 font-semibold w-24">Item No.</th>
                        <th className="p-3 font-semibold w-28">수량 (Qty)</th>
                        <th className="p-3 font-semibold">도면번호+개정번호 (Drawing & Rev.)</th>
                        <th className="p-3 font-semibold">제작사 리포트 번호 (Report No.)</th>
                        <th className="p-3 font-semibold w-24">변경승인 (RAE)</th>
                        <th className="p-3 font-semibold w-24">부적합 (NCR)</th>
                        <th className="p-3 font-semibold w-16 text-center">삭제</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.poNo}
                              onChange={(e) => updateItem(item.id, 'poNo', e.target.value)}
                              placeholder="예: 4500012322"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.itemNo}
                              onChange={(e) => updateItem(item.id, 'itemNo', e.target.value)}
                              placeholder="00010"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.qty}
                              onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                              placeholder="25 pcs"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.drawingRev}
                              onChange={(e) => updateItem(item.id, 'drawingRev', e.target.value)}
                              placeholder="PTAA015861 (Rev.0)"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.reportNo}
                              onChange={(e) => updateItem(item.id, 'reportNo', e.target.value)}
                              placeholder="IS261103-01"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.rae}
                              onChange={(e) => updateItem(e.id, 'rae', e.target.value)}
                              placeholder="-"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.ncr}
                              onChange={(e) => updateItem(item.id, 'ncr', e.target.value)}
                              placeholder="-"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItemRow(item.id)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                              title="행 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* No. 11: Inspection Date */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-4 border-t border-slate-100">
                <div className="md:col-span-3 font-semibold text-sm text-slate-700 flex items-center gap-2">
                  <span className="bg-slate-200 text-slate-700 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">11</span>
                  검사 신청일 (YYYY-MM-DD)
                </div>
                <div className="md:col-span-9">
                  <div className="relative max-w-md">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none ${
                        isUrgent ? 'border-red-300 bg-red-50/30 text-red-900 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                      }`}
                      placeholder="2026-11-10 @10:00"
                    />
                  </div>
                  {isUrgent ? (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1.5">
                      <AlertCircle className="w-4 h-4" />
                      주의: 선택하신 날짜가 일주일(7일) 미만 남은 긴급 검사 일정입니다.
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 mt-1.5">
                      형식: YYYY-MM-DD @HH:MM (예: 2026-11-10 @10:00)
                    </div>
                  )}
                </div>
              </div>

              {/* No. 12: Note / Special Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-4 border-b border-slate-100">
                <div className="md:col-span-3 font-semibold text-sm text-slate-700 flex items-center gap-2 pt-2">
                  <span className="bg-slate-200 text-slate-700 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">12</span>
                  특이사항 (Note)
                </div>
                <div className="md:col-span-9">
                  <textarea
                    rows="3"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="예: 긴급, 초도 검사, 납기 변경 등 특이사항을 입력하세요."
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all text-sm"
                >
                  <CheckCircle2 className="w-5 h-5" /> 검사 신청 접수하기
                </button>
              </div>

            </div>
          </form>
        )}

        {/* TAB 2: History & Management */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">검사 신청 내역 관리</h2>
                <p className="text-xs text-slate-500">접수된 모든 공급사 검사 신청 건을 확인하고 상태를 관리합니다.</p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="업체명 또는 PO 검색"
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="All">전체 상태</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Schedule Confirmed">Schedule Confirmed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-xs border-b border-slate-200">
                    <th className="p-4 font-semibold">신청 ID</th>
                    <th className="p-4 font-semibold">업체명 (Company)</th>
                    <th className="p-4 font-semibold">대표 PO 번호</th>
                    <th className="p-4 font-semibold">검사 신청일시</th>
                    <th className="p-4 font-semibold">담당자</th>
                    <th className="p-4 font-semibold">진행 상태</th>
                    <th className="p-4 font-semibold text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-medium text-blue-600">{req.id}</td>
                        <td className="p-4 font-semibold text-slate-900">{req.company}</td>
                        <td className="p-4 font-mono text-slate-600">{req.poNo}</td>
                        <td className="p-4 text-slate-600">{req.date}</td>
                        <td className="p-4 text-slate-600">{req.contact}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-medium text-[11px] ${
                            req.status === 'Pending Review' ? 'bg-amber-100 text-amber-800' :
                            req.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                            req.status === 'Schedule Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={req.status}
                            onChange={(e) => {
                              const updated = requests.map(r => r.id === req.id ? { ...r, status: e.target.value } : r);
                              setRequests(updated);
                            }}
                            className="px-2 py-1 border border-slate-300 rounded text-xs bg-white text-slate-700 focus:outline-none"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Schedule Confirmed">Schedule Confirmed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Export Bottom Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <div className="text-xs text-slate-500">
                총 접수 건수: <strong className="text-slate-800">{requests.length}건</strong>
              </div>
              <button
                onClick={() => alert('신청 내역이 CSV(엑셀) 파일로 다운로드되었습니다.')}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" /> 엑셀 다운로드 (CSV)
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Calendar Schedule View */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">검사 일정 캘린더 현황</h2>
                <p className="text-xs text-slate-500">2026년 11월 기준 예약된 검사 일정입니다.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-slate-600"><span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span> 검사 예정</span>
                <span className="flex items-center gap-1 text-xs text-slate-600 ml-2"><span className="w-3 h-3 bg-emerald-500 rounded-full inline-block"></span> 일정 확정</span>
              </div>
            </div>

            {/* Simple Month Grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                <div key={i} className="py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded">
                  {day}
                </div>
              ))}
              
              {/* Dummy Calendar Days for November 2026 */}
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
                const hasMatch = requests.some(r => r.date.includes(dateStr));
                
                return (
                  <div 
                    key={i} 
                    className={`min-h-[100px] p-2 border rounded-lg text-left flex flex-col justify-between transition-all ${
                      hasMatch ? 'bg-blue-50/40 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-700">{dayNum}</div>
                    {hasMatch && (
                      <div className="space-y-1 mt-1">
                        {requests.filter(r => r.date.includes(dateStr)).map(r => (
                          <div key={r.id} className="bg-blue-600 text-white text-[10px] p-1 rounded font-medium truncate" title={`${r.company} (${r.poNo})`}>
                            {r.company.split(' ')[0]} ({r.poNo})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
    // 파일 가장 맨 아래에 이 코드가 반드시 있어야 화면에 나타납니다!
import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
  );
}
