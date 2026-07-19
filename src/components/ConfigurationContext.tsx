import { Dispatch, createContext, useContext, useReducer, FC, ReactNode, useEffect } from 'react';
import { ConfigSchema } from '../lib/models/configuration';
import { PATEntry } from '../lib/models/pat-entry';

type LoadAction        = { type: 'load';         configs: ConfigSchema }
type AddTokenAction    = { type: 'add-token';    token: PATEntry }
type UpdateTokenAction = { type: 'update-token'; token: PATEntry }
type DeleteTokenAction = { type: 'delete-token'; id: string }

type ConfigDispatch = LoadAction | AddTokenAction | UpdateTokenAction | DeleteTokenAction;

const ConfigurationContext = createContext<ConfigSchema | null>(null);
const ConfigurationDispatchContext = createContext<Dispatch<ConfigDispatch> | null>(null);

const initial: ConfigSchema = { tokens: [] };

export const ConfigsRepo: FC<{ children: ReactNode }> = ({ children }) => {
  const [configs, dispatch] = useReducer(configurationReducer, initial);

  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.sync.get(['configs']).then((storage) => {
        const stored = storage.configs as any;
        if (!stored) return;

        // Migration: legacy single personal_access_token → tokens array
        if (stored.personal_access_token && (!stored.tokens || stored.tokens.length === 0)) {
          dispatch({
            type: 'load',
            configs: {
              tokens: [{
                id: crypto.randomUUID(),
                label: 'Default',
                platform: 'github',
                token: stored.personal_access_token,
              }],
            },
          });
        } else {
          dispatch({ type: 'load', configs: stored as ConfigSchema });
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

function configurationReducer(configs: ConfigSchema, action: ConfigDispatch): ConfigSchema {
  switch (action.type) {
    case 'load':
      return { tokens: action.configs.tokens ?? [] };
    case 'add-token':
      return { ...configs, tokens: [...configs.tokens, action.token] };
    case 'update-token':
      return { ...configs, tokens: configs.tokens.map(t => t.id === action.token.id ? action.token : t) };
    case 'delete-token':
      return { ...configs, tokens: configs.tokens.filter(t => t.id !== action.id) };
    default:
      throw Error('Unknown action: ' + (action as any).type);
  }
}

