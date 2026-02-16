import { makeAutoObservable } from 'mobx';

import { Competition } from '@/pages/predictions/models/competition.dto';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { Season } from '@/pages/predictions/models/season.dto';

type ShowParamsCommon = {
  competition: Competition | null;
  season: Season | null;
};

type ShowParamsOptional = { isNew: true } | ({ isNew: false } & { oldName: string });

type ShowParams = ShowParamsCommon & ShowParamsOptional;

export class GroupManagerData {
  private _isVisible: boolean = false;
  private _isNew = false;
  private _oldName: string = '';
  name: string = '';
  competition: Competition | null = null;
  season: Season | null = null;
  members: GroupMember[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get isVisible() {
    return this._isVisible;
  }

  get isNew() {
    return this._isNew;
  }

  show(params: ShowParams = { isNew: true, competition: null, season: null }) {
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
