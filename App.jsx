import React, { useState, useEffect } from 'react';
import { ClipboardList, History, Plus, Trash2, CheckCircle2, AlertTriangle, Building2, Check, X, Lock, Unlock } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('new');
  const [requests, setRequests] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

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

  const [toastMessage, setToastMessage] = useState(null);

  const primaryPo = items[0]?.poNo || 'PO_NO';
  const primaryItem = items[0]?.itemNo || '00010';
  const generatedSubject = `[Inspection Request] ${primaryPo}-${primaryItem}_${companyName || 'COMPANY'}_${requestDate || 'YYYY-MM-DD'}`;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase.from('inspection_requests').select('*').order('created_date', { ascending: false });
      if (!error && data) {
        setRequests(data.map(row => ({
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
        })));
      }
    } catch (err) { console.error(err); }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReqId = `REQ-${Date.now().toString().slice(-6)}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const dbPayload = {
      id: newReqId,
      basic_info: generatedSubject,
      company_name: companyName,
      location,
      contact_person: contactPerson,
      phone_email: phoneEmail,
      request_date: requestDate,
      request_time: requestTime,
      status: 'Pending Review',
      created_date: todayStr,
      note,
      items
    };

    try {
      const { error } = await supabase.from('inspection_requests').insert([dbPayload]);
      if (error) throw error;
      showToast('검사 신청이 성공적으로 접수되었습니다!');
      setCompanyName(''); setLocation(''); setContactPerson(''); setPhoneEmail(''); setRequestDate(''); setNote('');
      setItems([{ poNo: '', itemNo: '', qty: '', drawingRev: '', reportNo: '', rae: '', ncr: '' }]);
      fetchRequests();
    } catch (err) {
      showToast('저장 실패: ' + err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-lg shadow-xl text-white font-medium ${toastMessage.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          <span>{toastMessage.msg}</span>
        </div>
      )}

      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white font-bold text-xl"><ClipboardList className="w-6 h-6" /></div>
            <div>
              <h1 className="text-lg font-bold">Supplier Inspection Request Portal</h1>
              <p className="text-xs text-slate-400">품질검사 일정 관리 및 검사 신청 자동화 플랫폼</p>
            </div>
          </div>
          <div>
            {isAdmin ? (
              <button onClick={() => { setIsAdmin(false); setActiveTab('new'); }} className="flex items-center gap-1.5 text-xs bg-amber-600 px-3 py-2 rounded-md font-medium text-white">
                <Unlock className="w-4 h-4" /> 관리자 모드 종료
              </button>
            ) : (
              <button onClick={() => setShowAdminLoginModal(true)} className="flex items-center gap-1.5 text-xs bg-slate-800 px-3 py-2 rounded-md border border-slate-700 text-slate-200">
                <Lock className="w-4 h-4" /> 관리자 로그인
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-800/80 border-t border-slate-700/60 px-4 sm:px-6 lg:px-8 flex space-x-1">
          <button onClick={() => setActiveTab('new')} className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'new' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}>검사 신청 작성</button>
          <button onClick={() => { if (!isAdmin) setShowAdminLoginModal(true); else setActiveTab('history'); }} className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'history' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}>
            신청 내역 및 관리 {!isAdmin && <Lock className="w-3 h-3 inline ml-1 text-amber-400" />}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'new' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-blue-600" /> 검사 신청서 작성</h2>

            <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4">
              <label className="block text-xs font-semibold text-blue-900 mb-1">No. 1 기본 정보 (자동 생성 메일 제목)</label>
              <input type="text" readOnly value={generatedSubject} className="w-full bg-white border border-blue-300 rounded px-3 py-2 text-sm font-mono text-blue-950 font-medium" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">공급사 업체명 *</label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">희망 검사 신청일 *</label>
                <input type="date" required value={requestDate} onChange={(e) => setRequestDate(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">희망 검사 시간 *</label>
                <select value={requestTime} onChange={(e) => setRequestTime(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
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
                      <td className="p-3"><span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">{req.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            
            <form onSubmit={(e) => { e.preventDefault(); if (adminPassword === '1002') { setIsAdmin(true); setShowAdminLoginModal(false); setAdminPassword(''); setActiveTab('history'); showToast('관리자 모드로 전환되었습니다.'); } else { showToast('비밀번호가 틀렸습니다.', 'error'); } }} className="space-y-4">
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
