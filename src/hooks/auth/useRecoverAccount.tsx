// src/hooks/auth/useRecoverAccount.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { recoverPasswordFormGmail } from '@/services/auth';

export const useRecoverAccount = () => {
  const { mutate: recover, isPending } = useMutation<string, unknown, string>({
    mutationKey: ['user'],
    mutationFn: recoverPasswordFormGmail,
    onSuccess: () => {
      toast.success('¡Instrucciones enviadas por correo!');
    },
    onError: () => {
      toast.error('Error al enviar instrucciones. Verifica tu correo.');
    },
  });

  return { recover, isPending };
};
