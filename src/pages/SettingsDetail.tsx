import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  HelpCircleIcon,
  FileTextIcon,
  ChevronRightIcon,
  PlusIcon } from
'lucide-react';
interface SettingsDetailProps {
  pageId: string;
  onBack: () => void;
}
export function SettingsDetail({ pageId, onBack }: SettingsDetailProps) {
  const [showToast, setShowToast] = useState(false);
  const handleAction = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };
  const renderContent = () => {
    switch (pageId) {
      case 'payment-methods':
        return (
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-xl border border-border">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                Saved Methods
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-teal-100 rounded flex items-center justify-center">
                      <span className="text-teal-800 font-bold text-xs">
                        VISA
                      </span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">•••• 4242</p>
                      <p className="text-xs text-muted-foreground">
                        Expires 12/25
                      </p>
                    </div>
                  </div>
                  <button className="text-sm text-red-500 font-medium">
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleAction}
              className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground font-medium flex items-center justify-center gap-2 hover:bg-card hover:text-foreground transition-colors">
              
              <PlusIcon className="w-5 h-5" />
              Add Payment Method
            </button>
          </div>);

      case 'security':
        return (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors">
                
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-teal-500" />
                  <span className="text-foreground font-medium">
                    Change Password
                  </span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors">
                
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-teal-500" />
                  <span className="text-foreground font-medium">
                    Two-Factor Authentication
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-teal-500/10 text-teal-500 px-2 py-1 rounded-full font-medium">
                    Enabled
                  </span>
                  <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-teal-500" />
                  <span className="text-foreground font-medium">
                    Login History
                  </span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>);

      case 'help':
        return (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors">
                
                <div className="flex items-center gap-3">
                  <HelpCircleIcon className="w-5 h-5 text-teal-500" />
                  <span className="text-foreground font-medium">FAQ</span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors">
                
                <div className="flex items-center gap-3">
                  <HelpCircleIcon className="w-5 h-5 text-teal-500" />
                  <span className="text-foreground font-medium">
                    Contact Support
                  </span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                
                <div className="flex items-center gap-3">
                  <HelpCircleIcon className="w-5 h-5 text-teal-500" />
                  <span className="text-foreground font-medium">
                    Report an Issue
                  </span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>);

      case 'terms':
        return (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors">
                
                <div className="flex items-center gap-3">
                  <FileTextIcon className="w-5 h-5 text-teal-500" />
                  <span className="text-foreground font-medium">
                    Terms of Service
                  </span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors">
                
                <div className="flex items-center gap-3">
                  <FileTextIcon className="w-5 h-5 text-teal-500" />
                  <span className="text-foreground font-medium">
                    Privacy Policy
                  </span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                
                <div className="flex items-center gap-3">
                  <FileTextIcon className="w-5 h-5 text-teal-500" />
                  <span className="text-foreground font-medium">
                    Community Guidelines
                  </span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>);

      default:
        return null;
    }
  };
  const getTitle = () => {
    switch (pageId) {
      case 'payment-methods':
        return 'Payment Methods';
      case 'security':
        return 'Security';
      case 'help':
        return 'Help Center';
      case 'terms':
        return 'Terms & Policies';
      default:
        return 'Settings';
    }
  };
  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="flex items-center p-4 border-b border-border">
        <button onClick={onBack} className="p-2 -ml-2 mr-2">
          <ArrowLeftIcon className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground flex-1">
          {getTitle()}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>

      {showToast &&
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap z-50">
          Action initiated
        </div>
      }
    </div>);

}