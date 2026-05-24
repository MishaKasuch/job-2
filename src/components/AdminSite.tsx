import React, { useState } from 'react';
import { Vacancy, Application, Review } from '../types';
import { 
  Users, Briefcase, FileText, CheckCircle, XCircle, Clock, 
  Search, Eye, Edit3, Trash2, Shield, Sparkles, Mail, Send,
  PlusCircle, RefreshCw, MessageSquare, AlertCircle, FilePlus, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminSiteProps {
  vacancies: Vacancy[];
  applications: Application[];
  reviews: Review[];
  onUpdateApplicationStatus: (id: string, status: Application['status']) => void;
  onUpdateApplicationNotes: (id: string, notes: string) => void;
  onDeleteApplication: (id: string) => void;
  onAddVacancy: (vacancy: Omit<Vacancy, 'id' | 'publishedAt'>) => void;
  onDeleteVacancy: (id: string) => void;
  onApproveReview: (id: string) => void;
  onDeleteReview: (id: string) => void;
}

export default function AdminSite({
  vacancies,
  applications,
  reviews,
  onUpdateApplicationStatus,
  onUpdateApplicationNotes,
  onDeleteApplication,
  onAddVacancy,
  onDeleteVacancy,
  onApproveReview,
  onDeleteReview
}: AdminSiteProps) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [appSearch, setAppSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'vacancies' | 'reviews'>('applications');
  
  // Vacancy creator state
  const [newVac, setNewVac] = useState({
    title: '',
    location: '',
    country: 'Slovakia' as Vacancy['country'],
    salary: '',
    type: 'Повна зайнятість',
    description: '',
    requirementsStr: '',
  });
  const [vacSuccessMsg, setVacSuccessMsg] = useState(false);

  // Quick Application note updater
  const [tempNotes, setTempNotes] = useState('');

  // Handle Vacancy creation submission
  const handleCreateVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVac.title || !newVac.location || !newVac.salary) return;

    onAddVacancy({
      title: newVac.title,
      location: newVac.location,
      country: newVac.country,
      salary: newVac.salary + ' € / міс',
      type: newVac.type,
      description: newVac.description || 'Робочий на сучасне підприємство.',
      requirements: newVac.requirementsStr.split('\n').filter(r => r.trim() !== '')
    });

    setVacSuccessMsg(true);
    setNewVac({
      title: '',
      location: '',
      country: 'Slovakia',
      salary: '',
      type: 'Повна зайнятість',
      description: '',
      requirementsStr: '',
    });

    setTimeout(() => {
      setVacSuccessMsg(false);
    }, 3000);
  };

  // Helper template message generator
  const generateMessageTemplate = (type: 'whatsapp' | 'email', app: Application) => {
    const greeting = `Доброго дня, ${app.firstName}! Це кадрове агентство KONSTANTA.`;
    const body = `Ми отримали вашу заявку на вакансію "${app.vacancyTitle}".`;
    
    if (type === 'whatsapp') {
      return `${greeting} ${body} Наш рекрутер перевірив дані та хотів би зв'язатися з вами найближчим часом для короткої телефонної співбесіди. Коли вам буде зручно зателефонувати?`;
    } else {
      return `Тема: Konstanta Recruiting - Заявка на вакансію: ${app.vacancyTitle}\n\n${greeting}\n\n${body}\n\nПовідомляємо, що ваше резюме успішно збережено у нашій внутрішній CRM системі.\nМи плануємо провести первинне оцінювання за телефоном протягом наступних 24 годин.\n\nЗ повагою,\nКадрове агентство KONSTANTA\n+380 809 100 55`;
    }
  };

  // Filter application list
  const filteredApps = applications.filter(app => {
    const searchString = `${app.firstName} ${app.lastName} ${app.phone} ${app.email} ${app.vacancyTitle}`.toLowerCase();
    return searchString.includes(appSearch.toLowerCase());
  });

  // Calculate quick metrics
  const stats = {
    total: applications.length,
    new: applications.filter(a => a.status === 'new').length,
    review: applications.filter(a => a.status === 'review').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      
      {/* Top Warning Banner highlighting correct turn-around communication */}
      <div className="bg-slate-900 text-white px-4 py-2 text-center text-[11px] font-mono border-b border-amber-500/30 flex items-center justify-center gap-1.5 relative z-50">
        <Shield className="w-3.5 h-3.5 text-amber-500" />
        <span>Адмін-панель KONSTANTA CRM пов'язана в реальному часі. Будь-які заявки з Клієнтського сайту потрапляють сюди миттєво!</span>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(110vh-100px)]">
        
        {/* CRM Sidebar Control Unit */}
        <aside className="w-full lg:w-64 bg-slate-950 text-white p-6 shrink-0 border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <span className="font-sans font-black text-xs block tracking-widest text-amber-500 uppercase leading-none">
                  KONSTANTA v.r.o.
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1 uppercase">
                  CRM / ATS PANEL
                </span>
              </div>
            </div>

            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-3">Опції Керування</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full text-left py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'applications'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Поступивші Заявки</span>
                </span>
                {stats.new > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    activeTab === 'applications' ? 'bg-slate-900 text-amber-500' : 'bg-red-500 text-white animate-pulse'
                  }`}>
                    {stats.new}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('vacancies')}
                className={`w-full text-left py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'vacancies'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Вакансії компанії</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {vacancies.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full text-left py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Відгуки про сайт</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {reviews.length}
                </span>
              </button>
            </nav>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900 text-[10px] text-slate-500 text-center">
            <span>Система зв'язку: АТS v4.0.1</span>
          </div>
        </aside>

        {/* CRM Main Workspace */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          
          {/* APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              
              {/* Stats overview boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Всі заявки</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{stats.total}</div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/50 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Нові</span>
                  <div className="text-2xl font-black text-amber-600 mt-1 flex items-center gap-1">
                    <span>{stats.new}</span>
                    {stats.new > 0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200/50 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-blue-700 uppercase">На співбесіді</span>
                  <div className="text-2xl font-black text-blue-800 mt-1">{stats.interview}</div>
                </div>

                <div className="bg-emerald-50/55 p-4 rounded-xl border border-emerald-200/50 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Прийняті / Оффер</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">{stats.accepted}</div>
                </div>

                <div className="bg-red-50/50 p-4 rounded-xl border border-red-200/50 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-red-700 uppercase">Відхилені</span>
                  <div className="text-2xl font-black text-red-600 mt-1">{stats.rejected}</div>
                </div>

              </div>

              {/* Core Application Grid Table / View */}
              <div className="flex flex-col xl:flex-row gap-6">
                
                {/* Candidates List Panel */}
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-sans font-bold text-sm text-slate-900 uppercase">Заявки кандидатів</h3>
                    
                    {/* Search Candidate */}
                    <div className="relative w-48 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Швидкий пошук..."
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {filteredApps.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs">Наразі немає поступивших заявок за вашим запитом.</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Виберіть **Клієнтський сайт** у верхній панелі, заповніть форму заявки, і вона негайно з'явиться тут!
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-600 border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 font-semibold uppercase text-[9px] tracking-wider border-b border-slate-100">
                            <th className="py-2.5 px-3">Кандидат</th>
                            <th className="py-2.5 px-3">Обрана вакансія</th>
                            <th className="py-2.5 px-3">Подано</th>
                            <th className="py-2.5 px-3">Контакти</th>
                            <th className="py-2.5 px-3">Статус</th>
                            <th className="py-2.5 px-3 text-right">Управління</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredApps.map((app) => (
                            <tr 
                              key={app.id} 
                              className={`hover:bg-slate-50 transition-colors ${
                                selectedApp?.id === app.id ? 'bg-amber-50/30' : ''
                              }`}
                            >
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-900">
                                  {app.lastName} {app.firstName}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-medium text-slate-700">{app.vacancyTitle}</div>
                              </td>
                              <td className="py-3 px-3">
                                <span className="text-[10px] text-slate-400">{app.appliedAt}</span>
                              </td>
                              <td className="py-3 px-3">
                                <div className="text-slate-800 font-semibold">{app.phone}</div>
                                <div className="text-[10px] text-slate-400 lowercase">{app.email}</div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                  app.status === 'new' ? 'bg-amber-100 text-amber-800' :
                                  app.status === 'review' ? 'bg-purple-100 text-purple-800' :
                                  app.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                                  app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {app.status === 'new' && 'Нова'}
                                  {app.status === 'review' && 'В роботі'}
                                  {app.status === 'interview' && 'Співбесіда'}
                                  {app.status === 'accepted' && 'Оффер'}
                                  {app.status === 'rejected' && 'Відмова'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedApp(app);
                                      setTempNotes(app.adminNotes || '');
                                    }}
                                    className="p-1 px-2 rounded hover:bg-slate-200 text-slate-800 flex items-center gap-1 font-bold"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Перегляд</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('Видалити цю заявку повністю?')) {
                                        onDeleteApplication(app.id);
                                        if (selectedApp?.id === app.id) setSelectedApp(null);
                                      }
                                    }}
                                    className="p-1.5 rounded hover:bg-red-50 text-red-600"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Candidate detail viewer overlay/sidebar */}
                <div className="w-full xl:w-96 shrink-0">
                  <AnimatePresence mode="wait">
                    {selectedApp ? (
                      <motion.div
                        key={selectedApp.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow shadow-slate-200/50 space-y-5"
                      >
                        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">Карта кандидата AP-{selectedApp.id.substring(4)}</span>
                            <h4 className="font-sans font-black text-base text-slate-900 mt-0.5">
                              {selectedApp.firstName} {selectedApp.lastName}
                            </h4>
                          </div>
                          <button 
                            onClick={() => setSelectedApp(null)}
                            className="text-slate-400 hover:text-slate-800 text-xs font-bold"
                          >
                            Закрити
                          </button>
                        </div>

                        {/* Status update selector */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Статус Етапу</label>
                          <div className="grid grid-cols-2 gap-2">
                            {(['new', 'review', 'interview', 'accepted', 'rejected'] as const).map((currSt) => (
                              <button
                                key={currSt}
                                onClick={() => onUpdateApplicationStatus(selectedApp.id, currSt)}
                                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold text-center border uppercase transition-colors uppercase ${
                                  selectedApp.status === currSt
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {currSt === 'new' && 'Нова'}
                                {currSt === 'review' && 'Розгляд'}
                                {currSt === 'interview' && 'Інтерв’ю'}
                                {currSt === 'accepted' && 'Оффер'}
                                {currSt === 'rejected' && 'Відхилити'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="bg-slate-50 p-3.5 rounded-xl space-y-2.5 text-xs text-slate-700">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Посада:</span>
                            <span className="font-bold">{selectedApp.vacancyTitle}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-normal">Телефон:</span>
                            <span className="font-semibold text-slate-900">{selectedApp.phone}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Email:</span>
                            <span className="font-semibold lowercase text-slate-900">{selectedApp.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-1.5">Супровідний лист:</span>
                            <p className="bg-white border rounded p-2.5 text-[11px] text-slate-600 min-h-[40px] italic leading-relaxed">
                              {selectedApp.coverLetter || 'Лист порожній...'}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px]">
                            <span className="text-slate-400">Файл резюме:</span>
                            <span className="font-mono text-blue-900 font-semibold underline flex items-center gap-1">
                              <FileText className="w-3 h-3 text-amber-500" />
                              {selectedApp.resumeFileName || 'Resume.pdf'}
                            </span>
                          </div>
                        </div>

                        {/* Persistent notes area */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Службові Нотатки Рекрутера</label>
                          <textarea
                            rows={2}
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            onBlur={() => onUpdateApplicationNotes(selectedApp.id, tempNotes)}
                            placeholder="Напишіть коментар, наприклад: 'Війна, потрібне запрошення, готовий в червні...'"
                            className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none font-medium text-slate-800"
                          />
                          <p className="text-[9px] text-slate-400 mt-0.5">Нотатка зберігається автоматично при виході з поля введення.</p>
                        </div>

                        {/* Communication drafts */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Швидкий Зв’язок (Скласти шаблон)</label>
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                            <button
                              onClick={() => {
                                const msg = generateMessageTemplate('whatsapp', selectedApp);
                                alert(`Шаблон повідомлення WhatsApp згенеровано:\n\n${msg}\n\nКористувач отримає SMS / Повідомлення на номер ${selectedApp.phone}`);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-1.5 px-2.5 flex items-center justify-center gap-1 uppercase tracking-wider"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              onClick={() => {
                                const msg = generateMessageTemplate('email', selectedApp);
                                alert(`Шаблон електронної пошти Email згенеровано:\n\n${msg}\n\nПошта буде надіслана на: ${selectedApp.email}`);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 px-2.5 flex items-center justify-center gap-1 uppercase tracking-wider"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email</span>
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    ) : (
                      <div className="bg-slate-100 border border-slate-200 border-dashed rounded-2xl p-6 text-center text-slate-400 h-full flex flex-col justify-center min-h-[300px]">
                        <Users className="w-12 h-12 mx-auto text-slate-350 mb-3" />
                        <h4 className="text-xs font-bold text-slate-800 uppercase">Оберіть карту кандидата</h4>
                        <p className="text-[10px] text-slate-400 px-4 mt-1 leading-relaxed">
                          Натисніть на дію **Перегляд** поряд із будь-яким кандидатом для редагування статусу та ведення рекрутерських нотаток.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

            </div>
          )}

          {/* VACANCIES TAB */}
          {activeTab === 'vacancies' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Add job form */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm h-fit">
                <div className="flex items-center gap-2 mb-4">
                  <FilePlus className="w-5 h-5 text-amber-500" />
                  <h3 className="font-sans font-bold text-sm text-slate-900 uppercase">Нова вакансія</h3>
                </div>

                {vacSuccessMsg && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs mb-4 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Успішно опубліковано! Вона відразу з’явилася на Клієнтському сайті.</span>
                  </div>
                )}

                <form onSubmit={handleCreateVacancy} className="space-y-3.5 text-xs text-slate-600">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Назва вакансії (напрямок)</label>
                    <input
                      type="text"
                      required
                      value={newVac.title}
                      onChange={(e) => setNewVac({ ...newVac, title: e.target.value })}
                      placeholder="Охоронник / Водій С"
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Країна праці</label>
                      <select
                        value={newVac.country}
                        onChange={(e) => setNewVac({ ...newVac, country: e.target.value as Vacancy['country'] })}
                        className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2"
                      >
                        <option value="Slovakia">🇸🇰 Словаччина</option>
                        <option value="Czech Republic">🇨🇿 Чехія</option>
                        <option value="Poland">🇵🇱 Польща</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Місто</label>
                      <input
                        type="text"
                        required
                        value={newVac.location}
                        onChange={(e) => setNewVac({ ...newVac, location: e.target.value })}
                        placeholder="Кошице"
                        className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Оплата NETTO (€)</label>
                      <input
                        type="number"
                        required
                        value={newVac.salary}
                        onChange={(e) => setNewVac({ ...newVac, salary: e.target.value })}
                        placeholder="1100"
                        className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Графік робіт</label>
                      <input
                        type="text"
                        required
                        value={newVac.type}
                        onChange={(e) => setNewVac({ ...newVac, type: e.target.value })}
                        placeholder="Повна зайнятість"
                        className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Короткий опис роботи</label>
                    <textarea
                      rows={2}
                      value={newVac.description}
                      onChange={(e) => setNewVac({ ...newVac, description: e.target.value })}
                      placeholder="Опишіть оновлені умови виробництва, страховку..."
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 resize-none focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Основні вимоги (з нового рядка кожна)</label>
                    <textarea
                      rows={3}
                      value={newVac.requirementsStr}
                      onChange={(e) => setNewVac({ ...newVac, requirementsStr: e.target.value })}
                      placeholder="Наявність посвідчення&#10;Біометричний паспорт&#10;Вік до 50 років"
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[10px] focus:outline-none text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 mt-2 rounded-xl flex items-center justify-center gap-1.5 shadow"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-500" />
                    <span>Опублікувати на клієнт-сайті</span>
                  </button>
                </form>
              </div>

              {/* Vacancies list */}
              <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-sans font-bold text-sm text-slate-900 uppercase">Активні вакансії у базі ({vacancies.length})</h3>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {vacancies.map((v) => (
                    <div 
                      key={v.id}
                      className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-extrabold text-sm text-slate-900">{v.title}</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold">
                            {v.country === 'Slovakia' && '🇸🇰 Словаччина'}
                            {v.country === 'Czech Republic' && '🇨🇿 Чехія'}
                            {v.country === 'Poland' && '🇵🇱 Польща'}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{v.location} &bull; <span className="text-amber-600 font-bold">{v.salary}</span></div>
                        <p className="text-slate-500 text-[10px] mt-2 line-clamp-1 italic">{v.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm('Архівувати та видалити вакансію? Вона видалиться також з сайту і нові кандидати не зможуть подати заявку.')) {
                            onDeleteVacancy(v.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 shrink-0 p-1.5 border border-red-100 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Архівувати</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-sans font-bold text-sm text-slate-900 uppercase">Огляди та відгуки сайту ({reviews.length})</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div 
                    key={r.id}
                    className={`border rounded-xl p-4 space-y-3 relative ${
                      r.approved ? 'border-emerald-200 bg-emerald-50/10' : 'border-amber-200 bg-amber-50/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{r.author}</span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-400">
                          <span>{r.date}</span>
                          <span>&bull;</span>
                          <span className={r.approved ? "text-emerald-600 font-bold" : "text-amber-600 font-bold animate-pulse"}>
                            {r.approved ? "ОПУБЛІКОВАНО" : "ОЧІКУЄ ПІДТВЕРДЖЕННЯ"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < r.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded border border-slate-100 italic">
                      {r.text}
                    </p>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-[10px] font-bold">
                      {!r.approved && (
                        <button
                          onClick={() => onApproveReview(r.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-3 rounded flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>ДОЗВОЛИТИ ОПУБЛІКУВАТИ</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDeleteReview(r.id)}
                        className="bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 py-1 px-3 rounded border border-slate-200/50 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ВИДАЛИТИ</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
