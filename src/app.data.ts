import { makeAutoObservable } from 'mobx';

class AppData {
  nickname: string = '';

  constructor() {
    makeAutoObservable(this);
  }
}

export default new AppData();
