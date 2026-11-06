import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Calendar as CalendarIcon, 
  History, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Check, 
  X, 
  Lock, 
  Unlock,
  ChevronLeft,
  ChevronRight
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
    { poNo: '', itemNo: '', qty: '', drawingRev: '', reportNo: '', rae: '', ncr: '' }
  ]);

  const [isNoticeWarning, setIsNoticeWarning] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

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
      } else if (data) {
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
      setIsNoticeWarning(diffDays < 7);
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
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

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
      const { error } = await supabase.from('inspection_requests').insert([dbPayload]);
      if (error) throw error;

      showToast('검사 신청이 성공적으로 접수되었습니다!');
      setCompanyName('');
      setLocation('');
      setContactPerson('');
      setPhoneEmail('');
      setRequestDate('');
      setNote('');
      setItems([{ poNo: '', itemNo: '', qty: '', drawingRev: '', reportNo: '', rae: '', ncr: '' }]);
      
      await fetchRequests();
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
    const { error } = await supabase.from('inspection_requests').update({ status: newStatus }).eq('id', reqId);
    if (error) {
      showToast('상태 변경 중 오류가 발생했습니다.', 'error');
      return;
    }
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: newStatus } : r));
    showToast(`신청 상태가 [${newStatus}] (으)로 변경되었습니다.`);
  };

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month - 1, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(currentYear, currentMonth - 1, d));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-lg shadow-xl text-white font-medium ${
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
              <div className="p-2 bg-blue-600 rounded-lg text-white font-bold text-xl flex items-center justify-center">
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
              <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-md border border-slate-700 transition">
                인쇄
              </button>
              {isAdmin ? (
                <button onClick={handleAdminLogout} className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-md font-medium transition shadow">
                  <Unlock className="w-4 h-4" /> 관리자 모드 종료
                </button>
              ) : (
                <button onClick={() => setShowAdminLoginModal(true)} className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-md border border-slate-700 transition">
                  <Lock className="w-4 h-4" /> 관리자 로그인
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
                activeTab === 'new' ? 'border-blue-500 text-blue-400 bg-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" /> 검사 신청 작성 (New Request)
            </button>
            <button
              onClick={() => { if (!isAdmin) setShowAdminLoginModal(true); else setActiveTab('history'); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'history' ? 'border-blue-500 text-blue-400 bg-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-4 h-4" /> 신청 내역 및 관리 {isAdmin && `(${requests.length})`}
              {!isAdmin && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
            </button>
            <button
              onClick={() => { if (!isAdmin) setShowAdminLoginModal(true); else setActiveTab('calendar'); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'calendar' ? 'border-blue-500 text-blue-400 bg-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4" /> 검사 일정 현황 (Calendar View)
              {!isAdmin && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'new' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-600" /> 검사 신청서 작성 (Inspection Request Form)
            </h2>

            <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4">
              <label className="block text-xs font-semibold text-blue-900 mb-1">No. 1 기본 정보 (자동 생성 메일 제목)</label>
              <input type="text" readOnly value={generatedSubject} className="w-full bg-white border border-blue-300 rounded px-3 py-2 text-sm font-mono text-blue-950 font-medium" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1"><Building2 className="w-3.5 h-3.5 inline mr-1 text-slate-400" />공급사 업체명 *</label>
                <input type="text" required placeholder="예: WINGD CO., LTD." value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">검사 위치 및 주소 *</label>
                <input type="text" required placeholder="예: Busan, Korea" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">QM 담당자 *</label>
                <input type="text" required placeholder="예: Park, Gil Dong" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">연락처 / 이메일 *</label>
                <input type="text" required placeholder="예: +82 10 1234 5678" value={phoneEmail} onChange={(e) => setPhoneEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-700">품목 상세 내용</label>
                <button type="button" onClick={handleAddItem} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium border border-slate-300 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> 품목 추가
                </button>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b text-slate-700 uppercase font-semibold">
                    <tr>
                      <th className="p-3">발주번호 (PO NO.)</th>
                      <th className="p-3">Item No.</th>
                      <th className="p-3">수량</th>
                      <th className="p-3">도면번호</th>
                      <th className="p-3">리포트 번호</th>
                      <th className="p-3 text-center">삭제</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2"><input type="text" required placeholder="4500012322" value={item.poNo} onChange={(e) => handleItemChange(index, 'poNo', e.target.value)} className="w-full border rounded px-2 py-1 text-xs" /></td>
                        <td className="p-2"><input type="text" required placeholder="00010" value={item.itemNo} onChange={(e) => handleItemChange(index, 'itemNo', e.target.value)} className="w-full border rounded px-2 py-1 text-xs" /></td>
                        <td className="p-2"><input type="text" required placeholder="25 pcs" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} className="w-full border rounded px-2 py-1 text-xs" /></td>
                        <td className="p-2"><input type="text" placeholder="PTAA015861" value={item.drawingRev} onChange={(e) => handleItemChange(index, 'drawingRev', e.target.value)} className="w-full border rounded px-2 py-1 text-xs" /></td>
                        <td className="p-2"><input type="text" placeholder="IS261103-01" value={item.reportNo} onChange={(e) => handleItemChange(index, 'reportNo', e.target.value)} className="w-full border rounded px-2 py-1 text-xs" /></td>
                        <td className="p-2 text-center"><button type="button" onClick={() => handleRemoveItem(index)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">희망 검사 신청일 *</label>
                <input type="date" required value={requestDate} onChange={(e) => setRequestDate(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
                {isNoticeWarning && <p className="text-xs text-amber-700 mt-1">⚠️ 7일 미만 긴급 신청입니다.</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">희망 검사 시간 *</label>
                <select value={requestTime} onChange={(e) => setRequestTime(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:30">01:30 PM</option>
                  <option value="14:00">02:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">특이사항 (Note)</label>
              <textarea rows={3} placeholder="특이사항을 적어주세요." value={note} onChange={(e) => setNote(e.target.value)} className="w-full border rounded-md p-3 text-sm" />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow flex items-center gap-1.5">
                <Check className="w-4 h-4" /> 검사 신청 제출
              </button>
            </div>
          </form>
        )}

        {activeTab === 'history' && isAdmin && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">신청 내역 관리 목록 ({requests.length}건)</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="p-3">신청번호</th>
                    <th className="p-3">업체명</th>
                    <th className="p-3">QM 담당자</th>
                    <th className="p-3">검사 요청일</th>
                    <th className="p-3">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono">{req.id}</td>
                      <td className="p-3 font-medium">{req.companyName}</td>
                      <td className="p-3">{req.contactPerson}</td>
                      <td className="p-3">{req.requestDate} {req.requestTime}</td>
                      <td className="p-3">
                        <select value={req.status} onChange={(e) => handleStatusChange(req.id, e.target.value)} className="border rounded px-2 py-1 text-xs">
                          <option value="Pending Review">검토중 (Pending)</option>
                          <option value="Approved">승인 완료 (Approved)</option>
                          <option value="Schedule Confirmed">일정 확정 (Confirmed)</option>
                          <option value="Rejected">반려 (Rejected)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && isAdmin && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">{currentYear}년 {currentMonth}월 검사 일정 현황</h3>
              <div className="flex gap-2">
                <button onClick={() => { if(currentMonth===1){setCurrentYear(currentYear-1); setCurrentMonth(12);}else{setCurrentMonth(currentMonth-1);} }} className="p-2 border rounded hover:bg-slate-100"><ChevronLeft className="w-4 h-4"/></button>
                <button onClick={() => { if(currentMonth===12){setCurrentYear(currentYear+1); setCurrentMonth(1);}else{setCurrentMonth(currentMonth+1);} }} className="p-2 border rounded hover:bg-slate-100"><ChevronRight className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center font-semibold text-xs text-slate-600 bg-slate-100 p-2 rounded">
              <div>일 (Sun)</div><div>월 (Mon)</div><div>화 (Tue)</div><div>수 (Wed)</div><div>목 (Thu)</div><div>금 (Fri)</div><div>토 (Sat)</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                const dateStr = day ? day.toISOString().split('T')[0] : '';
                const dayRequests = requests.filter(r => r.requestDate === dateStr);
                return (
                  <div key={idx} className={`min-h-[100px] border rounded-lg p-2 flex flex-col justify-between ${day ? 'bg-white' : 'bg-slate-50'}`}>
                    <div className="text-xs font-bold text-slate-700">{day ? day.getDate() : ''}</div>
                    <div className="space-y-1 overflow-y-auto max-h-[80px]">
                      {dayRequests.map(req => (
                        <div key={req.id} className="text-[10px] bg-blue-50 text-blue-700 p-1 rounded border border-blue-200 truncate">
                          {req.requestTime} {req.companyName}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">관리자 인증</h3>
              <button onClick={() => setShowAdminLoginModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">관리자 비밀번호</label>
                <input type="password" placeholder="비밀번호 입력 (1002)" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" autoFocus />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAdminLoginModal(false)} className="px-4 py-2 text-xs bg-slate-100 rounded-md">취소</button>
                <button type="submit" className="px-4 py-2 text-xs text-white bg-blue-600 rounded-md">로그인</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
