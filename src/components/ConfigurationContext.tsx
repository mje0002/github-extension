import { Dispatch, createContext, useContext, useReducer, FC, ReactNode, useEffect } from 'react';
import { ConfigSchema, keyOfConfig } from '../lib/models/configuration';

type singleDispatch = {
  type: string;
  field: keyof ConfigSchema;
  value: ConfigSchema[keyof ConfigSchema];
}

type multiDispatch = {
  type: string;
  configs: ConfigSchema
}

type ConfigDispatch = singleDispatch | multiDispatch;

const ConfigurationContext = createContext<ConfigSchema | null>(null);

const ConfigurationDispatchContext = createContext<Dispatch<ConfigDispatch> | null>(null);

export const ConfigsRepo: FC<{ children: ReactNode }> = ({ children }) => {
  let initial: ConfigSchema = {
    personal_access_token: undefined,
    has_assigned: undefined
  };
  const [configs, dispatch] = useReducer(
    configurationReducer,
    initial
  );
  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.sync.get(['configs']).then((storage) => {
        initial = storage.configs as ConfigSchema;
        if (storage.configs) {
          dispatch({ type: 'add', configs: storage.configs });
        }
      });
    }
  }, []);

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

function isSingle(obj: any): obj is singleDispatch {
  return obj.field !== undefined;
}
function isFull(obj: any): obj is multiDispatch {
  return obj.configs !== undefined;
}

function setObjKeyValue<KeyType extends keyof ConfigSchema>(configs: ConfigSchema, key: KeyType, value: ConfigSchema[KeyType]) {
  configs[key] = value;
  return configs;
}

function configurationReducer(configs: ConfigSchema, action: ConfigDispatch) {
  switch (action.type) {
    case 'add': {
      if (isSingle(action)) {
        if (!configs[action.field]) {
          return { ...setObjKeyValue({ ...configs }, action.field, action.value) };
        }
      }

      if (isFull(action)) {
        return { ...action.configs };
      }

      return configs;
    }
    case 'update': {
      if (isSingle(action) && configs[action.field]) {
        return { ...setObjKeyValue({ ...configs }, action.field, action.value) };
      }
      return configs;
    }
    case 'delete': {
      if (isSingle(action) && configs[action.field]) {
        return { ...setObjKeyValue({ ...configs }, action.field, undefined) };
      }
      return configs;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
