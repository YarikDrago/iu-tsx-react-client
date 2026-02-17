import { makeAutoObservable } from 'mobx';

import { Competition } from '@/pages/predictions/models/competition.dto';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { Season } from '@/pages/predictions/models/season.dto';

type ShowParamsCommon = {
  competition: Competition;
  season: Season;
};

type ShowParamsOptional =
  | { isNew: true }
  | ({ isNew: false } & {
      id: number;
      oldName: string;
      name: string;
      inviteCode: string;
    });

type ShowParams = ShowParamsCommon & ShowParamsOptional;

export class GroupManagerData {
  private _isVisible: boolean = false;
  private _isNew = false;
  private _oldName: string = '';
  id = -1;
  name: string = '';
  competition: Competition | null = null;
  season: Season | null = null;
  members: GroupMember[] = [];
  inviteCode = '';

  constructor() {
    makeAutoObservable(this);
  }

  get isVisible() {
    return this._isVisible;
  }

  get isNew() {
    return this._isNew;
  }

  get oldName() {
    return this._oldName;
  }

  show(params: ShowParams) {
    this._isVisible = true;
    this._isNew = params.isNew;
    this.competition = params.competition;
    this.season = params.season;

    this.id = params.isNew ? -1 : params.id;
    this._oldName = params.isNew ? '' : params.oldName;
    this.name = params.isNew ? '' : params.name;
    this.inviteCode = params.isNew ? '' : params.inviteCode;
  }

  hide() {
    this._isVisible = false;
    // TODO reset form
  }
}
