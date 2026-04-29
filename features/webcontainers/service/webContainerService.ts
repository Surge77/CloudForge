import { WebContainer } from '@webcontainer/api';
import {
  getWebContainerInstance,
  teardownWebContainerInstance,
} from '@/features/webcontainers/lib/webcontainer-singleton';

type WebContainerFileSystem = Parameters<WebContainer['mount']>[0];
type WebContainerProcess = Awaited<ReturnType<WebContainer['spawn']>>;

// Singleton class to manage WebContainer instance
class WebContainerService {
  private static instance: WebContainerService | null = null;
  private webcontainerInstance: WebContainer | null = null;
  private mountPromise: Promise<void> | null = null;
  private activeUsers = 0;

  private constructor() {}

  public static getInstance(): WebContainerService {
    if (!WebContainerService.instance) {
      WebContainerService.instance = new WebContainerService();
    }
    return WebContainerService.instance;
  }

  public async getWebContainer(): Promise<WebContainer> {
    this.activeUsers++;
    
    if (this.webcontainerInstance) {
      return this.webcontainerInstance;
    }

    try {
      this.webcontainerInstance = await getWebContainerInstance();
      return this.webcontainerInstance;
    } catch (error) {
      throw error;
    }
  }

  public async mountFiles(files: WebContainerFileSystem): Promise<void> {
    const instance = await this.getWebContainer();
    
    if (!this.mountPromise) {
      this.mountPromise = instance.mount(files);
    }
    
    return this.mountPromise;
  }

  public async spawn(command: string, args: string[] = []): Promise<WebContainerProcess> {
    const instance = await this.getWebContainer();
    return instance.spawn(command, args);
  }

  public releaseInstance(): void {
    this.activeUsers--;
  }

  public teardown(): void {
    teardownWebContainerInstance();
    this.webcontainerInstance = null;
    this.mountPromise = null;
    this.activeUsers = 0;
  }

  public onServerReady(callback: (port: number, url: string) => void): void {
    if (this.webcontainerInstance) {
      this.webcontainerInstance.on('server-ready', callback);
    }
  }


}

export default WebContainerService.getInstance();
