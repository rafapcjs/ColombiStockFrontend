"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Mail, Phone, User as UserIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserInSession } from "@/hooks/auth/useUserInSession";
 import { UserInSessionModel } from "@/types/UserMode";
import ProfileEditModal from "./profileEditModa";

interface ProfileCardProps {
  isInModal?: boolean;
  onEditClick?: () => void;
}

export default function ProfileCard({
  isInModal = false,
  onEditClick,
}: ProfileCardProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<UserInSessionModel | null>(
    null
  );

  // Consume hook
  const { fetchUser, user, isLoading, error } = useUserInSession();

  // Al montar, carga el usuario en sesión
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Cuando llega el usuario, lo guardamos en estado local
  useEffect(() => {
    if (user) setProfileData(user);
  }, [user]);

  // Mostrar loading mientras carga
  if (isLoading || !profileData) {
    return (
      <div className={isInModal ? "" : "max-w-md mx-auto p-4"}>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveProfile = (updatedData: UserInSessionModel) => {
    console.log("Datos actualizados:", updatedData);
    setProfileData(updatedData);
    // Redirigir a la página de perfil después de guardar
    router.push('/profile');
  };

  const handleEditClick = () => {
    if (isInModal && onEditClick) onEditClick();
    else setIsEditModalOpen(true);
  };

  return (
    <div className={isInModal ? "" : "max-w-md mx-auto"}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Perfil de Usuario</CardTitle>
              <CardDescription>
                Información personal y de contacto
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleEditClick}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {profileData.name} {profileData.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                @{profileData.username}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profileData.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profileData.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">DNI:</span>
              <span>{profileData.dni}</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Roles</p>
            <div className="flex flex-wrap gap-2">
              {profileData.roleRequest.roleListName.map((role) => (
                <Badge key={role} variant="outline">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleEditClick}>
            Editar Perfil
          </Button>
        </CardFooter>
      </Card>

      {/* Modal de edición */}
      {!isInModal && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profileData={profileData!}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
