import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export type SendContactMessageDto = {
  email: string;
  message: string;
};

export async function sendContactMessage(dto: SendContactMessageDto) {
  return await universalFetchRequest('mail/contact', HTMLRequestMethods.POST, dto);
}
