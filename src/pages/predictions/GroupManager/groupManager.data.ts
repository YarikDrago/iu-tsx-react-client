import { makeAutoObservable } from 'mobx';

import { Predictions } from '@/pages/predictions/Predictions';

type ShowParamsCommon = {
  competition: Predictions | null;
};

type ShowParamsOptional = { isNew: true } | ({ isNew: false } & { oldName: string });

type ShowParams = ShowParamsCommon & ShowParamsOptional;

export class GroupManagerData {
  private _isVisible: boolean = false;
  private _isNew = false;
  private _oldName: string = '';
  name: string = '';
  competition: Predictions | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isVisible() {
    return this._isVisible;
  }

  get isNew() {
    return this._isNew;
  }

  show(params: ShowParams = { isNew: true, competition: null }) {
    this._isVisible = true;
    this._isNew = params.isNew;
    this.competition = params.competition;

    this._oldName = params.isNew ? '' : params.oldName;
  }

  hide() {
    this._isVisible = false;
    // TODO reset form
  }
}
