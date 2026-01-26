import { makeAutoObservable } from 'mobx';
import Cookies from 'js-cookie';

class AppData {
  private _nickname: string = '';

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
}

export default new AppData();
