import { Dispatch, createContext, useContext, useReducer, FC, ReactNode, useEffect } from 'react';
import { Repo, RepoSchema } from '../lib/models/repo';

type ReposDispatch = {
  type: string;
  repos: Array<RepoSchema>;
}

const ReposContext = createContext<Array<RepoSchema> | null>(null);

const ReposDispatchContext = createContext<Dispatch<ReposDispatch> | null>(null);

export const ReposProvider: FC<{ children: ReactNode }> = ({ children }) => {
  let initial: Array<RepoSchema> = [];
  const [repos, dispatch] = useReducer(
    reposReducer,
    initial
  );

  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.sync.get(['repos']).then((result) => {
        if (result.repos) {
          dispatch({ type: 'add', repos: result.repos.map((m: any) => new Repo(m)) });
        }
      })
    }
  }, []);


  return (
    <ReposContext.Provider value={repos}>
      <ReposDispatchContext.Provider value={dispatch}>
        {children}
      </ReposDispatchContext.Provider>
    </ReposContext.Provider>
  );
}

export function useRepos() {
  return useContext(ReposContext);
}

export function useReposDispatch() {
  return useContext(ReposDispatchContext);
}

function reposReducer(repos: Array<RepoSchema>, action: ReposDispatch) {
  switch (action.type) {
    case 'add': {
      const items = action.repos.reduce((prev: Array<RepoSchema>, curr: RepoSchema) => {
        if (prev.findIndex((f) => f.id == curr.id) == -1) {
          prev.push(curr);
        }
        return prev;
      }, [...repos])
      return items;
    }
    case 'update': {
      if (action.repos)
        return repos.map(r => {
          const idx = action.repos.findIndex((f) => f.id == r.id);
          if (idx != -1) {
            return action.repos[idx];
          } else {
            return r;
          }
        });
    }
    case 'delete': {
      return repos.filter(repo => action.repos.findIndex((f) => f.id == repo.id) == -1);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
