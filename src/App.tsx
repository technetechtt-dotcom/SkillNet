import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './context/AuthContext';
import { useAppNavigation } from './hooks/useAppNavigation';
import { Screen } from './navigation/screenRoutes';
import { BottomNav, TabType } from './components/ui/BottomNav';
import { OnboardingSlides } from './pages/OnboardingSlides';
import { OnboardingWelcome } from './pages/OnboardingWelcome';
import {
  OnboardingRegister,
  RegistrationDraft,
} from './pages/OnboardingRegister';
import { OnboardingProfileSetup } from './pages/OnboardingProfileSetup';
import { SignIn } from './pages/SignIn';
import { HomeFeed } from './pages/HomeFeed';
import { JobMarketplace } from './pages/JobMarketplace';
import { JobDetail } from './pages/JobDetail';
import { ChatList } from './pages/ChatList';
import { ChatConversation } from './pages/ChatConversation';
import { SkillProfile } from './pages/SkillProfile';
import { VideoUpload } from './pages/VideoUpload';
import { Notifications } from './pages/Notifications';
import { RatingReview } from './pages/RatingReview';
import { Wallet } from './pages/Wallet';
import { WalletWithdraw } from './pages/WalletWithdraw';
import { SkillSwap } from './pages/SkillSwap';
import { JobHubs } from './pages/JobHubs';
import { Certifications } from './pages/Certifications';
import { EditProfile } from './pages/EditProfile';
import { Settings } from './pages/Settings';
import { TransactionDetail } from './pages/TransactionDetail';
import { WorkerProfile } from './pages/WorkerProfile';
import { SkillsManagement } from './pages/SkillsManagement';
import { InvoiceList } from './pages/InvoiceList';
import { CreateInvoice } from './pages/CreateInvoice';
import { InvoiceDetail } from './pages/InvoiceDetail';
import { Stories } from './pages/Stories';
import { SkillChallenges } from './pages/SkillChallenges';
import { ShareProfile } from './pages/ShareProfile';
import { CreateDuet } from './pages/CreateDuet';
import { Explore } from './pages/Explore';
import { CreateJobPost } from './pages/CreateJobPost';
import { ApplyJob } from './pages/ApplyJob';
import { ImpactDashboard } from './pages/ImpactDashboard';
import { GovernmentHub } from './pages/GovernmentHub';
import { ProgramDetail } from './pages/ProgramDetail';
import { SettingsDetail } from './pages/SettingsDetail';
import { WalletAction } from './pages/WalletAction';
import { NewMessage } from './pages/NewMessage';
import { CallScreen } from './pages/CallScreen';
import { SavedJobs } from './pages/SavedJobs';
import { SkillHub } from './pages/SkillHub';
import { api } from './lib/api';

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, isLoading, login, register, logout } = useAuth();
  const [registrationDraft, setRegistrationDraft] =
    useState<RegistrationDraft | null>(null);
  const [currentScreen, setCurrentScreen] =
  useState<Screen>('onboarding-slides');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null>(
    null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [selectedProgramId, setSelectedProgramId] = useState<string>('grants');
  const [selectedSettingsPage, setSelectedSettingsPage] =
  useState<string>('help');
  const [walletActionType, setWalletActionType] = useState<'add' | 'send'>(
    'add'
  );
  const [isVideoCall, setIsVideoCall] = useState(false);

  const { goTo } = useAppNavigation({
    isAuthenticated,
    currentScreen,
    activeTab,
    selectedJobId,
    selectedChatId,
    selectedWorkerId,
    selectedInvoiceId,
    selectedProgramId,
    selectedSettingsPage,
    selectedTransactionId,
    walletActionType,
    isVideoCall,
    setCurrentScreen,
    setActiveTab,
    setSelectedJobId,
    setSelectedChatId,
    setSelectedWorkerId,
    setSelectedInvoiceId,
    setSelectedProgramId,
    setSelectedSettingsPage,
    setSelectedTransactionId,
    setWalletActionType,
    setIsVideoCall,
  });

  const { data: chats = [] } = useQuery({
    queryKey: ['chats'],
    queryFn: () => api.chats.list(),
    enabled: isAuthenticated,
  });

  const unreadMessages = chats.reduce((sum, c) => sum + c.unreadCount, 0);

  useEffect(() => {
    if (!isLoading && isAuthenticated && currentScreen === 'onboarding-slides') {
      goTo('main');
    }
  }, [isLoading, isAuthenticated, currentScreen, goTo]);

  const handleRegister = async (skills: { name: string; icon: string }[]) => {
    if (!registrationDraft) throw new Error('Missing registration data');
    await register({
      ...registrationDraft,
      skills,
    });
    setRegistrationDraft(null);
  };

  const handleTabChange = (tab: TabType) => {
    goTo('main', { tab });
  };
  const openJobDetail = (jobId: string) => {
    goTo('job-detail', { jobId });
  };
  const openChat = (chatId: string) => {
    goTo('chat-conversation', { chatId });
  };
  const goBack = () => {
    goTo('main');
  };
  // Render the active tab content
  const renderMainTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeFeed
            onUploadVideo={() => goTo('video-upload')}
            onNotifications={() => goTo('notifications')}
            onSearch={() => {
              goTo('main', { tab: 'jobs' });
            }}
            onStories={() => goTo('stories')}
            onExplore={() => goTo('explore')}
            onChallenges={() => goTo('skill-challenges')}
            onDuet={() => goTo('create-duet')} />);


      case 'jobs':
        return (
          <JobMarketplace
            onJobClick={openJobDetail}
            onSkillSwap={() => goTo('skill-swap')}
            onJobHubs={() => goTo('job-hubs')}
            onCreateJob={() => goTo('create-job')}
            onSavedJobs={() => goTo('saved-jobs')} />);


      case 'skill-hub':
        return (
          <SkillHub
            onChallenges={() => goTo('skill-challenges')}
            onCertifications={() => goTo('certifications')}
            onSkillSwap={() => goTo('skill-swap')}
            onSkillsManagement={() => goTo('skills-management')}
            onProgramClick={(id) => {
              setSelectedProgramId(id);
              goTo('program-detail', { programId: id });
            }} />);


      case 'messages':
        return (
          <ChatList
            onChatClick={openChat}
            onNewMessage={() => goTo('new-message')} />);


      case 'profile':
        return (
          <SkillProfile
            onToggleTheme={toggleTheme}
            isDark={isDark}
            onCertifications={() => goTo('certifications')}
            onEditProfile={() => goTo('edit-profile')}
            onUploadVideo={() => goTo('video-upload')}
            onAddSkill={() => goTo('skills-management')}
            onSettings={() => goTo('settings')}
            onShareProfile={() => goTo('share-profile')}
            onImpactDashboard={() => goTo('impact-dashboard')}
            onWallet={() => goTo('wallet')} />);


      default:
        return (
          <HomeFeed
            onUploadVideo={() => {}}
            onNotifications={() => {}}
            onSearch={() => {}}
            onStories={() => {}}
            onExplore={() => {}}
            onChallenges={() => {}} />);


    }
  };
  // Single screen rendering with switch
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding-slides':
        return (
          <OnboardingSlides onComplete={() => goTo('welcome')} />);

      case 'welcome':
        return (
          <OnboardingWelcome
            onNext={() => goTo('register')}
            onSignIn={() => goTo('sign-in')} />);


      case 'sign-in':
        return (
          <SignIn
            onBack={() => goTo('welcome')}
            onSignIn={() => goTo('main')}
            onCreateAccount={() => goTo('register')}
            onLogin={login} />);


      case 'register':
        return (
          <OnboardingRegister
            onNext={(draft) => {
              setRegistrationDraft(draft);
              goTo('profile-setup');
            }}
            onBack={() => goTo('welcome')} />);


      case 'profile-setup':
        return (
          <OnboardingProfileSetup
            onComplete={() => goTo('main')}
            onBack={() => goTo('register')}
            onRegister={handleRegister} />);


      case 'main':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">{renderMainTab()}</div>
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              unreadMessages={unreadMessages} />
            
          </div>);

      case 'job-detail':
        return (
          <JobDetail
            jobId={selectedJobId || 'j1'}
            onBack={goBack}
            onApplyClick={() => goTo('apply-job', { jobId: selectedJobId || undefined })}
            onEmployerClick={(id) => {
              goTo('worker-profile', { workerId: id });
            }} />);


      case 'chat-conversation':
        return (
          <ChatConversation
            chatId={selectedChatId || 'c1'}
            onBack={goBack}
            onCall={(video) => {
              goTo('call-screen', {
                chatId: selectedChatId || undefined,
                isVideoCall: video,
              });
            }} />);


      case 'video-upload':
        return <VideoUpload onBack={goBack} />;
      case 'notifications':
        return (
          <Notifications
            onBack={goBack}
            onJobClick={openJobDetail}
            onChatClick={openChat}
            onWorkerClick={(id) => {
              goTo('worker-profile', { workerId: id });
            }} />);


      case 'rating-review':
        return <RatingReview onBack={goBack} />;
      case 'wallet':
        return (
          <Wallet
            onBack={() => {
              goTo('main', { tab: 'profile' });
            }}
            onWithdraw={() => goTo('wallet-withdraw')}
            onAddMoney={() => {
              goTo('wallet-action', { walletAction: 'add' });
            }}
            onSendMoney={() => {
              goTo('wallet-action', { walletAction: 'send' });
            }}
            onTransactionClick={(id) => {
              setSelectedTransactionId(id);
              goTo('transaction-detail', { transactionId: id });
            }}
            onInvoices={() => goTo('invoice-list')} />);


      case 'wallet-withdraw':
        return (
          <WalletWithdraw
            onBack={() => goTo('wallet')}
            onSuccess={() => goTo('wallet')} />);


      case 'skill-swap':
        return <SkillSwap onBack={goBack} />;
      case 'job-hubs':
        return (
          <JobHubs
            onBack={goBack}
            onWorkerClick={(id) => {
              goTo('worker-profile', { workerId: id });
            }}
            onChatClick={(id) => {
              goTo('chat-conversation', { chatId: id });
            }} />);


      case 'certifications':
        return <Certifications onBack={goBack} />;
      case 'edit-profile':
        return <EditProfile onBack={goBack} onSave={goBack} />;
      case 'settings':
        return (
          <Settings
            onBack={goBack}
            onLogout={() => {
              logout();
              goTo('welcome');
            }}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onNavigate={(pageId) => {
              setSelectedSettingsPage(pageId);
              goTo('settings-detail', { settingsPage: pageId });
            }} />);


      case 'transaction-detail':
        return (
          <TransactionDetail
            transactionId={selectedTransactionId || 't1'}
            onBack={goBack} />);


      case 'worker-profile':
        return (
          <WorkerProfile
            workerId={selectedWorkerId || ''}
            onBack={goBack}
            onMessage={async () => {
              if (!selectedWorkerId) return;
              const { chatId } = await api.chats.start(selectedWorkerId);
              goTo('chat-conversation', { chatId });
            }}
            onHire={() => goTo('rating-review')} />);


      case 'skills-management':
        return <SkillsManagement onBack={goBack} />;
      case 'invoice-list':
        return (
          <InvoiceList
            onBack={goBack}
            onCreateNew={() => goTo('create-invoice')}
            onInvoiceClick={(id) => {
              goTo('invoice-detail', { invoiceId: id });
            }} />);


      case 'create-invoice':
        return (
          <CreateInvoice
            onBack={() => goTo('invoice-list')}
            onSave={() => goTo('invoice-list')} />);


      case 'invoice-detail':
        return (
          <InvoiceDetail
            invoiceId={selectedInvoiceId || ''}
            onBack={() => goTo('invoice-list')}
            onEdit={() => goTo('create-invoice')} />);


      case 'stories':
        return (
          <Stories
            onBack={goBack}
            onProfileClick={(id) => {
              goTo('worker-profile', { workerId: id });
            }} />);


      case 'skill-challenges':
        return <SkillChallenges onBack={goBack} />;
      case 'explore':
        return (
          <Explore
            onBack={goBack}
            onWorkerClick={(id) => {
              goTo('worker-profile', { workerId: id });
            }}
            onChallenges={() => goTo('skill-challenges')} />);


      case 'create-duet':
        return <CreateDuet onBack={goBack} />;
      case 'share-profile':
        return <ShareProfile onBack={goBack} />;
      case 'create-job':
        return (
          <CreateJobPost
            onBack={goBack}
            onSubmit={() => {
              goTo('main', { tab: 'jobs' });
            }} />);


      case 'apply-job':
        return (
          <ApplyJob
            jobId={selectedJobId || 'j1'}
            onBack={() => goTo('job-detail', { jobId: selectedJobId || undefined })}
            onSubmit={() => {
              goTo('main', { tab: 'jobs' });
            }} />);


      case 'impact-dashboard':
        return <ImpactDashboard onBack={goBack} />;
      case 'government-hub':
        return (
          <GovernmentHub
            onBack={goBack}
            onProgramClick={(id) => {
              setSelectedProgramId(id);
              goTo('program-detail', { programId: id });
            }} />);


      case 'program-detail':
        return (
          <ProgramDetail
            programId={selectedProgramId}
            onBack={() => {
              goTo('main', { tab: 'skill-hub' });
            }} />);


      case 'settings-detail':
        return (
          <SettingsDetail
            pageId={selectedSettingsPage}
            onBack={() => goTo('settings')} />);


      case 'wallet-action':
        return (
          <WalletAction
            actionType={walletActionType}
            onBack={() => goTo('wallet')} />);


      case 'new-message':
        return (
          <NewMessage
            onBack={() => goTo('main', { tab: 'messages' })}
            onChatClick={(id) => {
              goTo('chat-conversation', { chatId: id });
            }} />);


      case 'call-screen':
        return (
          <CallScreen
            chatId={selectedChatId || 'c1'}
            isVideo={isVideoCall}
            onEndCall={() =>
              goTo('chat-conversation', { chatId: selectedChatId || undefined })
            } />);


      case 'saved-jobs':
        return (
          <SavedJobs
            onBack={() => goTo('main', { tab: 'jobs' })}
            onJobClick={openJobDetail} />);


      default:
        return (
          <OnboardingSlides onComplete={() => goTo('welcome')} />);

    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="w-full max-w-md bg-background h-[100dvh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex justify-center">
      <div className="w-full max-w-md bg-background relative flex flex-col h-[100dvh] shadow-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            transition={{
              duration: 0.2
            }}
            className="flex-1 flex flex-col h-full overflow-hidden">
            
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>);

}