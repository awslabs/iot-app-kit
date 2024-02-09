import { Object3D, Vector3 } from 'three';
import { StoreApi } from 'zustand';

import { CameraControlsType, KnownComponentType } from '../../interfaces';
import { ISceneNodeInternal, RootState } from '..';
import { DisplayMessageCategory, IEditorConfig } from '../internalInterfaces';
import { TransformControls } from '../../three/TransformControls';

import { createEditStateSlice, exportsForTesting } from './EditorStateSlice';

describe('createEditStateSlice', () => {
  const mockApi = jest.fn() as unknown as StoreApi<RootState>;

  it('should be able to getEditorConfig', () => {
    // Arrange
    const editorConfig = { message: 'this is a fake editor config' };
    const get = jest.fn(() => ({ editorConfig } as unknown as RootState)); // fake out get call
    const set = jest.fn();

    // Act
    const { getEditorConfig } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    const result = getEditorConfig();

    // Assert
    expect(result).toEqual(editorConfig);
    expect(get).toBeCalled();
  });

  [true, false].forEach((replace) => {
    it(`should be able to ${replace ? 'replace' : 'merge'} with setEditorConfig`, () => {
      // Arrange
      const editorConfig = { message: 'this is a fake editor config' };
      const draft = {
        lastOperation: undefined,
        editorConfig: { message: 'this is the initial draft that should be replaced', otherProp: 'other property' },
      };
      const get = jest.fn();
      const set = jest.fn((callback) => callback(draft));

      // Act
      const { setEditorConfig } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
      setEditorConfig(editorConfig as IEditorConfig, replace);

      // Assert
      expect(draft.lastOperation!).toEqual('setEditorConfig');

      if (replace) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(draft.editorConfig).toEqual(editorConfig);
      }
    });
  });

  ['Viewing', 'Editing'].forEach((operationMode) => {
    it(`should be able to get ${
      operationMode === 'Viewing'
    } when operationMode id ${operationMode} with isViewing`, () => {
      const editorConfig = { operationMode };
      const get = jest.fn(() => ({ editorConfig } as unknown as RootState)); // fake out get call
      const set = jest.fn();

      const { isViewing } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed

      expect(isViewing()).toEqual(operationMode === 'Viewing');
    });
  });

  ['Viewing', 'Editing'].forEach((operationMode) => {
    it(`should be able to get ${
      operationMode === 'Editing'
    } when operationMode id ${operationMode} with isEditing`, () => {
      const editorConfig = { operationMode };
      const get = jest.fn(() => ({ editorConfig } as unknown as RootState)); // fake out get call
      const set = jest.fn();

      const { isEditing } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed

      expect(isEditing()).toEqual(operationMode === 'Editing');
    });
  });

  it('should be able to getMessages', () => {
    // Arrange
    const messages = [
      { category: 'Info', message: 'this is a fake info', params: { test: 'test' } },
      { category: 'Warning', message: 'this is a fake warning' },
      { category: 'Error', message: 'this is a fake error' },
    ];
    const get = jest.fn(() => ({ messages } as unknown as RootState)); // fake out get call
    const set = jest.fn();

    // Act
    const { getMessages } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    const result = getMessages();

    // Assert
    expect(result).toEqual(messages);
    expect(get).toBeCalled();
  });

  it('should be able to addMessages', () => {
    // Arrange
    const messages = [
      { category: DisplayMessageCategory.Info, messageText: 'this is a fake info', params: { test: 'test' } },
      { category: DisplayMessageCategory.Warning, messageText: 'this is a fake warning' },
      { category: DisplayMessageCategory.Error, messageText: 'this is a fake error' },
    ];
    const draft = { lastOperation: undefined, messages };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { addMessages } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    addMessages(messages);

    // Assert
    expect(draft.lastOperation!).toEqual('addMessages');
    expect(draft.messages).toEqual(messages);
  });

  it('should be able to clearMessages', () => {
    // Arrange
    const messages = [
      { category: DisplayMessageCategory.Info, messageText: 'this is a fake info', params: { test: 'test' } },
      { category: DisplayMessageCategory.Warning, messageText: 'this is a fake warning' },
      { category: DisplayMessageCategory.Error, messageText: 'this is a fake error' },
    ];
    const draft = { lastOperation: undefined, messages };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { addMessages, clearMessages } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    addMessages(messages);
    clearMessages();

    // Assert
    expect(draft.lastOperation!).toEqual('clearMessages');
    expect(draft.messages).toEqual([]);
  });

  it('should be able to set convert scene modal visibility', () => {
    const draft = { lastOperation: undefined, convertSceneModalVisible: false };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setConvertSceneModalVisibility } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setConvertSceneModalVisibility(true);

    // Assert
    expect(draft.lastOperation!).toEqual('setConvertSceneModalVisibility');
    expect(draft.convertSceneModalVisible).toEqual(true);
  });

  it('should be able to set delete confirmation modal visibility', () => {
    const draft = {
      lastOperation: undefined,
      deleteConfirmationModalVisible: false,
      deleteConfirmationModalParams: undefined,
    };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setDeleteConfirmationModalVisible } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setDeleteConfirmationModalVisible(true, { type: 'deleteNode', nodeRef: 'node-ref' });

    // Assert
    expect(draft.lastOperation!).toEqual('setDeleteConfirmationModalVisible');
    expect(draft.deleteConfirmationModalVisible).toEqual(true);
    expect(draft.deleteConfirmationModalParams).toEqual({ type: 'deleteNode', nodeRef: 'node-ref' });
  });

  [true, false].forEach((modelLoading) => {
    it(`should be able to ${modelLoading ? 'loading' : 'not loading'} with setLoadingModelState`, () => {
      // Arrange
      const isLoadingModel = modelLoading;
      const draft = {
        lastOperation: undefined,
        isLoadingModel,
      };
      const get = jest.fn();
      const set = jest.fn((callback) => callback(draft));

      // Act
      const { setLoadingModelState } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
      setLoadingModelState(isLoadingModel);

      // Assert
      expect(draft.lastOperation!).toEqual('setLoadingModelState');
      expect(draft.isLoadingModel).toEqual(isLoadingModel);
    });
  });

  it('should be able to setSelectedSceneNodeRef', () => {
    // Arrange
    const selectedSceneNodeRef = 'nodeRef';
    const draft = { lastOperation: undefined, selectedSceneNodeRef };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setSelectedSceneNodeRef } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setSelectedSceneNodeRef(selectedSceneNodeRef);

    // Assert
    expect(draft.lastOperation!).toEqual('setSelectedSceneNodeRef');
    expect(draft.selectedSceneNodeRef).toEqual(selectedSceneNodeRef);
  });

  it('should be able to setHighlightedSceneNodeRef', () => {
    // Arrange
    const highlightedSceneNodeRef = 'nodeRef';
    const draft = { lastOperation: undefined, highlightedSceneNodeRef };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setHighlightedSceneNodeRef } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setHighlightedSceneNodeRef(highlightedSceneNodeRef);

    // Assert
    expect(draft.lastOperation!).toEqual('setHighlightedSceneNodeRef');
    expect(draft.highlightedSceneNodeRef).toEqual(highlightedSceneNodeRef);
  });

  it('should be able to setTransformControlMode', () => {
    // Arrange
    const transformControlMode = 'translate';
    const draft = { lastOperation: undefined, transformControlMode };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setTransformControlMode } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setTransformControlMode(transformControlMode);

    // Assert
    expect(draft.lastOperation!).toEqual('setTransformControlMode');
    expect(draft.transformControlMode).toEqual(transformControlMode);
  });

  it('should be able to setTransformControls', () => {
    // Arrange
    const transformControls = 'new TransformControls';
    const draft = { lastOperation: undefined, transformControls };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setTransformControls } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setTransformControls(transformControls as unknown as TransformControls);

    // Assert
    expect(draft.lastOperation!).toEqual('setTransformControls');
    expect(draft.transformControls).toEqual(transformControls);
  });

  it('should be able to setCameraControlsType', () => {
    // Arrange
    const cameraControls = 'new CameraControls';
    const draft = { lastOperation: undefined, cameraControls };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setCameraControlsType } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setCameraControlsType(cameraControls as CameraControlsType);

    // Assert
    expect(draft.lastOperation!).toEqual('setCameraControlsType');
    expect(draft.cameraControls).toEqual(cameraControls);
  });

  it('should be able to setCameraTarget', () => {
    // Arrange
    const cameraCommand = { target: 'target', mode: 'transition' };
    const draft = { lastOperation: undefined, cameraCommand };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setCameraTarget } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setCameraTarget(cameraCommand.target, 'transition');

    // Assert
    expect(draft.lastOperation!).toEqual('setCameraTarget');
    expect(draft.cameraCommand).toEqual(cameraCommand);
  });

  it('should be able to resetEditorState', () => {
    // Arrange
    const draft = {
      lastOperation: undefined,
      isLoadingModel: false,
      messages: [],
      selectedSceneNodeRef: undefined,
      highlightedSceneNodeRef: undefined,
      transformControls: undefined,
      transformControlMode: 'translate',
      cameraCommand: undefined,
      cameraControlsType: 'orbit',
      sceneNodeRefObject3DMapping: new exportsForTesting.MappingWrapper(),
    };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { resetEditorState } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    resetEditorState();

    // Assert
    expect(draft.lastOperation!).toEqual('resetEditorState');
    expect(draft).toEqual(draft);
  });

  it('should be able to setSceneNodeObject3DMapping', () => {
    // Arrange
    const object3D = new Object3D();
    const ref = 'testObject';
    const sceneNodeRefObject3DMapping = new exportsForTesting.MappingWrapper();
    sceneNodeRefObject3DMapping.getMapping()[ref] = object3D;
    const draft = { sceneNodeRefObject3DMapping };
    const get = jest.fn().mockReturnValue({ sceneNodeRefObject3DMapping: new exportsForTesting.MappingWrapper() });
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setSceneNodeObject3DMapping } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setSceneNodeObject3DMapping(ref, object3D);

    // Assert
    expect(draft.sceneNodeRefObject3DMapping).toEqual(sceneNodeRefObject3DMapping);
  });

  it('should be able to getObject3DBySceneNodeRef', () => {
    // Arrange
    const object3D = new Object3D();
    const ref = 'testObject';
    const nonRef = 'notHere';
    const sceneNodeRefObject3DMapping = new exportsForTesting.MappingWrapper();
    sceneNodeRefObject3DMapping.getMapping()[ref] = object3D;
    const draft = { sceneNodeRefObject3DMapping };
    const get = jest.fn().mockReturnValue(draft);
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { getObject3DBySceneNodeRef } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    const without = getObject3DBySceneNodeRef(nonRef);
    const nodeRef = getObject3DBySceneNodeRef(ref);
    // Assert
    expect(without).toBeUndefined();
    expect(nodeRef).toEqual(object3D);
  });

  it('should be able to setCursorPosition', () => {
    // Arrange
    const cursorPosition = new Vector3();
    const draft = { lastOperation: undefined, cursorPosition };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setCursorPosition } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setCursorPosition(cursorPosition);

    // Assert
    expect(draft.lastOperation!).toEqual('setCursorPosition');
    expect(draft.cursorPosition).toEqual(cursorPosition);
  });

  it('should be able to setCursorLookAt', () => {
    // Arrange
    const cursorLookAt = new Vector3();
    const draft = { lastOperation: undefined, cursorLookAt };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setCursorLookAt } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setCursorLookAt(cursorLookAt);

    // Assert
    expect(draft.lastOperation!).toEqual('setCursorLookAt');
    expect(draft.cursorLookAt).toEqual(cursorLookAt);
  });

  it('should be able to setCursorVisible', () => {
    // Arrange
    const cursorVisible = true;
    const draft = { lastOperation: undefined, cursorVisible };
    const get = jest.fn().mockReturnValue({});
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setCursorVisible } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setCursorVisible(cursorVisible);

    // Assert
    expect(draft.lastOperation!).toEqual('setCursorVisible');
    expect(draft.cursorVisible).toEqual(cursorVisible);
  });

  it('should be able to setCursorStyle', () => {
    // Arrange
    const cursorStyle = 'edit';
    const draft = { lastOperation: undefined, cursorStyle };
    const get = jest.fn().mockReturnValue({});
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setCursorStyle } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setCursorStyle(cursorStyle);

    // Assert
    expect(draft.lastOperation!).toEqual('setCursorStyle');
    expect(draft.cursorStyle).toEqual(cursorStyle);
  });

  it('should be able to setAddingWidget', () => {
    // Arrange
    const addingWidget = {
      type: KnownComponentType.Tag,
      node: {} as ISceneNodeInternal,
    };
    const draft = { lastOperation: undefined, addingWidget };
    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { setAddingWidget } = createEditStateSlice(set, get, mockApi); // api is never used in the function, so it's not needed
    setAddingWidget(addingWidget);

    // Assert
    expect(draft.lastOperation!).toEqual('setAddingWidget');
    expect(draft.addingWidget).toEqual(addingWidget);
  });
});
