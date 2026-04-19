import { makeAutoObservable } from 'mobx';
import Cookies from 'js-cookie';

import { GroupManagerData } from '@/pages/predictions/components/GroupManager/groupManager.data';
import { ToastItem, ToastVariant } from '@/shared/components/ToastsContainer/ToastsContainer';

class AppData {
  /* User roles */
  role: string[] = [];
  loadingCount = 0;
  group = new GroupManagerData();
  /* The AbortController is used for aborting requests.
   * Create a new AbortController each time before requests */
  abortRequestSignal: AbortController | null = null;
  private _user_id: number = -1;

  constructor() {
    makeAutoObservable(this);
    this.checkNickname();
    this.checkUserId();
  }

  private _nickname: string = '';

  public get nickname(): string {
    return this._nickname;
  }

  public get userId(): number {
    return this._user_id;
  }

  /* Toast notifications */
  _toasts: ToastItem[] = [];

  get toasts() {
    return this._toasts;
  }

  get isLoading() {
    return this.loadingCount > 0;
  }

  changeNickname(nickname: string) {
    this._nickname = nickname;
    Cookies.set('nickname', nickname);
  }

  checkNickname() {
    this._nickname = Cookies.get('nickname') || '';
  }

  changeUserId(userId: number) {
    this._user_id = userId;
    Cookies.set('user_id', userId.toString());
  }

  checkUserId() {
    this._user_id = parseInt(Cookies.get('user_id') || '-1');
  }

  showLoader() {
    this.loadingCount++;
  }

  hideLoader() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
  }

  addToast(message: string, variant: ToastVariant = 'neutral', duration: number = 4000) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    this._toasts = [...this._toasts, { id, message, variant, duration }];
  }

  onCloseToast = (id: string) => {
    this._toasts = this._toasts.filter((t) => t.id !== id);
  };
}

export default new AppData();
