import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabType } from '../components/ui/BottomNav';
import { NavParams, Screen, pathToScreen, screenToPath } from '../navigation/screenRoutes';

interface UseAppNavigationOptions {
  isAuthenticated: boolean;
  currentScreen: Screen;
  activeTab: TabType;
  selectedJobId: string | null;
  selectedChatId: string | null;
  selectedWorkerId: string | null;
  selectedInvoiceId: string | null;
  selectedProgramId: string;
  selectedSettingsPage: string;
  selectedTransactionId: string | null;
  walletActionType: 'add' | 'send';
  isVideoCall: boolean;
  setCurrentScreen: (s: Screen) => void;
  setActiveTab: (t: TabType) => void;
  setSelectedJobId: (id: string | null) => void;
  setSelectedChatId: (id: string | null) => void;
  setSelectedWorkerId: (id: string | null) => void;
  setSelectedInvoiceId: (id: string | null) => void;
  setSelectedProgramId: (id: string) => void;
  setSelectedSettingsPage: (id: string) => void;
  setSelectedTransactionId: (id: string | null) => void;
  setWalletActionType: (t: 'add' | 'send') => void;
  setIsVideoCall: (v: boolean) => void;
}

export function useAppNavigation(opts: UseAppNavigationOptions) {
  const navigate = useNavigate();
  const location = useLocation();

  const buildParams = useCallback(
    (overrides: NavParams = {}): NavParams => ({
      tab: overrides.tab ?? opts.activeTab,
      jobId: overrides.jobId ?? opts.selectedJobId ?? undefined,
      chatId: overrides.chatId ?? opts.selectedChatId ?? undefined,
      workerId: overrides.workerId ?? opts.selectedWorkerId ?? undefined,
      invoiceId: overrides.invoiceId ?? opts.selectedInvoiceId ?? undefined,
      programId: overrides.programId ?? opts.selectedProgramId,
      settingsPage: overrides.settingsPage ?? opts.selectedSettingsPage,
      transactionId: overrides.transactionId ?? opts.selectedTransactionId ?? undefined,
      walletAction: overrides.walletAction ?? opts.walletActionType,
      isVideoCall: overrides.isVideoCall ?? opts.isVideoCall,
      ...overrides,
    }),
    [opts]
  );

  const goTo = useCallback(
    (screen: Screen, params: NavParams = {}) => {
      if (params.tab) opts.setActiveTab(params.tab);
      if (params.jobId !== undefined) opts.setSelectedJobId(params.jobId);
      if (params.chatId !== undefined) opts.setSelectedChatId(params.chatId);
      if (params.workerId !== undefined) opts.setSelectedWorkerId(params.workerId);
      if (params.invoiceId !== undefined) opts.setSelectedInvoiceId(params.invoiceId);
      if (params.programId) opts.setSelectedProgramId(params.programId);
      if (params.settingsPage) opts.setSelectedSettingsPage(params.settingsPage);
      if (params.transactionId !== undefined) opts.setSelectedTransactionId(params.transactionId);
      if (params.walletAction) opts.setWalletActionType(params.walletAction);
      if (params.isVideoCall !== undefined) opts.setIsVideoCall(params.isVideoCall);

      opts.setCurrentScreen(screen);
      navigate(screenToPath(screen, buildParams(params)));
    },
    [navigate, opts, buildParams]
  );

  useEffect(() => {
    const parsed = pathToScreen(location.pathname, location.search);
    if (!parsed) return;

    const { screen, params } = parsed;

    if (params.tab) opts.setActiveTab(params.tab);
    if (params.jobId) opts.setSelectedJobId(params.jobId);
    if (params.chatId) opts.setSelectedChatId(params.chatId);
    if (params.workerId) opts.setSelectedWorkerId(params.workerId);
    if (params.invoiceId) opts.setSelectedInvoiceId(params.invoiceId);
    if (params.programId) opts.setSelectedProgramId(params.programId);
    if (params.settingsPage) opts.setSelectedSettingsPage(params.settingsPage);
    if (params.transactionId) opts.setSelectedTransactionId(params.transactionId);
    if (params.walletAction) opts.setWalletActionType(params.walletAction);
    if (params.isVideoCall !== undefined) opts.setIsVideoCall(params.isVideoCall);

    opts.setCurrentScreen(screen);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!opts.isAuthenticated) return;
    const publicPaths = ['/onboarding', '/welcome', '/sign-in', '/register', '/setup'];
    if (publicPaths.includes(location.pathname)) {
      navigate('/app', { replace: true });
    }
  }, [opts.isAuthenticated, location.pathname, navigate]);

  return { goTo };
}
