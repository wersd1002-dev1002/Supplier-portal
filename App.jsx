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
import { supabase } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('new');
  const [requests, setRequests] = useState([]);
  
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
    {
      poNo: '',
      itemNo: '',
      qty: '',
      drawingRev: '',
      reportNo: '',
      rae: '',
      ncr: ''
    }
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
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('inspection_requests')
        .select('*')
        .order('created_date', { ascending: false });
      
      if (error) {
        console.error('데이터 조회 오류:', error.message);
      } else if (data && data.length > 0) {
        const formattedData = data.map(row => ({
          id: row.id,
          basicInfo: row.basic_info,
          companyName: row.company_name,
          location: row.location,
          contactPerson: row.contact_person,
          phoneEmail: row.phone_email,
          requestDate: row.request_date,
          requestTime: row.request_time,
          status: row.status,
          createdDate: row.created_date,
          note: row.note,
          items: row.items || []
        }));
        setRequests(formattedData);
      }
    } catch (err) {
      console.error('서버 통신 실패:', err);
    }
  };

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
      {
        poNo: items[items.length - 1]?.poNo || '',
        itemNo: '',
        qty: '',
        drawingRev: '',
        reportNo: '',
        rae: '',
        ncr: ''
      }
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

  // ✅ 오류를 완벽히 해결한 단 하나의 통합 handleSubmit 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newReqId = `REQ-${Date.now().toString().slice(-6)}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const dbPayload = {
      id: newReqId,
      basic_info: generatedSubject,
      company_name: companyName,
      location: location,
      contact_person: contactPerson,
      phone_email: phoneEmail,
      request_date: requestDate,
      request_time: requestTime,
      status: 'Pending Review',
      created_date: todayStr,
      note: note,
      items: items
    };

    try {
      const { error } = await supabase
        .from('inspection_requests')
        .insert([dbPayload]);

      if (error) {
        throw error;
      }

      const clientReq = {
        id: newReqId,
        basicInfo: generatedSubject,
        companyName,
        location,
        contactPerson,
        phoneEmail,
        requestDate,
        requestTime,
        status: 'Pending Review',
        createdDate: todayStr,
        note,
        items: [...items]
      };

      setRequests([clientReq, ...requests]);
      showToast('검사 신청이 성공적으로 접수되었습니다!');
      
      setCompanyName('');
      setLocation('');
      setContactPerson('');
      setPhoneEmail('');
      setRequestDate('');
      setNote('');
      setItems([{ poNo: '', itemNo: '', qty: '', drawingRev: '', reportNo: '', rae: '', ncr: '' }]);
    } catch (err) {
      console.error('저장 실패:', err.message);
      showToast('데이터 저장 중 오류가 발생했습니다: ' + err.message, 'error');
    }
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

  const handleStatusChange = async (reqId, newStatus) => {
    const { error } = await supabase
      .from('inspection_requests')
      .update({ status: newStatus })
      .eq('id', reqId);

    if (error) {
      showToast('상태 변경 중 오류가 발생했습니다.', 'error');
      return;
    }

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
                      placeholder="예: +82 10 1234 5678 / weingd@wingd.co.kr"
                      value={phoneEmail}
                      onChange={(e) => setPhoneEmail(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-
