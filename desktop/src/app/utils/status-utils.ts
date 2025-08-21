export function translateStatus(status: 'pending' | 'accepted' | 'rejected'): string {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'accepted':
      return 'Aceito';
    case 'rejected':
      return 'Rejeitado';
    default:
      return status;
  }
}
