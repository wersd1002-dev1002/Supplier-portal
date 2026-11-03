import React, { useState, useEffect } from 'react';
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
Filter
} from 'lucide-react';

// Initial Mock Data based on the provided table snippet
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
status: "Approved", // Pending, Approved, Schedule Confirmed, Rejected
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
},
{
poNo: "4500098711",
itemNo: "00030",
qty: "50 pcs",
drawingRev: "HYU-99483 (Rev.1)",
reportNo: "HHI-2026-883",
rae: "-",
ncr: "-"
}
]
}
];

export default function App() {
const [activeTab, setActiveTab] = useState('new'); // 'new', 'history', 'calendar'
const [requests, setRequests] = useState(INITIAL_REQUESTS);

// Form State
const [companyName, setCompanyName] = useState('ILSUNG MEASUREMENT CO., LTD.');
const [location, setLocation] = useState('65-1, Jwadong-ro, Haeundae-gu, Busan, Korea');
const [contactPerson, setContactPerson] = useState('Han, Seung Jun');
const [phoneEmail, setPhoneEmail] = useState('+82 10 2624 7623 / contact@ismm.co.kr');
const [requestDate, setRequestDate] = useState('2026-11-12');
const [requestTime, setRequestTime] = useState('10:00');
const [note, setNote] = useState('');

// Table items state
const [items, setItems] = useState([
{
poNo: '4500012322',
itemNo: '00010',
qty: '25 pcs',
drawingRev: 'PTAA015861 (Rev.0)',
reportNo: 'IS261103-01',
rae: '',
ncr: ''
}
]);

// Alert & Notice state
const [isNoticeWarning, setIsNoticeWarning] = useState(false);
const [toastMessage, setToastMessage] = useState(null);
const [selectedDetailRequest, setSelectedDetailRequest] = useState(null);

// Search & Filters for History
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('ALL');

// Auto-generate Basic Info format
const primaryPo = items[0]?.poNo || 'PO_NO';
const primaryItem = items[0]?.itemNo || '00010';
const generatedSubject = `[Inspection Request] ${primaryPo}-${primaryItem}_${companyName || 'COMPANY'}_${requestDate || 'YYYY-MM-DD'}`;

// Check 7-day rule on date change
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
setActiveTab('history');

// Reset Form to Default Template
setNote('');


};

// CSV Export logic
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

// Filtered History
const filteredRequests = requests.filter(req => {
const matchesSearch =
req.basicInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
req.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
req.items.some(i => i.poNo.includes(searchTerm) || i.itemNo.includes(searchTerm));

const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
return matchesSearch && matchesStatus;


});

