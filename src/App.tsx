/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Vacancy, Application, Review, Branch } from './types';
import { INITIAL_VACANCIES, INITIAL_REVIEWS, INITIAL_BRANCHES } from './data';
import ClientSite from './components/ClientSite';
import AdminSite from './components/AdminSite';
import { Globe, Shield, Sparkles, Phone, MessageSquare } from 'lucide-react';

export default function App() {
  const [activeSite, setActiveSite] = useState<'client' | 'admin'>('client');
  
  // High fidelity synchronization states
  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    const local = localStorage.getItem('konstanta_vacancies');
    return local ? JSON.parse(local) : INITIAL_VACANCIES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const local = localStorage.getItem('konstanta_applications');
    // Pre-populate with one sample application to make the CRM feel alive instantly
    if (local) return JSON.parse(local);
    return [
      {
        id: 'app-init-1',
        vacancyId: 'vac-1',
        vacancyTitle: 'Водій автонавантажувача',
        firstName: 'Олександр',
        lastName: 'Ковальчук',
        phone: '+380671112233',
        email: 'kovalchuk.alex@gmail.com',
        coverLetter: 'Доброго дня! Маю словацький сертифікат на автонавантажувач та досвід роботи понад 2 роки в логістичному центрі під Кошице. Готовий виїжджати в найкоротші терміни.',
        resumeFileName: 'kovalchuk_resume.pdf',
        status: 'new',
        appliedAt: '24.05.2026',
        adminNotes: 'Дуже сильний кандидат. Телефонував йому, розмовляє базовою словацькою. Призначив технічне інтерв’ю.'
      }
    ];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const local = localStorage.getItem('konstanta_reviews');
    return local ? JSON.parse(local) : INITIAL_REVIEWS;
  });

  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);

  // Synchronize with localStorage
  useEffect(() => {
    localStorage.setItem('konstanta_vacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('konstanta_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('konstanta_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Action Helpers
  const handleApply = (appData: Omit<Application, 'id' | 'appliedAt' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
    
    const newApp: Application = {
      ...appData,
      id: `app-${Date.now()}`,
      appliedAt: formattedDate,
      status: 'new'
    };

    setApplications((prev) => [newApp, ...prev]);
  };

  const handleAddReview = (reviewData: Omit<Review, 'id' | 'date' | 'approved'>) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
    
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: formattedDate,
      approved: false // Requires admin moderation to appear on client-site
    };

    setReviews((prev) => [newReview, ...prev]);
  };

  // Admin handlers
  const handleUpdateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications((prev) => 
      prev.map(app => app.id === id ? { ...app, status } : app)
    );
  };

  const handleUpdateApplicationNotes = (id: string, adminNotes: string) => {
    setApplications((prev) => 
      prev.map(app => app.id === id ? { ...app, adminNotes } : app)
    );
  };

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter(app => app.id !== id));
  };

  const handleAddVacancy = (vacData: Omit<Vacancy, 'id' | 'publishedAt'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const newVacancy: Vacancy = {
      ...vacData,
      id: `vac-${Date.now()}`,
      publishedAt: formattedDate
    };

    setVacancies((prev) => [newVacancy, ...prev]);
  };

  const handleDeleteVacancy = (id: string) => {
    setVacancies((prev) => prev.filter(v => v.id !== id));
  };

  const handleApproveReview = (id: string) => {
    setReviews((prev) => 
      prev.map(rev => rev.id === id ? { ...rev, approved: true } : rev)
    );
  };

  const handleDeleteReview = (id: string) => {
    setReviews((prev) => prev.filter(rev => rev.id !== id));
  };

  // Filter reviews for client representation
  const clientApprovedReviews = reviews.filter(r => r.approved);
  const unreadAppsCount = applications.filter(app => app.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      
      {/* Top Global Switcher Bar */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-slate-900 border-b border-slate-850 z-50 px-4 flex items-center justify-between">
        
        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-amber-500">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>СИНХРОНІЗОВАНА МЕРЕЖА:</span>
        </div>

        {/* Action Toggle Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          
          <button
            onClick={() => setActiveSite('client')}
            className={`flex items-center gap-1.5 px-4 py-1 rounded-md text-[11px] font-black tracking-wider transition-all uppercase ${
              activeSite === 'client'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1️⃣ Сайт Кандидата</span>
          </button>

          <button
            onClick={() => setActiveSite('admin')}
            className={`flex items-center gap-1.5 px-4 py-1 rounded-md text-[11px] font-black tracking-wider transition-all uppercase relative ${
              activeSite === 'admin'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>2️⃣ Адмін CRM (Заявки)</span>
            
            {/* Blinking Badge if new applications */}
            {unreadAppsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 text-[8px] font-black text-white items-center justify-center">
                  {unreadAppsCount}
                </span>
              </span>
            )}
          </button>

        </div>

        {/* User context information */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>xzx10707@gmail.com</span>
        </div>

      </div>

      {/* Render selected workspace view */}
      <div className="flex-1">
        {activeSite === 'client' ? (
          <ClientSite 
            vacancies={vacancies}
            reviews={clientApprovedReviews}
            branches={branches}
            onApply={handleApply}
            onAddReview={handleAddReview}
            userEmail="xzx10707@gmail.com"
          />
        ) : (
          <AdminSite 
            vacancies={vacancies}
            applications={applications}
            reviews={reviews}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onUpdateApplicationNotes={handleUpdateApplicationNotes}
            onDeleteApplication={handleDeleteApplication}
            onAddVacancy={handleAddVacancy}
            onDeleteVacancy={handleDeleteVacancy}
            onApproveReview={handleApproveReview}
            onDeleteReview={handleDeleteReview}
          />
        )}
      </div>

    </div>
  );
}

