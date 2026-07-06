import React, { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { BottomNav, TabType } from "./components/ui/BottomNav";
import { OnboardingSlides } from "./pages/OnboardingSlides";
import { OnboardingWelcome } from "./pages/OnboardingWelcome";
import { OnboardingRegister } from "./pages/OnboardingRegister";
import { OnboardingProfileSetup } from "./pages/OnboardingProfileSetup";
import { SignIn } from "./pages/SignIn";
import { HomeFeed } from "./pages/HomeFeed";
import { JobMarketplace } from "./pages/JobMarketplace";
import { JobDetail } from "./pages/JobDetail";
import { ChatList } from "./pages/ChatList";
import { ChatConversation } from "./pages/ChatConversation";
import { SkillProfile } from "./pages/SkillProfile";
import { VideoUpload } from "./pages/VideoUpload";
import { Notifications } from "./pages/Notifications";
import { RatingReview } from "./pages/RatingReview";
import { Wallet } from "./pages/Wallet";
import { WalletWithdraw } from "./pages/WalletWithdraw";
import { SkillsManagement } from "./pages/SkillsManagement";
import { useAuth } from "./hooks/useAuth";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isInitializing } = useAuth();
  if (isInitializing) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary">
        Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/welcome" replace />;
  }
  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/app/home" replace />;
  }
  return <>{children}</>;
}

function MainTabs({
  isDark,
  toggleTheme
}: {
  isDark: boolean;
  toggleTheme: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = (location.pathname.split("/")[2] || "home") as TabType;

  const onTabChange = (tab: TabType) => {
    navigate(`/app/${tab}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {activeTab === "home" && (
          <HomeFeed
            onUploadVideo={() => navigate("/video-upload")}
            onNotifications={() => navigate("/notifications")}
          />
        )}
        {activeTab === "jobs" && (
          <JobMarketplace onJobClick={(jobId) => navigate(`/jobs/${jobId}`)} />
        )}
        {activeTab === "wallet" && (
          <Wallet
            onWithdraw={() => navigate("/wallet/withdraw")}
            onTransactionClick={() => undefined}
          />
        )}
        {activeTab === "messages" && (
          <ChatList onChatClick={(chatId) => navigate(`/messages/${chatId}`)} />
        )}
        {activeTab === "profile" && (
          <SkillProfile
            onToggleTheme={toggleTheme}
            isDark={isDark}
            onAddSkill={() => navigate("/skills")}
            onUploadVideo={() => navigate("/video-upload")}
          />
        )}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} unreadMessages={3} />
    </div>
  );
}

function JobDetailRoute() {
  const navigate = useNavigate();
  const { jobId = "j1" } = useParams();
  return (
    <JobDetail
      jobId={jobId}
      onBack={() => navigate("/app/jobs")}
      onApply={() => navigate("/rating-review")}
    />
  );
}

function ChatRoute() {
  const navigate = useNavigate();
  const { chatId = "c1" } = useParams();
  return <ChatConversation chatId={chatId} onBack={() => navigate("/app/messages")} />;
}

export function App() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { signIn, register } = useAuth();
  const [pendingProfile, setPendingProfile] = useState<{
    name: string;
    phone: string;
    location: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 flex justify-center">
      <div className="w-full max-w-md bg-background relative flex flex-col h-[100dvh] shadow-2xl">
        <Routes>
          <Route
            path="/"
            element={
              <PublicOnly>
                <OnboardingSlides onComplete={() => navigate("/welcome")} />
              </PublicOnly>
            }
          />
          <Route
            path="/welcome"
            element={
              <PublicOnly>
                <OnboardingWelcome
                  onNext={() => navigate("/register")}
                  onSignIn={() => navigate("/sign-in")}
                />
              </PublicOnly>
            }
          />
          <Route
            path="/sign-in"
            element={
              <PublicOnly>
                <SignIn
                  onBack={() => navigate("/welcome")}
                  onSignIn={async ({ phone, password }) => {
                    await signIn(phone, password);
                    navigate("/app/home", { replace: true });
                  }}
                  onCreateAccount={() => navigate("/register")}
                />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <OnboardingRegister
                  onBack={() => navigate("/welcome")}
                  onNext={(payload) => {
                    setPendingProfile(payload);
                    navigate("/profile-setup");
                  }}
                />
              </PublicOnly>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <PublicOnly>
                <OnboardingProfileSetup
                  onBack={() => navigate("/register")}
                  onComplete={async () => {
                    if (!pendingProfile) {
                      navigate("/register");
                      return;
                    }
                    await register(pendingProfile);
                    navigate("/app/home", { replace: true });
                  }}
                />
              </PublicOnly>
            }
          />

          <Route
            path="/app/:tab"
            element={
              <RequireAuth>
                <MainTabs isDark={isDark} toggleTheme={toggleTheme} />
              </RequireAuth>
            }
          />
          <Route
            path="/jobs/:jobId"
            element={
              <RequireAuth>
                <JobDetailRoute />
              </RequireAuth>
            }
          />
          <Route
            path="/messages/:chatId"
            element={
              <RequireAuth>
                <ChatRoute />
              </RequireAuth>
            }
          />
          <Route
            path="/video-upload"
            element={
              <RequireAuth>
                <VideoUpload onBack={() => navigate("/app/home")} />
              </RequireAuth>
            }
          />
          <Route
            path="/notifications"
            element={
              <RequireAuth>
                <Notifications onBack={() => navigate("/app/home")} />
              </RequireAuth>
            }
          />
          <Route
            path="/rating-review"
            element={
              <RequireAuth>
                <RatingReview onBack={() => navigate("/app/jobs")} />
              </RequireAuth>
            }
          />
          <Route
            path="/wallet/withdraw"
            element={
              <RequireAuth>
                <WalletWithdraw
                  onBack={() => navigate("/app/wallet")}
                  onSuccess={() => navigate("/app/wallet")}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/skills"
            element={
              <RequireAuth>
                <SkillsManagement />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}