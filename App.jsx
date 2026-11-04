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
  ShieldCheck
} from 'lucide-react';

// 초기 샘플 데이터
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
  const [activeTab, setActiveTab] = useState('new'); // 'new', 'history', 'calendar'
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  
  // 관리자 인증 상태 (비밀번호: 1002)
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // 캘린더 월 이동 상태
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11); // 11월

  // 폼 상태 관리
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phoneEmail, setPhoneEmail] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [requestTime, setRequestTime] = useState('10:00');
  const [note, setNote] = useState('');
  
  // 테이블 품목 목록 상태
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

  // 알림 상태
  const [isNoticeWarning, setIsNoticeWarning] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedDetailRequest, setSelectedDetailRequest] = useState(null);

  // 내역 검색 및 필터
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // 메일 제목 자동 생성
  const primaryPo = items[0]?.poNo || 'PO_NO';
  const primaryItem = items[0]?.itemNo || '00010';
  const generatedSubject = `[Inspection Request] ${primaryPo}-${primaryItem}_${companyName || 'COMPANY'}_${requestDate || 'YYYY-MM-DD'}`;

  // 7일 규칙 검사
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

  // 캘린더 월 이동 함수
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
    
    // 폼 초기화
    setCompanyName('');
    setLocation('');
    setContactPerson('');
    setPhoneEmail('');
    setRequestDate('');
    setNote('');
    setItems([{ poNo: '', itemNo: '', qty: '', drawingRev: '', reportNo: '', rae: '', ncr: '' }]);
  };

  // 관리자 로그인 처리 (비밀번호: 1002)
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

  // 관리자 상태 변경 기능
  const handleStatusChange = (reqId, newStatus) => {
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: newStatus } : r));
    if (selectedDetailRequest && selectedDetailRequest.id === reqId) {
      setSelectedDetailRequest({ ...selectedDetailRequest, status: newStatus });
    }
    showToast(`신청 상태가 [${newStatus}] (으)로 변경되었습니다.`);
  };

  // CSV 내보내기 기능
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

  // 필터링된 내역
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
      {/* 알림 토스트 */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-lg shadow-xl text-white font-medium transition-all duration-300 ${
          toastMessage.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toastMessage.type === 'error' ? <AlertTriangle className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* 헤더 */}
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

        {/* 탭 네비게이션 */}
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
              신청 내역 및 관리 {isAdmin &&
