/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

type Params = Record<string, string>;

interface ISearchResult<T> {
    node: RadixNode<T>;
    params: Params;
}

class RadixNode<T> {
    public segment: string;
    public children: RadixNode<T>[] = [];
    public value?: T;
    public isParam: boolean;
    public paramName?: string;

    constructor(segment: string) {
        this.segment = segment;
        this.isParam = segment.startsWith(":");
        
        if(this.isParam) {
            this.paramName = segment.slice(1);
        }
    }

    public matchChild(segment: string): RadixNode<T> | undefined {
        for(const child of this.children) {
            if(child.isParam || segment.startsWith(child.segment))
                return child; // param match
        }

        return undefined;
    }

    public findExactChild(segment: string): RadixNode<T> | undefined {
        return this.children.find(c => c.segment === segment);
    }

    public addChild(node: RadixNode<T>): void {
        this.children.push(node);
    }
}

export class RadixTree<T> {
    private readonly root = new RadixNode<T>("");

    public insert(path: string, value: T): void {
        const segments = this.normalize(path);
        this.insertRecursive(this.root, segments, value);
    }

    private insertRecursive(node: RadixNode<T>, segments: string[], value: T): void {
        if(segments.length === 0) {
            node.value = value;
            return;
        }

        const segment = segments[0] ?? "";

        let child = node.children.find(c =>
            c.isParam === segment.startsWith(":") &&
            (c.isParam || c.segment === segment)
        );

        if(!child) {
            child = new RadixNode<T>(segment);
            node.addChild(child);
        }

        this.insertRecursive(child, segments.slice(1), value);
    }

    public search(path: string): ISearchResult<T> | undefined {
        const segments = this.normalize(path);
        return this.searchRecursive(this.root, segments, {});
    }

    private searchRecursive(node: RadixNode<T>, segments: string[], params: Params): ISearchResult<T> | undefined {
        if(segments.length === 0) {
            if(node.value !== undefined) {
                return {
                    node: node,
                    params
                };
            }

            return undefined;
        }

        const [segment, ...rest] = segments;

        for(const child of node.children) {
            if(child.isParam) {
                const paramName = child.paramName!;
                
                const childParams: Params = {
                    ...params,
                    [paramName]: segment ?? "",
                };

                if(rest.length === 0) {
                    return {
                        node: child,
                        params: childParams
                    };
                }

                const result = this.searchRecursive(child, rest, childParams);
                
                if(result)
                    return result;
            }
            else if(segment === child.segment) {
                if(rest.length === 0) {
                    return {
                        node: child,
                        params
                    };
                }

                const result = this.searchRecursive(child, rest, params);

                if(result)
                    return result;
            }
        }

        return undefined;
    }

    private normalize(path: string): string[] {
        const segments = path
            .replace(/^\/+|\/+$/g, "")
            .split("/")
            .filter(Boolean);

        return ['', ...segments];
    } 
}
