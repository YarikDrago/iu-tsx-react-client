import { makeAutoObservable } from 'mobx';
import Cookies from 'js-cookie';

import { GroupManagerData } from '@/pages/predictions/GroupManager/groupManager.data';

class AppData {
  private _nickname: string = '';
  private _user_id: number = -1;
  /* User roles */
  role: string[] = [];
  loadingCount = 0;
  group = new GroupManagerData();

  public get nickname(): string {
    return this._nickname;
  }

  public get userId(): number {
    return this._user_id;
  }
  /* The AbortController is used for aborting requests.
   * Create a new AbortController each time before requests */
  abortRequestSignal: AbortController | null = null;

  constructor() {
    makeAutoObservable(this);
    this.checkNickname();
    this.checkUserId();
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

  get isLoading() {
    return this.loadingCount > 0;
  }
}

export default new AppData();
