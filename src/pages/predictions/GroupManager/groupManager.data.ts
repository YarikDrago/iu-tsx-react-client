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
      ownerId: number;
      inviteCode: string;
      members: GroupMember[];
    });

type ShowParams = ShowParamsCommon & ShowParamsOptional;

export class GroupManagerData {
  private _isVisible: boolean = false;
  private _isNew = false;
  private _oldName: string = '';
  id = -1;
  name: string = '';
  competition: Competition | null = null;
  ownerId = -1;
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
    this.ownerId = params.isNew ? -1 : params.ownerId;
    this.inviteCode = params.isNew ? '' : params.inviteCode;
    this.members = params.isNew ? [] : params.members;
  }

  hide() {
    this._isVisible = false;
    this.resetForm();
  }

  private resetForm() {
    this.name = '';
    this.inviteCode = '';
    this.members = [];
    this.competition = null;
    this.season = null;
    this.id = -1;
    this._oldName = '';
    this._isNew = false;
    this.ownerId = -1;
  }
}
