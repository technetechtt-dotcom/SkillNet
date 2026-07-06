import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './context/AuthContext';
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
type Screen =
'onboarding-slides' |
'welcome' |
'sign-in' |
'register' |
'profile-setup' |
'main' |
'job-detail' |
'chat-conversation' |
'video-upload' |
'notifications' |
'rating-review' |
'wallet-withdraw' |
'skill-swap' |
'job-hubs' |
'certifications' |
'edit-profile' |
'settings' |
'transaction-detail' |
'worker-profile' |
'skills-management' |
'invoice-list' |
'create-invoice' |
'invoice-detail' |
'stories' |
'skill-challenges' |
'explore' |
'create-duet' |
'share-profile' |
'create-job' |
'apply-job' |
'impact-dashboard' |
'government-hub' |
'program-detail' |
'settings-detail' |
'wallet-action' |
'new-message' |
'call-screen' |
'saved-jobs' |
'wallet';
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

  useEffect(() => {
    if (!isLoading && isAuthenticated && currentScreen === 'onboarding-slides') {
      setCurrentScreen('main');
    }
  }, [isLoading, isAuthenticated, currentScreen]);

  const handleRegister = async (skills: { name: string; icon: string }[]) => {
    if (!registrationDraft) throw new Error('Missing registration data');
    await register({
      ...registrationDraft,
      skills,
    });
    setRegistrationDraft(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentScreen('main');
  };
  const openJobDetail = (jobId: string) => {
    setSelectedJobId(jobId);
    setCurrentScreen('job-detail');
  };
  const openChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setCurrentScreen('chat-conversation');
  };
  const goBack = () => {
    setCurrentScreen('main');
  };
  // Render the active tab content
  const renderMainTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeFeed
            onUploadVideo={() => setCurrentScreen('video-upload')}
            onNotifications={() => setCurrentScreen('notifications')}
            onSearch={() => {
              setActiveTab('jobs');
              setCurrentScreen('main');
            }}
            onStories={() => setCurrentScreen('stories')}
            onExplore={() => setCurrentScreen('explore')}
            onChallenges={() => setCurrentScreen('skill-challenges')}
            onDuet={() => setCurrentScreen('create-duet')} />);


      case 'jobs':
        return (
          <JobMarketplace
            onJobClick={openJobDetail}
            onSkillSwap={() => setCurrentScreen('skill-swap')}
            onJobHubs={() => setCurrentScreen('job-hubs')}
            onCreateJob={() => setCurrentScreen('create-job')}
            onSavedJobs={() => setCurrentScreen('saved-jobs')} />);


      case 'skill-hub':
        return (
          <SkillHub
            onChallenges={() => setCurrentScreen('skill-challenges')}
            onCertifications={() => setCurrentScreen('certifications')}
            onSkillSwap={() => setCurrentScreen('skill-swap')}
            onSkillsManagement={() => setCurrentScreen('skills-management')}
            onProgramClick={(id) => {
              setSelectedProgramId(id);
              setCurrentScreen('program-detail');
            }} />);


      case 'messages':
        return (
          <ChatList
            onChatClick={openChat}
            onNewMessage={() => setCurrentScreen('new-message')} />);


      case 'profile':
        return (
          <SkillProfile
            onToggleTheme={toggleTheme}
            isDark={isDark}
            onCertifications={() => setCurrentScreen('certifications')}
            onEditProfile={() => setCurrentScreen('edit-profile')}
            onUploadVideo={() => setCurrentScreen('video-upload')}
            onAddSkill={() => setCurrentScreen('skills-management')}
            onSettings={() => setCurrentScreen('settings')}
            onShareProfile={() => setCurrentScreen('share-profile')}
            onImpactDashboard={() => setCurrentScreen('impact-dashboard')}
            onWallet={() => setCurrentScreen('wallet')} />);


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
          <OnboardingSlides onComplete={() => setCurrentScreen('welcome')} />);

      case 'welcome':
        return (
          <OnboardingWelcome
            onNext={() => setCurrentScreen('register')}
            onSignIn={() => setCurrentScreen('sign-in')} />);


      case 'sign-in':
        return (
          <SignIn
            onBack={() => setCurrentScreen('welcome')}
            onSignIn={() => setCurrentScreen('main')}
            onCreateAccount={() => setCurrentScreen('register')}
            onLogin={login} />);


      case 'register':
        return (
          <OnboardingRegister
            onNext={(draft) => {
              setRegistrationDraft(draft);
              setCurrentScreen('profile-setup');
            }}
            onBack={() => setCurrentScreen('welcome')} />);


      case 'profile-setup':
        return (
          <OnboardingProfileSetup
            onComplete={() => setCurrentScreen('main')}
            onBack={() => setCurrentScreen('register')}
            onRegister={handleRegister} />);


      case 'main':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">{renderMainTab()}</div>
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              unreadMessages={3} />
            
          </div>);

      case 'job-detail':
        return (
          <JobDetail
            jobId={selectedJobId || 'j1'}
            onBack={goBack}
            onApplyClick={() => setCurrentScreen('apply-job')}
            onEmployerClick={(id) => {
              setSelectedWorkerId(id);
              setCurrentScreen('worker-profile');
            }} />);


      case 'chat-conversation':
        return (
          <ChatConversation
            chatId={selectedChatId || 'c1'}
            onBack={goBack}
            onCall={(video) => {
              setIsVideoCall(video);
              setCurrentScreen('call-screen');
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
              setSelectedWorkerId(id);
              setCurrentScreen('worker-profile');
            }} />);


      case 'rating-review':
        return <RatingReview onBack={goBack} />;
      case 'wallet':
        return (
          <Wallet
            onBack={() => {
              setActiveTab('profile');
              setCurrentScreen('main');
            }}
            onWithdraw={() => setCurrentScreen('wallet-withdraw')}
            onAddMoney={() => {
              setWalletActionType('add');
              setCurrentScreen('wallet-action');
            }}
            onSendMoney={() => {
              setWalletActionType('send');
              setCurrentScreen('wallet-action');
            }}
            onTransactionClick={(id) => {
              setSelectedTransactionId(id);
              setCurrentScreen('transaction-detail');
            }}
            onInvoices={() => setCurrentScreen('invoice-list')} />);


      case 'wallet-withdraw':
        return (
          <WalletWithdraw
            onBack={() => setCurrentScreen('wallet')}
            onSuccess={() => setCurrentScreen('wallet')} />);


      case 'skill-swap':
        return <SkillSwap onBack={goBack} />;
      case 'job-hubs':
        return (
          <JobHubs
            onBack={goBack}
            onWorkerClick={(id) => {
              setSelectedWorkerId(id);
              setCurrentScreen('worker-profile');
            }}
            onChatClick={(id) => {
              setSelectedChatId(id);
              setCurrentScreen('chat-conversation');
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
              setCurrentScreen('welcome');
            }}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onNavigate={(pageId) => {
              setSelectedSettingsPage(pageId);
              setCurrentScreen('settings-detail');
            }} />);


      case 'transaction-detail':
        return (
          <TransactionDetail
            transactionId={selectedTransactionId || 't1'}
            onBack={goBack} />);


      case 'worker-profile':
        return (
          <WorkerProfile
            workerId={selectedWorkerId || 'w1'}
            onBack={goBack}
            onMessage={() => setCurrentScreen('chat-conversation')}
            onHire={() => setCurrentScreen('rating-review')} />);


      case 'skills-management':
        return <SkillsManagement onBack={goBack} />;
      case 'invoice-list':
        return (
          <InvoiceList
            onBack={goBack}
            onCreateNew={() => setCurrentScreen('create-invoice')}
            onInvoiceClick={(id) => {
              setSelectedInvoiceId(id);
              setCurrentScreen('invoice-detail');
            }} />);


      case 'create-invoice':
        return (
          <CreateInvoice
            onBack={() => setCurrentScreen('invoice-list')}
            onSave={() => setCurrentScreen('invoice-list')} />);


      case 'invoice-detail':
        return (
          <InvoiceDetail
            invoiceId={selectedInvoiceId || 'inv1'}
            onBack={() => setCurrentScreen('invoice-list')}
            onEdit={() => setCurrentScreen('create-invoice')} />);


      case 'stories':
        return (
          <Stories
            onBack={goBack}
            onProfileClick={(id) => {
              setSelectedWorkerId(id);
              setCurrentScreen('worker-profile');
            }} />);


      case 'skill-challenges':
        return <SkillChallenges onBack={goBack} />;
      case 'explore':
        return (
          <Explore
            onBack={goBack}
            onWorkerClick={(id) => {
              setSelectedWorkerId(id);
              setCurrentScreen('worker-profile');
            }}
            onChallenges={() => setCurrentScreen('skill-challenges')} />);


      case 'create-duet':
        return <CreateDuet onBack={goBack} />;
      case 'share-profile':
        return <ShareProfile onBack={goBack} />;
      case 'create-job':
        return (
          <CreateJobPost
            onBack={goBack}
            onSubmit={() => {
              setActiveTab('jobs');
              setCurrentScreen('main');
            }} />);


      case 'apply-job':
        return (
          <ApplyJob
            jobId={selectedJobId || 'j1'}
            onBack={() => setCurrentScreen('job-detail')}
            onSubmit={() => {
              setActiveTab('jobs');
              setCurrentScreen('main');
            }} />);


      case 'impact-dashboard':
        return <ImpactDashboard onBack={goBack} />;
      case 'government-hub':
        return (
          <GovernmentHub
            onBack={goBack}
            onProgramClick={(id) => {
              setSelectedProgramId(id);
              setCurrentScreen('program-detail');
            }} />);


      case 'program-detail':
        return (
          <ProgramDetail
            programId={selectedProgramId}
            onBack={() => {
              setActiveTab('skill-hub');
              setCurrentScreen('main');
            }} />);


      case 'settings-detail':
        return (
          <SettingsDetail
            pageId={selectedSettingsPage}
            onBack={() => setCurrentScreen('settings')} />);


      case 'wallet-action':
        return (
          <WalletAction
            actionType={walletActionType}
            onBack={() => setCurrentScreen('wallet')} />);


      case 'new-message':
        return (
          <NewMessage
            onBack={() => setCurrentScreen('main')}
            onChatClick={(id) => {
              setSelectedChatId(id);
              setCurrentScreen('chat-conversation');
            }} />);


      case 'call-screen':
        return (
          <CallScreen
            chatId={selectedChatId || 'c1'}
            isVideo={isVideoCall}
            onEndCall={() => setCurrentScreen('chat-conversation')} />);


      case 'saved-jobs':
        return (
          <SavedJobs
            onBack={() => setCurrentScreen('main')}
            onJobClick={openJobDetail} />);


      default:
        return (
          <OnboardingSlides onComplete={() => setCurrentScreen('welcome')} />);

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