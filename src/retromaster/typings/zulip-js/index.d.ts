declare module "zulip-js" {
  export interface Zulip {
    callEndpoint(
      endpoint: string,
      method: string,
      options?: {
        to: string;
        type: string;
        subject: string;
        content: string;
      }
    ): Promise<any>;
  }

  export default function zulipInit(options: {
    zuliprc: string;
  }): Promise<Zulip>;
}
