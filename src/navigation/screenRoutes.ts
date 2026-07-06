import { TabType } from '../components/ui/BottomNav';

export type Screen =
  | 'onboarding-slides'
  | 'welcome'
  | 'sign-in'
  | 'register'
  | 'profile-setup'
  | 'main'
  | 'job-detail'
  | 'chat-conversation'
  | 'video-upload'
  | 'notifications'
  | 'rating-review'
  | 'wallet-withdraw'
  | 'skill-swap'
  | 'job-hubs'
  | 'certifications'
  | 'edit-profile'
  | 'settings'
  | 'transaction-detail'
  | 'worker-profile'
  | 'skills-management'
  | 'invoice-list'
  | 'create-invoice'
  | 'invoice-detail'
  | 'stories'
  | 'skill-challenges'
  | 'explore'
  | 'create-duet'
  | 'share-profile'
  | 'create-job'
  | 'apply-job'
  | 'impact-dashboard'
  | 'government-hub'
  | 'program-detail'
  | 'settings-detail'
  | 'wallet-action'
  | 'new-message'
  | 'call-screen'
  | 'saved-jobs'
  | 'wallet';

export interface NavParams {
  tab?: TabType;
  jobId?: string;
  chatId?: string;
  workerId?: string;
  invoiceId?: string;
  transactionId?: string;
  programId?: string;
  settingsPage?: string;
  walletAction?: 'add' | 'send';
  isVideoCall?: boolean;
}

export function screenToPath(screen: Screen, params: NavParams = {}): string {
  switch (screen) {
    case 'onboarding-slides':
      return '/onboarding';
    case 'welcome':
      return '/welcome';
    case 'sign-in':
      return '/sign-in';
    case 'register':
      return '/register';
    case 'profile-setup':
      return '/setup';
    case 'main':
      return params.tab && params.tab !== 'home'
        ? `/app?tab=${params.tab}`
        : '/app';
    case 'job-detail':
      return `/jobs/${params.jobId}`;
    case 'apply-job':
      return `/jobs/${params.jobId}/apply`;
    case 'chat-conversation':
      return `/chat/${params.chatId}`;
    case 'call-screen':
      return `/chat/${params.chatId}/call${params.isVideoCall ? '?video=1' : ''}`;
    case 'wallet':
      return '/wallet';
    case 'wallet-withdraw':
      return '/wallet/withdraw';
    case 'wallet-action':
      return `/wallet/${params.walletAction || 'add'}`;
    case 'invoice-list':
      return '/invoices';
    case 'create-invoice':
      return '/invoices/new';
    case 'invoice-detail':
      return `/invoices/${params.invoiceId}`;
    case 'worker-profile':
      return `/workers/${params.workerId}`;
    case 'notifications':
      return '/notifications';
    case 'video-upload':
      return '/upload';
    case 'edit-profile':
      return '/profile/edit';
    case 'settings':
      return '/settings';
    case 'skills-management':
      return '/profile/skills';
    case 'saved-jobs':
      return '/jobs/saved';
    case 'create-job':
      return '/jobs/new';
    case 'new-message':
      return '/messages/new';
    case 'explore':
      return '/explore';
    case 'stories':
      return '/stories';
    case 'skill-challenges':
      return '/challenges';
    case 'create-duet':
      return '/duet';
    case 'share-profile':
      return '/profile/share';
    case 'impact-dashboard':
      return '/impact';
    case 'certifications':
      return '/certifications';
    case 'skill-swap':
      return '/skill-swap';
    case 'job-hubs':
      return '/job-hubs';
    case 'government-hub':
      return '/government';
    case 'program-detail':
      return `/programs/${params.programId || 'grants'}`;
    case 'settings-detail':
      return `/settings/${params.settingsPage || 'help'}`;
    case 'transaction-detail':
      return `/wallet/transactions/${params.transactionId}`;
    case 'rating-review':
      return '/reviews';
    default:
      return '/app';
  }
}

