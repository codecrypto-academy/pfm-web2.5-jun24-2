export interface NetworkNode {
    id:string;
    name: string;
    type: string;
    ip: string;
    port?: number;
    address: string,
    enode:string
}