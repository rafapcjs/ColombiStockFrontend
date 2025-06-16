"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

import ProfileCard from "./profileCard";
import ProfileEditModal from "./profileEditModa";
import { useUserInSession } from "@/hooks/auth/useUserInSession";
import { UserInSessionModel } from "@/types/UserMode";
 
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { fetchUser, user, isLoading } = useUserInSession();
  const [profileData, setProfileData] = useState<UserInSessionModel | null>(null);

  // Fetch user data when modal opens
  useEffect(() => {
    if (isOpen) fetchUser();
  }, [isOpen, fetchUser]);

  // Update local state when user data arrives
  useEffect(() => {
    if (user) setProfileData(user);
  }, [user]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // Show loading spinner while fetching
  if (isLoading || !profileData) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" aria-hidden="true" onClick={onClose} />

      {/* Modal dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Mi Perfil</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <ProfileCard
              isInModal
              onEditClick={() => setIsEditModalOpen(true)}
              profileData={profileData}
            />
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {isEditModalOpen && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profileData={profileData}
          onSave={(data) => {
            setProfileData(data);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </>
  );
}