export function pathToScreen(
  pathname: string,
  search: string
): { screen: Screen; params: NavParams } | null {
  const tab = new URLSearchParams(search).get('tab') as TabType | null;

  if (pathname === '/onboarding') return { screen: 'onboarding-slides', params: {} };
  if (pathname === '/welcome') return { screen: 'welcome', params: {} };
  if (pathname === '/sign-in') return { screen: 'sign-in', params: {} };
  if (pathname === '/register') return { screen: 'register', params: {} };
  if (pathname === '/setup') return { screen: 'profile-setup', params: {} };
  if (pathname === '/app') return { screen: 'main', params: { tab: tab || 'home' } };
  if (pathname === '/notifications') return { screen: 'notifications', params: {} };
  if (pathname === '/wallet') return { screen: 'wallet', params: {} };
  if (pathname === '/wallet/withdraw') return { screen: 'wallet-withdraw', params: {} };
  if (pathname === '/wallet/add') return { screen: 'wallet-action', params: { walletAction: 'add' } };
  if (pathname === '/wallet/send') return { screen: 'wallet-action', params: { walletAction: 'send' } };
  if (pathname === '/invoices') return { screen: 'invoice-list', params: {} };
  if (pathname === '/invoices/new') return { screen: 'create-invoice', params: {} };
  if (pathname === '/upload') return { screen: 'video-upload', params: {} };
  if (pathname === '/profile/edit') return { screen: 'edit-profile', params: {} };
  if (pathname === '/profile/skills') return { screen: 'skills-management', params: {} };
  if (pathname === '/profile/share') return { screen: 'share-profile', params: {} };
  if (pathname === '/settings') return { screen: 'settings', params: {} };
  if (pathname === '/jobs/saved') return { screen: 'saved-jobs', params: {} };
  if (pathname === '/jobs/new') return { screen: 'create-job', params: {} };
  if (pathname === '/messages/new') return { screen: 'new-message', params: {} };
  if (pathname === '/explore') return { screen: 'explore', params: {} };
  if (pathname === '/stories') return { screen: 'stories', params: {} };
  if (pathname === '/challenges') return { screen: 'skill-challenges', params: {} };
  if (pathname === '/impact') return { screen: 'impact-dashboard', params: {} };
  if (pathname === '/certifications') return { screen: 'certifications', params: {} };
  if (pathname === '/skill-swap') return { screen: 'skill-swap', params: {} };
  if (pathname === '/job-hubs') return { screen: 'job-hubs', params: {} };
  if (pathname === '/government') return { screen: 'government-hub', params: {} };
  if (pathname === '/duet') return { screen: 'create-duet', params: {} };
  if (pathname === '/reviews') return { screen: 'rating-review', params: {} };

  const programMatch = pathname.match(/^\/programs\/([^/]+)$/);
  if (programMatch) {
    return { screen: 'program-detail', params: { programId: programMatch[1] } };
  }

  const settingsMatch = pathname.match(/^\/settings\/([^/]+)$/);
  if (settingsMatch) {
    return { screen: 'settings-detail', params: { settingsPage: settingsMatch[1] } };
  }

  const txMatch = pathname.match(/^\/wallet\/transactions\/([^/]+)$/);
  if (txMatch) {
    return { screen: 'transaction-detail', params: { transactionId: txMatch[1] } };
  }

  const jobMatch = pathname.match(/^\/jobs\/([^/]+)(\/apply)?$/);
  if (jobMatch) {
    return {
      screen: jobMatch[2] ? 'apply-job' : 'job-detail',
      params: { jobId: jobMatch[1] },
    };
  }

  const chatMatch = pathname.match(/^\/chat\/([^/]+)(\/call)?$/);
  if (chatMatch) {
    const isVideo = new URLSearchParams(search).get('video') === '1';
    return {
      screen: chatMatch[2] ? 'call-screen' : 'chat-conversation',
      params: { chatId: chatMatch[1], isVideoCall: isVideo },
    };
  }

  const invoiceMatch = pathname.match(/^\/invoices\/([^/]+)$/);
  if (invoiceMatch && invoiceMatch[1] !== 'new') {
    return { screen: 'invoice-detail', params: { invoiceId: invoiceMatch[1] } };
  }

  const workerMatch = pathname.match(/^\/workers\/([^/]+)$/);
  if (workerMatch) {
    return { screen: 'worker-profile', params: { workerId: workerMatch[1] } };
  }

  return null;
}
