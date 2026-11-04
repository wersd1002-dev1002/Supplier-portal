import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Building, 
  User, 
  Package, 
  Search, 
  Plus, 
  Trash2, 
  Download, 
  Send,
  CheckSquare,
  Square
} from 'lucide-react';

export default function App() {
  // 상태 관리
  const [companyName, setCompanyName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [location, setLocation] = useState('');
  
  const [items, setItems] = useState([
    { id: 1, poNo: '', itemCode: '', itemName: '', drawingNo: '', qty: '', unit: 'EA', remark: '' }
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // 행 추가
  const addItemRow = () => {
    setItems([
      ...items,
      { id: Date.now(), poNo: '', itemCode: '', itemName: '', drawingNo: '', qty: '', unit: 'EA', remark: '' }
    ]);
  };

  // 행 삭제
  const removeItemRow = (id) => {
    if (items.length === 1) {
      alert('최소 1개의 품목은 유지되어야 합니다.');
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  // 입력값 변경
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName || !managerName || !requestDate) {
      alert('필수 입력 항목을 모두 채워주세요.');
      return;
    }

    const newSubmission = {
      id: 'REQ-' + Math.floor(100000 + Math.random() * 900000),
      companyName,
      managerName,
      contact,
      email,
      requestDate,
      location,
      items,
      submittedAt: new Date().toLocaleString()
    };

    setSubmittedData(newSubmission);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* 상단 헤더 */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-300" />
            <div>
              <h1 className="text-xl font-bold">공급사 검사 신청 포탈</h1>
              <p className="text-xs text-blue-200">Supplier Inspection Request Portal</p>
            </div>
          </div>
          <div className="text-sm text-blue-200">
            협력사 품질 검사 요청 시스템
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
            {/* 기본 정보 섹션 */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" /> 공급사 및 검사 기본 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">공급사명 *</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="회사명을 입력하세요" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">담당자명 *</label>
                  <input 
                    type="text" 
                    value={managerName} 
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="담당자 성명을 입력하세요" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">연락처 *</label>
                  <input 
                    type="text" 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="010-0000-0000" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">이메일 *</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@company.com" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">검사 희망일자 *</label>
                  <input 
                    type="date" 
                    value={requestDate} 
                    onChange={(e) => setRequestDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">검사 장소 *</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="공장 주소 또는 검사 진행 장소" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 검사 품목 섹션 */}
            <div>
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-600" /> 검사 신청 품목 리스트
                </h2>
                <button 
                  type="button" 
                  onClick={addItemRow}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" /> <span>품목 추가</span>
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-blue-900">품목 #{index + 1}</span>
                      <button 
                        type="button" 
                        onClick={() => removeItemRow(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input 
                        type="text" 
                        placeholder="PO 번호" 
                        value={item.poNo}
                        onChange={(e) => handleItemChange(item.id, 'poNo', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                      />
                      <input 
                        type="text" 
                        placeholder="품목 코드" 
                        value={item.itemCode}
                        onChange={(e) => handleItemChange(item.id, 'itemCode', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                      />
                      <input 
                        type="text" 
                        placeholder="품명" 
                        value={item.itemName}
                        onChange={(e) => handleItemChange(item.id, 'itemName', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                      />
                      <input 
                        type="text" 
                        placeholder="도면 번호" 
                        value={item.drawingNo}
                        onChange={(e) => handleItemChange(item.id, 'drawingNo', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                      />
                      <div className="flex space-x-2">
                        <input 
                          type="number" 
                          placeholder="수량" 
                          value={item.qty}
                          onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                          className="w-2/3 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                        />
                        <select 
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          className="w-1/3 px-2 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                        >
                          <option value="EA">EA</option>
                          <option value="SET">SET</option>
                          <option value="LOT">LOT</option>
                        </select>
                      </div>
                      <input 
                        type="text" 
                        placeholder="비고" 
                        value={item.remark}
                        onChange={(e) => handleItemChange(item.id, 'remark', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition"
              >
                <Send className="w-5 h-5" /> <span>검사 신청 제출</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">검사 신청이 완료되었습니다!</h2>
              <p className="text-sm text-slate-500 mt-1">신청 번호: <span className="font-mono font-semibold text-blue-600">{submittedData.id}</span></p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl text-left max-w-2xl mx-auto space-y-3 text-sm border">
              <p><strong>공급사명:</strong> {submittedData.companyName}</p>
              <p><strong>담당자:</strong> {submittedData.managerName} ({submittedData.contact})</p>
              <p><strong>검사 희망일:</strong> {submittedData.requestDate}</p>
              <p><strong>검사 장소:</strong> {submittedData.location}</p>
              <p><strong>신청 품목 수:</strong> {submittedData.items.length}개 품목</p>
            </div>

            <button 
              onClick={() => setSubmitted(false)}
              className="bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 transition"
            >
              새로운 신청 작성하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// 브라우저 렌더링 마운트 (index.html에서 직접 로드할 때 필수)
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
