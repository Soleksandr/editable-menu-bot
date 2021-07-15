import { IUpdateMenuListRequestBody } from '../types';

export interface IUserData extends Pick<IUpdateMenuListRequestBody, 'menuList'> {
  activePage: number;
  messageId: number;
  chatId: number;
}
