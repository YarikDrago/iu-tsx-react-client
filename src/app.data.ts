import { makeAutoObservable } from 'mobx';
import Cookies from 'js-cookie';

import { GroupManagerData } from '@/pages/predictions/GroupManager/groupManager.data';

class AppData {
  private _nickname: string = '';
  /* User roles */
  role: string[] = [];
  loadingCount = 0;
  group = new GroupManagerData();

  public get nickname(): string {
    return this._nickname;
  }
  /* The AbortController is used for aborting requests.
   * Create a new AbortController each time before requests */
  abortRequestSignal: AbortController | null = null;

  constructor() {
    makeAutoObservable(this);
    this.checkNickname();
  }

  changeNickname(nickname: string) {
    this._nickname = nickname;
    Cookies.set('nickname', nickname);
  }

  checkNickname() {
    this._nickname = Cookies.get('nickname') || '';
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
