import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { FC } from 'react';
import { debounce, isEmpty } from 'lodash';

import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { useStore } from '../store';
import { AddTag, ISceneScript } from '../assets/scripts/AddTag';
import { WidgetRuleScriptType } from '../models/SceneModels';

export const WidgetRuleManager: FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const widgetRuleMap = useStore(sceneComposerId)((state) => state.document.widgetRuleMap);
  const nodeMap = useStore(sceneComposerId)((state) => state.document.nodeMap);
  const getState = useStore(sceneComposerId).getState;
  const isEditing = useStore(sceneComposerId)((state) => state.isEditing);

  const ruleIdToScriptMap = useRef<Record<string, ISceneScript>>({})

  const widgetScripts = useMemo(() => {
    const newScriptsMap: Record<string, ISceneScript> = {};
    Object.keys(widgetRuleMap)
      .forEach((widgetRuleId) => {
        const widgetRule = widgetRuleMap[widgetRuleId];

        switch (widgetRule.script) {
          case WidgetRuleScriptType.AddTag:
            newScriptsMap[widgetRuleId] = new AddTag(widgetRuleId, { ...widgetRule });
            return;
          default:
            return;
        }
      })

      if (!isEmpty(ruleIdToScriptMap.current)) {
        const removeRules = Object.keys(ruleIdToScriptMap.current).filter((id) => !newScriptsMap[id])
        removeRules.forEach((ruleId) => {
            ruleIdToScriptMap.current[ruleId].clear(getState())
        })
      }
      ruleIdToScriptMap.current = newScriptsMap
      return Object.values(newScriptsMap);
  }, [widgetRuleMap]);

  //   useEffect(() => {
  //     console.log('xxxx execute', widgetScripts);
  //     widgetScripts.forEach((script) => {
  //     //   if (isEditing()) {
  //     //     script?.clear(getState);
  //     //   } else {
  //         script?.execute(getState);
  //     //   }
  //     });
  //   }, [widgetScripts, isEditing()]);

  // useEffect(
  //   debounce(() => {
  //     console.log('xxxx node change execute', widgetScripts);
  //     widgetScripts.forEach((script) => {
  //       if (isEditing()) {
  //         script?.clear(getState());
  //       } else {
  //       script?.execute(getState());
  //       }
  //     });
  //   }, 100),
  //   [nodeMap, widgetScripts, isEditing()],
  // );
  useEffect(
    debounce(() => {
      console.log('xxxx node change execute', widgetScripts);
      widgetScripts.forEach((script) => {
        // if (isEditing()) {
        //   script?.clear(getState());
        // } else {
        script?.execute(getState());
        // }
      });
    }, 100),
    [nodeMap, widgetScripts],
  );


  return <></>;
};
