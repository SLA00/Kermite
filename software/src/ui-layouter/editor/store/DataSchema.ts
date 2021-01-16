export type IKeySizeUnit = 'mm' | 'KP';

export type IKeyPlacementAnchor = 'topLeft' | 'center';

// ------------------------------------------------------
export interface IPersistentKeyEntity {
  keyId: string;
  x: number;
  y: number;
  angle: number;
  shape: string;
  keyIndex: number | undefined;
  groupId: string | undefined;
}

// export type IPersistOutlinePoint = { x: number; y: number };
export type IOutlinePoint = { x: number; y: number };

export type IPersistOutlineShape = {
  points: IOutlinePoint[];
  groupId: string | undefined;
};

export type IPersistTransGroup = {
  // groupId: string;
  x: number;
  y: number;
  angle: number;
};
export interface IPersistentKeyboardDesign {
  placementUnit: string;
  placementAnchor: IKeyPlacementAnchor;
  keySizeUnit: IKeySizeUnit;
  keyEntities: IPersistentKeyEntity[];
  outlineShapes: IPersistOutlineShape[];
  transGroups: IPersistTransGroup[];
}

// ------------------------------------------------------
export interface IEditKeyEntity {
  id: string; // 編集中のみ一意の値を保持,永続化の際には保存しない
  keyId: string;
  x: number;
  y: number;
  angle: number;
  shape: string; // `std ${width}` | `ref ${shapeName}`
  keyIndex: number;
  groupId: string;
}

export type IEditOutlineShape = {
  id: string; // 編集中のみ一意の値を保持,永続化の際には保存しない
  points: IOutlinePoint[];
  groupId: string;
};

export type IEditTransGroup = {
  id: string; // 編集中のみ一意の値を保持,永続化の際には保存しない, 値はインデクスを文字列化したもの
  // groupId: string;
  x: number;
  y: number;
  angle: number;
};
export interface IEditKeyboardDesign {
  placementUnit: string; // `mm` | `KP ${baseKeyPitch}`
  placementAnchor: IKeyPlacementAnchor;
  keySizeUnit: IKeySizeUnit; // 'mm' | 'KP'
  keyEntities: { [id: string]: IEditKeyEntity };
  outlineShapes: { [id: string]: IEditOutlineShape };
  transGroups: { [id: string]: IEditTransGroup };
}

// ------------------------------------------------------

export type IEditPropKey =
  | 'keyId'
  | 'x'
  | 'y'
  | 'angle'
  | 'shape'
  | 'keyIndex'
  | 'groupId';
