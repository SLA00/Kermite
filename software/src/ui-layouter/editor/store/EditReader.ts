import { appState, IEnvBoolPropKey, IModeState } from './AppState';
import { getKeyboardDesignBoundingBox } from './BoundingBoxCalculator';
import { IKeyEntity, IOutlinePoint, IOutlineShape } from './DataSchema';
import { getCoordUnitFromUnitSpec, ICoordUnit } from './PlacementUnitHelper';
import { createSimpleSelector } from './StoreUtils';

class EditReader {
  get editorTarget() {
    return appState.editor.editorTarget;
  }

  get editMode() {
    return appState.editor.editMode;
  }

  get ghost() {
    return appState.env.ghost;
  }

  get sight() {
    return appState.env.sight;
  }

  get design() {
    return appState.editor.design;
  }

  private coordUnitSelector = createSimpleSelector(
    () => appState.editor.design.placementUnit,
    getCoordUnitFromUnitSpec,
  );

  get coordUnit(): ICoordUnit {
    return this.coordUnitSelector();
  }

  get coordUnitSuffix(): 'mm' | 'KP' {
    return appState.editor.design.placementUnit.split(' ')[0] as 'mm' | 'KP';
  }

  get gridPitches(): [number, number] {
    const cu = this.coordUnit;
    if (this.editorTarget === 'key' && cu.mode === 'KP') {
      return [cu.x, cu.y];
    } else {
      return [10, 10];
    }
  }

  get snapDivision(): number {
    return appState.env.snapDivision;
  }

  getMode<K extends 'editorTarget' | 'editMode'>(fieldKey: K): IModeState[K] {
    return appState.editor[fieldKey];
  }

  getBoolOption<K extends IEnvBoolPropKey>(propKey: K) {
    return appState.env[propKey];
  }

  get showAxis() {
    return appState.env.showAxis;
  }

  get showGrid() {
    return appState.env.showGrid;
  }

  get snapToGrid() {
    return appState.env.snapToGrid;
  }

  get currentKeyEntity(): IKeyEntity | undefined {
    const { design, currentkeyEntityId } = appState.editor;
    return design.keyEntities[currentkeyEntityId || ''];
  }

  getKeyEntityById(id: string): IKeyEntity | undefined {
    return appState.editor.design.keyEntities[id];
  }

  get allKeyEntities(): IKeyEntity[] {
    return Object.values(appState.editor.design.keyEntities);
  }

  private displayAreaSelector = createSimpleSelector(
    () => appState.editor.design,
    getKeyboardDesignBoundingBox,
  );

  get dispalyArea() {
    return this.displayAreaSelector();
  }

  get allOutlineShapes() {
    return Object.values(appState.editor.design.outlineShapes);
  }

  get currentShapeId() {
    return appState.editor.currentShapeId;
  }

  get currentOutlineShape(): IOutlineShape | undefined {
    return appState.editor.design.outlineShapes[this.currentShapeId || ''];
  }

  get outlinePoints(): IOutlinePoint[] | undefined {
    return this.currentOutlineShape?.points;
  }

  get currentPointIndex() {
    return appState.editor.currentPointIndex;
  }

  get currentOutlinePoint(): IOutlinePoint | undefined {
    return this.outlinePoints?.[this.currentPointIndex];
  }

  get showConfig() {
    return appState.env.showConfig;
  }

  get keySizeUnit() {
    return appState.editor.design.keySizeUnit;
  }

  get placementAnchor() {
    return appState.editor.design.placementAnchor;
  }

  get showKeyId() {
    return appState.env.showKeyId;
  }

  get showKeyIndex() {
    return appState.env.showKeyIndex;
  }
}
export const editReader = new EditReader();
