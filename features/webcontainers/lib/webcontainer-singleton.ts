import { WebContainer } from "@webcontainer/api";

type WebContainerState = {
  instance: WebContainer | null;
  bootPromise: Promise<WebContainer> | null;
};

type CloudForgeGlobal = typeof globalThis & {
  __cloudForgeWebContainer?: WebContainerState;
};

const getWebContainerState = (): WebContainerState => {
  const globalScope = globalThis as CloudForgeGlobal;

  if (!globalScope.__cloudForgeWebContainer) {
    globalScope.__cloudForgeWebContainer = {
      instance: null,
      bootPromise: null,
    };
  }

  return globalScope.__cloudForgeWebContainer;
};

export const getWebContainerInstance = async (): Promise<WebContainer> => {
  const state = getWebContainerState();

  if (state.instance) return state.instance;

  if (!state.bootPromise) {
    state.bootPromise = WebContainer.boot()
      .then((instance) => {
        state.instance = instance;
        return instance;
      })
      .catch((error) => {
        state.bootPromise = null;
        throw error;
      });
  }

  return state.bootPromise;
};

export const teardownWebContainerInstance = () => {
  const state = getWebContainerState();

  state.instance?.teardown();
  state.instance = null;
  state.bootPromise = null;
};