return (

{/* Toast Notification */}
{toastMessage && (
<div className={fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-lg shadow-xl text-white font-medium transition-all duration-300 ${ toastMessage.type === 'error' ? 'bg-red-600' : 'bg-emerald-600' }}>
{toastMessage.type === 'error' ?  : }
{toastMessage.msg}

)}

  {/* Header */}
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
          <button 
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-md border border-slate-700 transition"
            title="화면 인쇄"
          >
            <Printer className="w-4 h-4" />
            인쇄
          </button>
        </div>
      </div>
    </div>

    {/* Tab Navigation */}
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
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'history'
              ? 'border-blue-500 text-blue-400 bg-slate-800'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <History className="w-4 h-4" />
          신청 내역 및 관리 (Request History)
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
            {requests.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'calendar'
              ? 'border-blue-500 text-blue-400 bg-slate-800'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          검사 일정 현황 (Calendar View)
        </button>
      </div>
    </div>
  </header>

  {/* Main Content Area */}
  <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
    
    {/* TAB 1: NEW INSPECTION REQUEST FORM */}
    {activeTab === 'new' && (
      <div className="space-y-6">
        {/* Notice Alert Banner */}
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
              <p className="text-xs text-slate-500 mt-0.5">아래의 서식에 맞춰 정확한 검사 요청 정보를 입력해 주세요.</p>
            </div>
            <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              * 표시 항목은 필수 입력 사항입니다.
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* 1. Basic Info Auto-Generated Preview */}
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
              <p className="text-[11px] text-blue-700 mt-1">
                * 아래의 업체명, PO 번호, 품번, 요청일자 변경 시 자동으로 포맷이 업데이트됩니다.
              </p>
            </div>

            {/* 2, 3, 4 Contact Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  No. 2 검사 위치 및 업체명 (Company Name & Location) *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="예: 65-1, Jwadong-ro, Haeundae-gu, Busan, Korea"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                  placeholder="예: Han, Seung Jun"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                  No. 4 연락처 / 이메일 (Phone / Email) *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="예: +82 10 2624 7623 / contact@ismm.co.kr"
                  value={phoneEmail}
                  onChange={(e) => setPhoneEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* No. 5 Dynamic Item Table Detail */}
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
                      <th className="p-3 border-r border-slate-200 min-w-[120px]">발주번호<br/><span className="text-[10px] text-slate-500 font-normal">WinGD PO NO.</span></th>
                      <th className="p-3 border-r border-slate-200 min-w-[90px]">Item No.</th>
                      <th className="p-3 border-r border-slate-200 min-w-[100px]">수량<br/><span className="text-[10px] text-slate-500 font-normal">Qty</span></th>
                      <th className="p-3 border-r border-slate-200 min-w-[160px]">도면번호+개정번호<br/><span className="text-[10px] text-slate-500 font-normal">Drawing & Rev.</span></th>
                      <th className="p-3 border-r border-slate-200 min-w-[150px]">제작사 리포트 번호<br/><span className="text-[10px] text-slate-500 font-normal">Report No.</span></th>
                      <th className="p-3 border-r border-slate-200 min-w-[110px]">변경승인<br/><span className="text-[10px] text-slate-500 font-normal">RAE</span></th>
                      <th className="p-3 border-r border-slate-200 min-w-[110px]">부적합<br/><span className="text-[10px] text-slate-500 font-normal">NCR</span></th>
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
                            placeholder="승인번호 (if req.)"
                            value={item.rae}
                            onChange={(e) => handleItemChange(index, 'rae', e.target.value)}
                            className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-200">
                          <input 
                            type="text"
                            placeholder="NCR 번호 (if any)"
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
                            title="삭제"
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

            {/* No. 11 Inspection Request Date & Time */}
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
                  <p className="text-xs text-amber-700 mt-1 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    일주일(7일) 미만의 긴급 신청입니다. 사전 협의가 필요할 수 있습니다.
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

            {/* No. 12 Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                No. 12 특이사항 (Note: 긴급, 초도 검사, 납기 변경 등)
              </label>
              <textarea
                rows={3}
                placeholder="검사와 관련된 특이사항이나 전달 요청사항을 적어주세요. (예: 초도제품 검사, 부적합 조치 완료 등)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-slate-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

          </div>

          {/* Form Actions Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setItems([{ poNo: '', itemNo: '', qty: '', drawingRev: '', reportNo: '', rae: '', ncr: '' }]);
                setNote('');
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-md transition"
            >
              초기화 (Reset)
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow hover:shadow-md transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              검사 신청 제출 (Submit Request)
            </button>
          </div>
        </form>
      </div>
    )}

    {/* TAB 2: HISTORY & STATUS MANAGEMENT */}
    {activeTab === 'history' && (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          
          {/* Filter Controls Bar */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="PO 번호, 업체명, 제목 검색..."
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
                  <option value="ALL">전체 상태 (All Status)</option>
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

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">신청 ID</th>
                  <th className="p-3">신청 내용 (Basic Info)</th>
                  <th className="p-3">QM 담당자</th>
                  <th className="p-3">검사 요청일</th>
                  <th className="p-3">품목수</th>
                  <th className="p-3">상태 (Status)</th>
                  <th className="p-3 text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      검색 결과가 없거나 등록된 신청 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-medium text-slate-900">{req.id}</td>
                      <td className="p-3 max-w-xs truncate font-medium text-slate-800" title={req.basicInfo}>
                        {req.basicInfo}
                      </td>
                      <td className="p-3 text-slate-600">{req.contactPerson}</td>
                      <td className="p-3 font-mono text-slate-700">
                        {req.requestDate} <span className="text-slate-400">@{req.requestTime}</span>
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
                          {req.items.length} 건
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          req.status === 'Approved' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : req.status === 'Schedule Confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : req.status === 'Rejected'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedDetailRequest(req)}
                          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5 hover:underline"
                        >
                          보기
                          <ChevronRight className="w-3.5 h-3.5" />
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

    {/* TAB 3: CALENDAR SCHEDULE VIEW */}
    {activeTab === 'calendar' && (
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            2026년 11월 검사 일정 현황 (Inspection Schedule)
          </h2>
          <div className="flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> 일정확정
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> 검토완료
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> 신청대기
            </span>
          </div>
        </div>

        {/* Calendar Grid Representation */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center font-semibold text-xs text-slate-600 py-2.5">
            <div className="text-red-500">일 (Sun)</div>
            <div>월 (Mon)</div>
            <div>화 (Tue)</div>
            <div>수 (Wed)</div>
            <div>목 (Thu)</div>
            <div>금 (Fri)</div>
            <div className="text-blue-500">토 (Sat)</div>
          </div>

          <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 bg-white">
            {/* Blank days for month start padding */}
            {[...Array(0)].map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[100px] bg-slate-50/50 p-2"></div>
            ))}

            {/* Days 1-30 */}
            {[...Array(30)].map((_, dayIdx) => {
              const dayNum = dayIdx + 1;
              const dateStr = `2026-11-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayReqs = requests.filter(r => r.requestDate === dateStr);

              return (
                <div key={dayNum} className="min-h-[110px] p-2 hover:bg-slate-50/80 transition relative flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold ${
                      (dayIdx % 7 === 0) ? 'text-red-500' : (dayIdx % 7 === 6) ? 'text-blue-500' : 'text-slate-700'
                    }`}>
                      {dayNum}
                    </span>
                    {dayReqs.length > 0 && (
                      <span className="text-[10px] bg-slate-200 text-slate-700 rounded-full px-1.5 py-0.2 font-semibold">
                        {dayReqs.length}건
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-y-auto max-h-[75px]">
                    {dayReqs.map((req) => (
                      <div 
                        key={req.id}
                        onClick={() => setSelectedDetailRequest(req)}
                        className={`text-[10px] p-1.5 rounded cursor-pointer border truncate transition ${
                          req.status === 'Schedule Confirmed' 
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                            : req.status === 'Approved'
                            ? 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                            : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                        }`}
                        title={`${req.requestTime} - ${req.companyName}`}
                      >
                        <div className="font-semibold">{req.requestTime} {req.items[0]?.poNo}</div>
                        <div className="truncate text-slate-600">{req.companyName}</div>
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

  {/* DETAIL MODAL OVERLAY */}
  {selectedDetailRequest && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center rounded-t-xl sticky top-0">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              검사 신청 상세 정보 ({selectedDetailRequest.id})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{selectedDetailRequest.basicInfo}</p>
          </div>
          <button 
            onClick={() => setSelectedDetailRequest(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Header Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px]">검사 위치 (Location):</span>
              <span className="font-semibold text-slate-800">{selectedDetailRequest.location}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">QM 담당자 (Contact):</span>
              <span className="font-semibold text-slate-800">{selectedDetailRequest.contactPerson}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">연락처 (Phone/Email):</span>
              <span className="font-semibold text-slate-800">{selectedDetailRequest.phoneEmail}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">신청 검사 일시:</span>
              <span className="font-semibold text-blue-700">{selectedDetailRequest.requestDate} @ {selectedDetailRequest.requestTime}</span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2 uppercase tracking-wide">내용 상세 (Item List)</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-amber-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200">PO No.</th>
                    <th className="p-2.5 border-r border-slate-200">Item No.</th>
                    <th className="p-2.5 border-r border-slate-200">수량</th>
                    <th className="p-2.5 border-r border-slate-200">도면번호+개정번호</th>
                    <th className="p-2.5 border-r border-slate-200">리포트 번호</th>
                    <th className="p-2.5 border-r border-slate-200">RAE</th>
                    <th className="p-2.5">NCR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {selectedDetailRequest.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 border-r border-slate-200 font-mono">{it.poNo}</td>
                      <td className="p-2.5 border-r border-slate-200 font-mono">{it.itemNo}</td>
                      <td className="p-2.5 border-r border-slate-200 font-semibold">{it.qty}</td>
                      <td className="p-2.5 border-r border-slate-200">{it.drawingRev || '-'}</td>
                      <td className="p-2.5 border-r border-slate-200">{it.reportNo || '-'}</td>
                      <td className="p-2.5 border-r border-slate-200">{it.rae || '-'}</td>
                      <td className="p-2.5">{it.ncr || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Note section */}
          {selectedDetailRequest.note && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-1">특이사항 (Notes):</span>
              <p className="text-slate-600 whitespace-pre-wrap">{selectedDetailRequest.note}</p>
            </div>
          )}

        </div>

        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedDetailRequest(null)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition"
          >
            닫기 (Close)
          </button>
        </div>

      </div>
    </div>
  )}

  {/* Footer */}
  <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
    <p>© 2026 WinGD Supplier Inspection Portal. All rights reserved.</p>
