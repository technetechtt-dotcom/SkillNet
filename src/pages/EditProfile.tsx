import React, { useState, useRef } from 'react';
import { ArrowLeftIcon, CameraIcon } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { UserAvatar } from '../components/ui/UserAvatar';
interface EditProfileProps {
  onBack: () => void;
  onSave: () => void;
}
export function EditProfile({ onBack, onSave }: EditProfileProps) {
  const [name, setName] = useState('Kwame Mensah');
  const [bio, setBio] = useState(
    'Professional mechanic with 8 years of experience. Specializing in Toyota and Honda engines. Fast, reliable, and honest work.'
  );
  const [location, setLocation] = useState('Accra, Ghana');
  const [phone, setPhone] = useState('+233 55 123 4567');
  const [isSaving, setIsSaving] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => setActiveToast(null), 2000);
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      showToast('Photo updated successfully!');
    }
  };
  const handleSave = () => {
    showToast('Profile saved successfully!');
    setTimeout(() => {
      setIsSaving(false);
      onSave();
    }, 1000);
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-text-primary">Edit Profile</h1>
        </div>
      </div>

      {/* Toast Notification */}
      {activeToast &&
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-surface border border-border text-text-primary px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold animate-fade-in flex items-center gap-2">
          <span className="text-primary">✨</span> {activeToast}
        </div>
      }

      <div className="flex-1 overflow-y-auto p-4">
        {/* Avatar Edit */}
        <div className="flex flex-col items-center mt-6 mb-8">
          <div className="relative">
            <UserAvatar
              src="https://i.pravatar.cc/150?u=kwame"
              name="Kwame Mensah"
              size="lg"
              className="w-24 h-24 text-3xl shadow-md" />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-background hover:bg-primary-dark transition-colors">
              
              <CameraIcon className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-sm font-bold text-primary hover:text-primary-dark transition-colors">
            
            Change Profile Photo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden" />
          
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary focus:outline-none focus:border-primary text-base" />
            
          </div>

          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary focus:outline-none focus:border-primary text-base resize-none" />
            
            <p className="text-xs text-text-secondary mt-1 text-right">
              {bio.length}/150
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary focus:outline-none focus:border-primary text-base" />
            
          </div>

          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary focus:outline-none focus:border-primary text-base" />
            
          </div>
        </div>

        <div className="h-8" />
      </div>

      {/* Bottom Action */}
      <div className="p-4 bg-surface border-t border-border flex-shrink-0">
        <ActionButton
          onClick={handleSave}
          loading={isSaving}
          variant="gradient">
          
          Save Changes
        </ActionButton>
      </div>
    </div>);

}