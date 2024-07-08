import { Alloc } from "./alloc";
import { NetworkNode } from "./networkNode";

export interface Network {
    id: string;
    name:string,
    chainId: number;    
    subnet: string;
    ipBootnode: string;
    alloc: Alloc[];
    nodes: NetworkNode[];
}