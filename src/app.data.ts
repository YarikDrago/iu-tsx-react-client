import { makeAutoObservable } from 'mobx';

class AppData {
  nickname: string = '';
  /* The AbortController is used for aborting requests.
   * Create a new AbortController each time before requests */
  abortRequestSignal: AbortController | null = null;

  constructor() {
    makeAutoObservable(this);
  }
}

export default new AppData();
