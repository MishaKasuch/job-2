import React, { useState, useRef } from 'react';
import { Vacancy, Application, Review, Branch } from '../types';
import UkraineMap from './UkraineMap';
import { 
  Briefcase, MapPin, Award, Gem, Users, Star, 
  UploadCloud, CheckCircle, Clock, ChevronRight, 
  Phone, Globe, Send, LogIn, Lock, CheckSquare, Search, Filter, Sparkles, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientSiteProps {
  vacancies: Vacancy[];
  reviews: Review[];
  branches: Branch[];
  onApply: (app: Omit<Application, 'id' | 'appliedAt' | 'status'>) => void;
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'approved'>) => void;
  userEmail: string;
}

export default function ClientSite({ 
  vacancies, 
  reviews, 
  branches, 
  onApply, 
  onAddReview,
  userEmail 
}: ClientSiteProps) {
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  
  // Job Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<'all' | 'Slovakia' | 'Czech Republic' | 'Poland'>('all');

  // Application Form State
  const [applyForm, setApplyForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: userEmail || '',
    coverLetter: '',
  });
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Review Form State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Handle Vacancy Filters
  const filteredVacancies = vacancies.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || v.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  // Drag and Drop files for Resume
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  // Submit Job Application
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancy) return;

    onApply({
      vacancyId: selectedVacancy.id,
      vacancyTitle: selectedVacancy.title,
      firstName: applyForm.firstName,
      lastName: applyForm.lastName,
      phone: applyForm.phone,
      email: applyForm.email,
      coverLetter: applyForm.coverLetter,
      resumeFileName: selectedFileName || 'resume_provided.pdf',
    });

    setIsSubmitSuccess(true);
    setTimeout(() => {
      setIsSubmitSuccess(false);
      setSelectedVacancy(null);
      // Reset form
      setApplyForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: userEmail || '',
        coverLetter: '',
      });
      setSelectedFileName(null);
    }, 2800);
  };

  // Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    onAddReview({
      author: reviewAuthor || 'Гість',
      rating: reviewRating,
      text: reviewText,
    });

    setReviewText('');
    setShowReviewSuccess(true);
    setTimeout(() => {
      setShowReviewSuccess(false);
    }, 3000);
  };

  // Fast demo authorize
  const handleQuickLogin = () => {
    setIsAuthorized(true);
    setReviewAuthor(userEmail.split('@')[0] || 'Користувач');
  };

  return (
    <div className="bg-white min-h-screen text-slate-800">
      
      {/* High-Fidelity Header */}
      <header className="fixed top-12 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo matching template styling */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-slate-900 flex items-center justify-center rounded-xl text-amber-500 font-bold tracking-tighter shadow-sm border border-amber-500/30">
              K
            </div>
            <div>
              <span className="font-sans font-bold text-slate-900 tracking-wider text-base block leading-none">
                KONSTANTA
              </span>
              <span className="text-[9px] text-amber-600 font-semibold tracking-widest uppercase mt-0.5 block">
                recruitment agency
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#about" className="hover:text-amber-600 transition-colors">Про нас</a>
            <a href="#vacancies" className="hover:text-amber-600 transition-colors">Активні вакансії</a>
            <a href="#reviews" className="hover:text-amber-600 transition-colors">Відгуки клієнтів</a>
            <a href="#branches" className="hover:text-amber-600 transition-colors">Наші філії</a>
          </nav>

          {/* Language Switcher and Contact Action */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="hidden lg:flex items-center gap-1.5 text-slate-500 border-r border-slate-200 pr-4">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>+380 809 100 55</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-red-700 font-semibold">
              <span className="text-[10px]">🇺🇦 UA</span>
            </div>
            <a 
              href="#vacancies" 
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] px-3.5 py-2 rounded-xl border border-slate-700 shadow-sm transition-all"
            >
              Підібрати роботу
            </a>
          </div>

        </div>
      </header>

      {/* Hero Header padding offset */}
      <div className="pt-24"></div>

      {/* Hero Section */}
      <section id="about" className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-14 px-4 lg:px-8 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 relative z-10">
          
          {/* Pitch Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-full py-1 px-3 mb-5 text-[11px] font-medium text-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Офіційне працевлаштування в ЄС</span>
            </div>
            
            <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white mb-4">
              КАДРОВЕ АГЕНТСТВО <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">
                KONSTANTA v.r.o.
              </span>
            </h1>
            
            <p className="font-sans font-medium text-amber-500 tracking-wider text-sm mb-6 uppercase">
              НАДІЙНІ КАР’ЄРНІ ТА КАДРОВІ РІШЕННЯ
            </p>

            <p className="text-slate-300 text-sm max-w-xl leading-relaxed mb-8">
              Ми спеціалізуємося на легальному працевлаштуванні громадян України у країнах Євросоюзу: Словаччина, Чехія та Польща. Забезпечуємо повне документальне оформлення, якісне безкоштовне проживання та юридичний захист кожного нашого клієнта.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a 
                href="#vacancies" 
                className="w-full sm:w-auto text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 h-12 flex items-center justify-center rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
              >
                ДИВИТИСЬ ВАКАНСІЇ
              </a>
              <button 
                onClick={() => {
                  const element = document.getElementById('vacancies');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-7 h-12 rounded-xl transition-all"
              >
                ЗАПОВНИТИ АНКЕТУ В ШТАТ
              </button>
            </div>
          </div>

          {/* Prompt Mockup Hero Illustration rendering generated image */}
          <div className="w-full lg:w-[480px] relative">
            <div className="aspect-[16/10] overflow-hidden rounded-2xl border-2 border-slate-850 shadow-2xl bg-slate-900/60 p-1 backdrop-blur">
              <img
                src="/src/assets/images/konstanta_hero_1779617155949.png"
                alt="Konstanta Recruitment Team"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-slate-950/90 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-300">
                Гарантуємо виїзд вже за 7 днів
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Board Section matching white pill shape from mockup */}
      <section className="relative -mt-6 z-20 px-4">
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-md rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          <div className="flex items-center gap-4 justify-center md:px-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">16+</div>
              <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                РОКІВ НА РИНКУ
              </div>
              <div className="text-[9px] text-amber-600 font-semibold mt-0.5">
                (РОБОТА НА ПРЯМУ)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center pt-6 md:pt-0 md:px-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">70+</div>
              <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                ПОСТІЙНИХ КЛІЄНТІВ
              </div>
              <div className="text-[9px] text-amber-600 font-semibold mt-0.5">
                (ВЕЛИКІ ЗАВОДИ ТА ХОЛДИНГИ)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center pt-6 md:pt-0 md:px-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">1850+</div>
              <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                ПРАЦЕВЛАШТОВАНИХ
              </div>
              <div className="text-[9px] text-amber-600 font-semibold mt-0.5">
                (УСПІШНІ КАНДИДАТИ)
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Active Vacancies Section */}
      <section id="vacancies" className="py-14 max-w-7xl mx-auto px-4 lg:px-8">
        
        <div className="text-center mb-10">
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 uppercase tracking-tight">
            АКТИВНІ ВАКАНСІЇ
          </h2>
          <span className="font-mono text-[11px] tracking-wider text-amber-600 font-semibold block uppercase mt-1">
            (Active Job Openings)
          </span>
          <div className="w-12 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
          
          {/* Keyword Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Шукати за назвою або локацією..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Country Tabs */}
          <div className="flex items-center gap-1.5 self-center shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2 hidden sm:block" />
            {(['all', 'Slovakia', 'Czech Republic', 'Poland'] as const).map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${
                  selectedCountry === country
                    ? 'bg-slate-900 text-white'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-600'
                }`}
              >
                {country === 'all' && 'Усі країни'}
                {country === 'Slovakia' && '🇸🇰 Словаччина'}
                {country === 'Czech Republic' && '🇨🇿 Чехія'}
                {country === 'Poland' && '🇵🇱 Польща'}
              </button>
            ))}
          </div>

        </div>

        {/* Grid of Vacancies */}
        {filteredVacancies.length === 0 ? (
          <div className="text-center py-12 bg-slate-55 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-500 text-sm">Не знайдено активних вакансій за обраними критеріями.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCountry('all'); }} 
              className="text-amber-600 font-semibold text-xs mt-2 underline"
            >
              Скинути фільтри
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredVacancies.map((vacancy) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={vacancy.id}
                  className="bg-white border border-slate-200 hover:border-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: country badge & rate */}
                    <div className="flex items-center justify-between mb-3 text-[10px] font-bold">
                      <span className="bg-slate-100 text-slate-600 py-1 px-2.5 rounded-md uppercase">
                        {vacancy.type}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1 font-normal">
                        <Clock className="w-3.5 h-3.5" />
                        {vacancy.publishedAt}
                      </span>
                    </div>

                    <h3 className="font-sans font-bold text-base text-slate-900 leading-tight">
                      {vacancy.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{vacancy.location}</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      {vacancy.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-end justify-between py-3 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Оплата netto:</span>
                        <span className="text-sm font-black text-amber-600">{vacancy.salary}</span>
                      </div>
                      <button
                        onClick={() => setSelectedVacancy(vacancy)}
                        className="bg-slate-900 text-white rounded-lg py-1.5 px-3 text-xs font-semibold hover:bg-slate-800 transition-colors"
                      >
                        Залишити заявку
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </section>

      {/* Slide-over Application Drawer modal */}
      <AnimatePresence>
        {selectedVacancy && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVacancy(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              
              {/* Application Form Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-900 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider">
                    ПОДАЧА ЗАЯВКИ
                  </span>
                  <button 
                    onClick={() => setSelectedVacancy(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-sans font-extrabold text-lg leading-tight">
                  {selectedVacancy.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedVacancy.location}</span>
                </div>
              </div>

              {/* Form Area */}
              <div className="flex-1 p-6">
                
                {isSubmitSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Заявку прийнято!</h4>
                    <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                      Ваші контактні дані успішно надіслані. Рекрутер агентства KONSTANTA зв'яжеться з вами за вказаним номером.
                    </p>
                    <div className="mt-8 text-[11px] text-slate-400 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                      Перевірте **Адмін-панель** у верхній вкладці — ваша заявка прибула туди в режимі реального часу!
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitApplication} className="space-y-4">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Ім'я</label>
                        <input
                          type="text"
                          required
                          value={applyForm.firstName}
                          onChange={(e) => setApplyForm({...applyForm, firstName: e.target.value})}
                          placeholder="Іван"
                          className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Прізвище</label>
                        <input
                          type="text"
                          required
                          value={applyForm.lastName}
                          onChange={(e) => setApplyForm({...applyForm, lastName: e.target.value})}
                          placeholder="Петренко"
                          className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Контактний телефон</label>
                      <input
                        type="tel"
                        required
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm({...applyForm, phone: e.target.value})}
                        placeholder="+380 97 123 4567"
                        className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Ваш Email</label>
                      <input
                        type="email"
                        required
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                        placeholder="example@yourmail.com"
                        className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Супровідний лист / Питання</label>
                      <textarea
                        rows={3}
                        value={applyForm.coverLetter}
                        onChange={(e) => setApplyForm({...applyForm, coverLetter: e.target.value})}
                        placeholder="Повідомте рекрутеру про свій досвід або коли ви будете готові виїжджати..."
                        className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                      />
                    </div>

                    {/* Resume Upload Box according to guidelines */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Завантажити резюме (якщо є)
                      </label>
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                          dragActive 
                            ? 'border-amber-500 bg-amber-50/20' 
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-1.5" />
                        <span className="text-xs font-semibold block text-slate-700">
                          {selectedFileName ? selectedFileName : 'Виберіть файл або перетягніть сюди'}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Підтримує PDF, DOC, DOCX до 5MB
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 mt-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md shadow-slate-900/10 transition-colors"
                    >
                      <Send className="w-4 h-4 text-amber-500" />
                      <span>НАДІСЛАТИ ЗАЯВКУ РЕКРУТЕРУ</span>
                    </button>

                  </form>
                )}

              </div>

              {/* Legal Note footer inside panel */}
              <div className="p-5 bg-slate-50 text-[10px] text-slate-400 text-center border-t border-slate-100">
                Залишаючи свої персональні дані, ви погоджуєтеся на обробку інформації відповідно до регламенту GDPR ЄС.
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reviews/Testimonials Section matching visual layout/titles */}
      <section id="reviews" className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          <div className="text-center mb-10">
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 uppercase tracking-tight">
              ВІДГУКИ ПРО САЙТ
            </h2>
            <div className="w-12 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          {/* Grid of testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {reviews.map((r) => (
              <div 
                key={r.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-sans font-bold text-sm text-slate-900">{r.author}</span>
                    <span className="text-[10px] text-slate-400 block">{r.date}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {r.text}
                </p>
              </div>
            ))}
          </div>

          {/* Leave Review Box (Styled exactly like the dark bar section in template) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-sans font-extrabold text-base sm:text-lg text-white uppercase tracking-wider">
                ЗАЛИШИТИ ВІДГУК
              </h3>
            </div>

            {isAuthorized ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {showReviewSuccess && (
                  <div className="bg-slate-800 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-xs flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Дякуємо! Ваш відгук записано та надіслано рекрутеру для огляду.</span>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className="w-full max-w-xs">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Ваше ім'я / нікнейм</label>
                    <input
                      type="text"
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="Ім'я"
                      className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Оцінка сайту</label>
                    <div className="flex gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setReviewRating(val)}
                          className="text-slate-400 hover:text-amber-500"
                        >
                          <Star className={`w-5 h-5 ${val <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Текст вашого відгуку</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Введіть ваш відгук про роботу нашого кадрового агентства..."
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Ви увійшли як <span className="text-amber-400 font-semibold">{reviewAuthor || 'Користувач'}</span>
                  </span>
                  <button
                    type="submit"
                    className="bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs hover:bg-amber-400 tracking-wider transition-colors"
                  >
                    ВІДПРАВИТИ ВІДГУК
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-800 bg-slate-950/40 rounded-xl">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-350 leading-relaxed">
                      Це поле стане доступним для введення відгуку після швидкої авторизації на сайті кадрового агентства.
                    </p>
                    <p className="text-[10px] text-amber-500 font-semibold mt-1">
                      Для швидкого входу увійдіть від імені вашого профілю
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleQuickLogin}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-5 h-10 flex items-center justify-center gap-2 rounded-lg text-xs tracking-wider transition-all"
                >
                  <LogIn className="w-4 h-4 text-amber-500" />
                  <span>УВІЙТИ ТА ЗАЛИШИТИ ВІДГУК</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Map Section */}
      <section id="branches" className="py-14 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 uppercase tracking-tight">
            КАРТА ФІЛІЙ
          </h2>
          <span className="font-mono text-[11px] tracking-wider text-amber-600 font-semibold block uppercase mt-1">
            (BRANCH MAP)
          </span>
          <div className="w-12 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Dynamic Branch Map rendering svg with nodes */}
        <UkraineMap branches={branches} />
      </section>

      {/* Styled Footer matching bottom of mockup screen exactly */}
      <footer className="bg-slate-950 text-white py-12 px-4 lg:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-slate-400">
          
          <div className="md:col-span-1.5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white text-slate-950 flex items-center justify-center rounded-lg text-sm font-bold tracking-tighter">
                K
              </div>
              <span className="font-sans font-bold text-sm tracking-wider text-white">
                KONSTANTA v.r.o.
              </span>
            </div>
            <p className="leading-relaxed">
              Ліцензоване агентство з працевлаштування та підбору персоналу за кордоном. Офіційні ліцензії та діючі урядові квоти у Словацькій Республіці.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-4 text-[10px] text-amber-500">
              Популярні Напрямки
            </h4>
            <ul className="space-y-2">
              <li><a href="#vacancies" className="hover:text-white transition-colors">🇸🇰 Робота в Словаччині</a></li>
              <li><a href="#vacancies" className="hover:text-white transition-colors">🇨🇿 Робота в Чехії</a></li>
              <li><a href="#vacancies" className="hover:text-white transition-colors">🇵🇱 Робота в Польщі</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-4 text-[10px] text-amber-500">
              Документи для кандидатів
            </h4>
            <ul className="space-y-2">
              <li>Пакет документів для ВНЖ</li>
              <li>Словацькі посвідчення Роботехніка</li>
              <li>Медичне страхування та квитки</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-4 text-[10px] text-amber-500">
              Гаряча Лінія Підтримки
            </h4>
            <p className="font-sans font-bold text-base text-white mb-2">
              +380 809 100 55
            </p>
            <p className="leading-relaxed text-[10px] text-slate-500">
              Працюємо без вихідних з 08:00 до 20:00. <br />
              Прийом дзвінків безкоштовний по всій Україні.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <span>&copy; 2026 KONSTANTA v.r.o. Всі права захищено. Усі вакансії надаються безкоштовно.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Політика конфіденційності</a>
            <a href="#" className="hover:text-white">Умови користування</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
