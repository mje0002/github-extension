import { Dispatch, createContext, useContext, useReducer, FC, ReactNode } from 'react';
import { ConfigSchema, keyOfConfig } from '../lib/models/configuration';

type ConfigDispatch = {
  type: string;
  field: keyof ConfigSchema;
  value: ConfigSchema[keyof ConfigSchema];
}

const ConfigurationContext = createContext<ConfigSchema | null>(null);

const ConfigurationDispatchContext = createContext<Dispatch<ConfigDispatch> | null>(null);

export const ConfigsRepo: FC<{ children: ReactNode }> = ({ children }) => {
  let initial: ConfigSchema = {
    personal_access_token: undefined,
    has_assigned: undefined
  };
  if (chrome.storage) {
    chrome.storage.sync.get(['configs'], (storage) => {
      initial = storage.repos as ConfigSchema;
    });
  }
  const [configs, dispatch] = useReducer(
    configurationReducer,
    initial
  );

  return (
    <ConfigurationContext.Provider value={configs}>
      <ConfigurationDispatchContext.Provider value={dispatch}>
        {children}
      </ConfigurationDispatchContext.Provider>
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  return useContext(ConfigurationContext);
}

export function useConfigurationDispatch() {
  return useContext(ConfigurationDispatchContext);
}

function setObjKeyValue<KeyType extends keyof ConfigSchema>(configs: ConfigSchema, key: KeyType, value: ConfigSchema[KeyType]) {
  configs[key] = value;
  return configs;
}

function configurationReducer(configs: ConfigSchema, action: ConfigDispatch) {
  switch (action.type) {
    case 'add': {
      if (!configs[action.field]) {
        return { ...setObjKeyValue({ ...configs }, action.field, action.value) };
      }

      return configs;
    }
    case 'update': {
      if (configs[action.field]) {
        return { ...setObjKeyValue({ ...configs }, action.field, action.value) };
      }
      return configs;
    }
    case 'delete': {
      if (configs[action.field]) {
        return { ...setObjKeyValue({ ...configs }, action.field, undefined) };
      }
      return configs;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
