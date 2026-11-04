import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ClipboardList, 
  Calendar as CalendarIcon, 
  History, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Download, 
  Printer, 
  Building2, 
  User, 
  PhoneCall, 
  Clock, 
  FileText, 
  ChevronRight,
  Info,
  Check,
  X,
  Filter,
  Lock,
  Unlock,
  ShieldCheck,
  MapPin
} from 'lucide-react';

const INITIAL_REQUESTS = [
  {
    id: "REQ-20261103-01",
    basicInfo: "[Inspection Request] 4500012322-10_ILSUNG MEASUREMENT CO., LTD._2026-11-10",
    companyName: "ILSUNG MEASUREMENT CO., LTD.",
    location: "65-1, Jwadong-ro, Haeundae-gu, Busan, Korea",
    contactPerson: "Han, Seung Jun",
    phoneEmail: "+82 10 2624 7623 / contact@ismm.co.kr",
    requestDate: "2026-11-10",
    requestTime: "10:00",
    status: "Approved", 
    createdDate: "2026-11-03",
    note: "Initial inspection for WinGD main engine sub-assembly parts.",
    items: [
      {
        poNo: "4500012322",
        itemNo: "00010",
        qty: "25 pcs",
        drawingRev: "PTAA015861 (Rev.0)",
        reportNo: "IS261103-01",
        rae: "-",
        ncr: "-"
      }
    ]
  },
  {
    id: "REQ-20261102-02",
    basicInfo: "[Inspection Request] 4500098711-20_HYUNDAI HEAVY IND._2026-11-15",
    companyName: "HYUNDAI HEAVY IND. (Ulsan Plant)",
    location: "1, Myeongdeok-ro, Dong-gu, Ulsan, Korea",
    contactPerson: "Kim, Min Soo",
    phoneEmail: "+82 52 202 1234 / mskim@hhi.co.kr",
    requestDate: "2026-11-15",
    requestTime: "14:00",
    status: "Schedule Confirmed",
    createdDate: "2026-11-02",
    note: "Urgent shipment inspection required.",
    items: [
      {
        poNo: "4500098711",
        itemNo: "00020",
        qty: "100 pcs",
        drawingRev: "HYU-99482 (Rev.2)",
        reportNo: "HHI-2026-882",
        rae: "APPROVED-04",
        ncr: "-"
      }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('new');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11);
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phoneEmail, setPhoneEmail] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [requestTime, setRequestTime] = useState('10:00');
  const [note, setNote] = useState('');
  const [items, setItems] = useState([
    { poNo: '', itemNo: '', qty: '', drawingRev: '', reportNo: '', rae: '', ncr: '' }
  ]);
  const [isNoticeWarning, setIsNoticeWarning] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedDetailRequest, setSelectedDetailRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const primaryPo = items[0]?.poNo || 'PO_NO';
  const primaryItem = items[0]?.itemNo || '00010';
  const generatedSubject = `[Inspection Request] ${primaryPo}-${primaryItem}_${companyName || 'COMPANY'}_${requestDate || 'YYYY-MM-DD'}`;

  useEffect(() => {
    if (requestDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(requestDate);
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        setIsNoticeWarning(true);
      } else {
        setIsNoticeWarning(false);
      }
    }
  }, [requestDate]);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { poNo: items[items.length - 1]?.poNo || '', itemNo: '', qty: '', drawingRev: '', reportNo: '', rae: '', ncr: '' }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      showToast('최소 1개 이상의 항목이 필요합니다.', 'error');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!requestDate || !companyName || !contactPerson) {
      showToast('필수 정보를 모두 입력해 주세요.', 'error');
      return;
    }
    const newReq = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      basicInfo: generatedSubject,
      companyName,
      location,
      contactPerson,
      phoneEmail,
      requestDate,
      requestTime,
      status: 'Pending Review',
      createdDate: new Date().toISOString().split('T')[0],
      note,
      items: [...items]
    };
    setRequests([newReq, ...requests]);
    showToast('검사 신청이 성공적으로 접수되었습니다!');
    setCompanyName('');
    setLocation('');
    setContactPerson('');
    setPhoneEmail('');
    setRequestDate('');
    setNote('');
    setItems([{ poNo: '', itemNo: '', qty: '', drawingRev: '', reportNo: '', rae: '', ncr: '' }]);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === '1002') {
      setIsAdmin(true);
      setShowAdminLoginModal(false);
      setAdminPassword('');
      setActiveTab('history');
      showToast('관리자 모드로 전환되었습니다.');
    } else {
      showToast('관리자 비밀번호가 틀렸습니다.', 'error');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setActiveTab('new');
    showToast('일반 공급사 모드로 전환되었습니다.');
  };

  const handleStatusChange = (reqId, newStatus) => {
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: newStatus } : r));
    if (selectedDetailRequest && selectedDetailRequest.id === reqId) {
      setSelectedDetailRequest({ ...selectedDetailRequest, status: newStatus });
    }
    showToast(`신청 상태가 [${newStatus}] (으)로 변경되었습니다.`);
  };

  const handleExportCSV = () => {
    const headers = ["신청번호", "기본정보", "업체명", "QM 담당자", "검사요청일", "상태", "PO번호", "품번", "수량"];
    const rows = [];
    requests.forEach(req => {
      req.items.forEach(it => {
        rows.push([
          req.id,
          `"${req.basicInfo}"`,
          `"${req.companyName}"`,
          `"${req.contactPerson}"`,
          `${req.requestDate} ${req.requestTime}`,
          req.status,
          it.poNo,
          it.itemNo,
          `"${it.qty}"`
        ]);
      });
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Inspection_Requests_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.basicInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.items.some(i => i.poNo.includes(searchTerm) || i.itemNo.includes(searchTerm));
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-lg shadow-xl text-white font-medium transition-all duration-300 ${
          toastMessage.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toastMessage.type === 'error' ? <AlertTriangle className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white font-bold text-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Supplier Inspection Request Portal
                  <span className="text-xs bg-blue-500/20 text-blue-300 font-medium px-2 py-0.5 rounded border border-blue-500/30">
                    공급사 검사 신청 시스템
                  </span>
                </h1>
                <p className="text-xs text-slate-400">품질검사 일정 관리 및 검사 신청 자동화 플랫폼</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin ? (
                <button 
                  onClick={handleAdminLogout}
                  className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-md font-medium transition shadow"
                >
                  <Unlock className="w-4 h-4" />
                  관리자 모드 종료
                </button>
              ) : (
                <button 
                  onClick={() => setShowAdminLoginModal(true)}
                  className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-md border border-slate-700 transition"
                >
                  <Lock className="w-4 h-4" />
                  관리자 로그인
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 border-t border-slate-700/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'new'
                  ? 'border-blue-500 text-blue-400 bg-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Plus className="w-4 h-4" />
              검사 신청 작성 (New Request)
            </button>

            <button
              onClick={() => {
                if (!isAdmin) {
                  setShowAdminLoginModal(true);
                } else {
                  setActiveTab('history');
                }
              }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-400 bg-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4" />
              신청 내역 및 관리 {isAdmin && `(${requests.length})`}
              {!isAdmin && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                if (!isAdmin) {
                  setShowAdminLoginModal(true);
                } else {
                  setActiveTab('calendar');
                }
              }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-400 bg-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              검사 일정 현황 (Calendar View)
              {!isAdmin && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'new' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-amber-900">
                  <p className="font-semibold">검사 신청 준수 사항 (Notice)</p>
                  <p className="mt-0.5 text-amber-800">
                    검사 신청은 원활한 일정 조율 및 QM 담당자 배정을 위해 <strong className="underline">최소 1주일(7일) 전</strong>에 신청해 주시기 바랍니다.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    검사 신청서 작성 (Inspection Request Form)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">모든 협력사가 접속하여 검사 요청 정보를 입력할 수 있는 공용 포탈입니다.</p>
                </div>
                <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  * 표시 항목은 필수 입력 사항입니다.
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4">
                  <label className="block text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
                    No. 1 기본 정보 (Basic Info) - 자동 생성 메일 제목
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={generatedSubject} 
                      className="w-full bg-white border border-blue-300 rounded px-3 py-2 text-sm font-mono text-blue-950 font-medium shadow-inner focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      공급사 업체명 (Company Name) *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="예: WINGD CO., LTD."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      No. 2 검사 위치 및 주소 (Location) *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="예: 8, Park Young-jun-gil, Busan, Korea"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      No. 3 검사 진행 QM 담당자 (Contact Person) *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="예: Park, Gil Dong"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                      No. 4 연락처 / 이메일 (Phone / Email) *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="예: +82 10 1234 5678 / wingd@wingd.co.kr"
                      value={phoneEmail}
                      onChange={(e) => setPhoneEmail(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      No. 5 내용 상세 (Item Description Table)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium border border-slate-300 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      품목 추가 (Add Line)
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-amber-50/70 border-b border-slate-200 text-slate-700 uppercase font-semibold">
                        <tr>
                          <th className="p-3 border-r border-slate-200 min-w-[120px]">발주번호 (PO NO.)</th>
                          <th className="p-3 border-r border-slate-200 min-w-[90px]">Item No.</th>
                          <th className="p-3 border-r border-slate-200 min-w-[100px]">수량 (Qty)</th>
                          <th className="p-3 border-r border-slate-200 min-w-[160px]">도면번호+개정번호</th>
                          <th className="p-3 border-r border-slate-200 min-w-[150px]">리포트 번호</th>
                          <th className="p-3 border-r border-slate-200 min-w-[110px]">RAE</th>
                          <th className="p-3 border-r border-slate-200 min-w-[110px]">NCR</th>
                          <th className="p-3 text-center min-w-[50px]">삭제</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {items.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50/50">
                            <td className="p-2 border-r border-slate-200">
                              <input 
                                type="text"
                                required
                                placeholder="4500012322"
                                value={item.poNo}
                                onChange={(e) => handleItemChange(index, 'poNo', e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </td>
                            <td className="p-2 border-r border-slate-200">
                              <input 
                                type="text"
                                required
                                placeholder="00010"
                                value={item.itemNo}
                                onChange={(e) => handleItemChange(index, 'itemNo', e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </td>
                            <td className="p-2 border-r border-slate-200">
                              <input 
                                type="text"
                                required
                                placeholder="25 pcs"
                                value={item.qty}
                                onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </td>
                            <td className="p-2 border-r border-slate-200">
                              <input 
                                type="text"
                                placeholder="PTAA015861 (Rev.0)"
                                value={item.drawingRev}
                                onChange={(e) => handleItemChange(index, 'drawingRev', e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </td>
                            <td className="p-2 border-r border-slate-200">
                              <input 
                                type="text"
                                placeholder="IS261103-01"
                                value={item.reportNo}
                                onChange={(e) => handleItemChange(index, 'reportNo', e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </td>
                            <td className="p-2 border-r border-slate-200">
                              <input 
                                type="text"
                                placeholder="승인번호"
                                value={item.rae}
                                onChange={(e) => handleItemChange(index, 'rae', e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </td>
                            <td className="p-2 border-r border-slate-200">
                              <input 
                                type="text"
                                placeholder="NCR 번호"
                                value={item.ncr}
                                onChange={(e) => handleItemChange(index, 'ncr', e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded transition"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      No. 11 희망 검사 신청일 (Inspection Date) *
                    </label>
                    <input 
                      type="date"
                      required
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm outline-none transition ${
                        isNoticeWarning 
                          ? 'border-amber-400 bg-amber-50/30 focus:ring-2 focus:ring-amber-500' 
                          : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {isNoticeWarning && (
                      <p className="text-xs text-amber-700 mt-1 font-medium">
                        ⚠️ 일주일(7일) 미만의 긴급 신청입니다. 사전 협의가 필요합니다.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      희망 검사 시간 (Inspection Time) *
                    </label>
                    <select
                      value={requestTime}
                      onChange={(e) => setRequestTime(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:30">01:30 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    No. 12 특이사항 (Note)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="특이사항이나 전달 요청사항을 적어주세요."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border border-slate-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  검사 신청 제출 (Submit Request)
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'history' && isAdmin && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="PO 번호, 업체명 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ALL">전체 상태</option>
                      <option value="Pending Review">검토중 (Pending)</option>
                      <option value="Approved">승인 완료 (Approved)</option>
                      <option value="Schedule Confirmed">일정 확정 (Confirmed)</option>
                      <option value="Rejected">반려 (Rejected)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3.5 py-2 rounded-lg shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    엑셀 내보내기 (CSV)
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">신청 ID</th>
                      <th className="p-3">공급사명</th>
                      <th className="p-3">검사요청일</th>
                      <th className="p-3">담당자</th>
                      <th className="p-3">상태 변경 (관리자)</th>
                      <th className="p-3 text-center">상세</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          등록된 신청 내역이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-mono font-medium text-slate-900">{req.id}</td>
                          <td className="p-3 font-semibold text-slate-800">{req.companyName}</td>
                          <td className="p-3 font-mono text-slate-700">{req.requestDate} @ {req.requestTime}</td>
                          <td className="p-3 text-slate-600">{req.contactPerson}</td>
                          <td className="p-3">
                            <select
                              value={req.status}
                              onChange={(e) => handleStatusChange(req.id, e.target.value)}
                              className="text-xs border rounded px-2 py-1 bg-white font-medium text-slate-700 focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="Pending Review">검토중</option>
                              <option value="Approved">승인 완료</option>
                              <option value="Schedule Confirmed">일정 확정</option>
                              <option value="Rejected">반려</option>
                            </select>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setSelectedDetailRequest(req)}
                              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5 hover:underline"
                            >
                              보기 <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && isAdmin && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  {currentYear}년 {currentMonth}월 검사 일정 현황 (Calendar View)
                </h2>
                
                <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 rounded-lg p-1">
                  <button 
                    onClick={handlePrevMonth}
                    className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-white rounded shadow-sm transition"
                  >
                    ◀ 이전달
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-white rounded shadow-sm transition"
                  >
                    다음달 ▶
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> 검토중
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> 승인완료
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> 일정확정
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> 반려
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center font-bold text-xs text-slate-600 py-3">
                <div className="text-red-500">일 (Sun)</div>
                <div>월 (Mon)</div>
                <div>화 (Tue)</div>
                <div>수 (Wed)</div>
                <div>목 (Thu)</div>
                <div>금 (Fri)</div>
                <div className="text-blue-500">토 (Sat)</div>
              </div>

              <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 bg-white">
                {[...Array(new Date(currentYear, currentMonth, 0).getDate())].map((_, dayIdx) => {
                  const dayNum = dayIdx + 1;
                  const monthStr = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
                  const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                  const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
                  const dayReqs = requests.filter(r => r.requestDate === dateStr);

                  return (
                    <div 
                      key={dayNum} 
                      className="min-h-[120px] p-2 hover:bg-slate-50/80 transition flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          (dayIdx % 7 === 0) ? 'text-red-500' : (dayIdx % 7 === 6) ? 'text-blue-500' : 'text-slate-700'
                        }`}>
                          {dayNum}
                        </span>
                        {dayReqs.length > 0 && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold rounded-full px-2 py-0.5 border border-blue-200">
                            {dayReqs.length}건
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[90px]">
                        {dayReqs.map((req) => (
                          <div 
                            key={req.id}
                            onClick={() => setSelectedDetailRequest(req)}
                            className={`text-[11px] p-2 rounded-lg cursor-pointer border shadow-sm transition transform hover:-translate-y-0.5 ${
                              req.status === 'Schedule Confirmed' 
                                ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                                : req.status === 'Approved'
                                ? 'bg-blue-50 text-blue-950 border-blue-300 hover:bg-blue-100'
                                : req.status === 'Rejected'
                                ? 'bg-red-50 text-red-950 border-red-300 hover:bg-red-100'
                                : 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>{req.requestTime}</span>
                              <span className="text-[9px] opacity-75 font-normal">{req.items[0]?.poNo}</span>
                            </div>
                            <div className="truncate font-semibold mt-0.5">{req.companyName}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {showAdminLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" /> 관리자 권한 인증
              </h3>
              <button onClick={() => setShowAdminLoginModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">관리자 비밀번호</label>
                <input 
                  type="password"
                  required
                  placeholder="관리자 비밀번호를 입력하세요"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAdminLoginModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded font-semibold"
                >
                  로그인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedDetailRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center rounded-t-xl sticky top-0 z-10">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  검사 신청 상세 정보 ({selectedDetailRequest.id})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedDetailRequest.basicInfo}</p>
              </div>
              <button onClick={() => setSelectedDetailRequest(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">공급사명:</span>
                  <span className="font-semibold text-slate-800 text-sm">{selectedDetailRequest.companyName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">QM 담당자:</span>
                  <span className="font-semibold text-slate-800 text-sm">{selectedDetailRequest.contactPerson} ({selectedDetailRequest.phoneEmail})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">검사 요청일시:</span>
                  <span className="font-semibold text-blue-700 text-sm">{selectedDetailRequest.requestDate} @ {selectedDetailRequest.requestTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">현재 상태:</span>
                  <span className="font-semibold text-emerald-700 text-sm">{selectedDetailRequest.status}</span>
                </div>
                <div className="sm:col-span-2 border-t border-slate-200 pt-2.5">
                  <span className="text-slate-400 block text-[11px] mb-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> 검사 위치 및 주소:
                  </span>
                  <span className="font-medium text-slate-800">{selectedDetailRequest.location || '-'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                  No. 5 내용 상세 (Item Description Table)
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-amber-50/70 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                      <tr>
                        <th className="p-2.5 border-r border-slate-200">발주번호 (PO NO.)</th>
                        <th className="p-2.5 border-r border-slate-200">Item No.</th>
                        <th className="p-2.5 border-r border-slate-200">수량 (Qty)</th>
                        <th className="p-2.5 border-r border-slate-200">도면번호+개정번호</th>
                        <th className="p-2.5 border-r border-slate-200">리포트 번호</th>
                        <th className="p-2.5 border-r border-slate-200">RAE</th>
                        <th className="p-2.5">NCR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {selectedDetailRequest.items && selectedDetailRequest.items.length > 0 ? (
                        selectedDetailRequest.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2.5 border-r border-slate-200 font-mono font-medium">{item.poNo || '-'}</td>
                            <td className="p-2.5 border-r border-slate-200 font-mono">{item.itemNo || '-'}</td>
                            <td className="p-2.5 border-r border-slate-200 font-semibold">{item.qty || '-'}</td>
                            <td className="p-2.5 border-r border-slate-200">{item.drawingRev || '-'}</td>
                            <td className="p-2.5 border-r border-slate-200">{item.reportNo || '-'}</td>
                            <td className="p-2.5 border-r border-slate-200">{item.rae || '-'}</td>
                            <td className="p-2.5">{item.ncr || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-slate-400">품목 정보가 없습니다.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedDetailRequest.note && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3.5 space-y-1">
                  <span className="font-semibold text-amber-900 block text-xs flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-amber-600" /> 특이사항 (Note):
                  </span>
                  <p className="text-slate-700 text-xs whitespace-pre-line">{selectedDetailRequest.note}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedDetailRequest(null)}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition shadow-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 WinGD Supplier Inspection Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
