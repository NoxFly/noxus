/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

/**
 *
 */
type Params = Record<string, string>;

/**
 * Represents a search result in the Radix Tree.
 */
interface ISearchResult<T> {
    node: RadixNode<T>;
    params: Params;
}

/**
 * Represents a node in the Radix Tree.
 * The represents a path segment
 */
class RadixNode<T> {
    public segment: string;
    public children: RadixNode<T>[] = [];
    public value?: T;
    public isParam: boolean;
    public paramName?: string;

    /**
     * Creates a new RadixNode.
     * @param segment - The segment of the path this node represents.
     */
    constructor(segment: string) {
        this.segment = segment;
        this.isParam = segment.startsWith(":");

        if(this.isParam) {
            this.paramName = segment.slice(1);
        }
    }

    /**
     * Matches a child node against a given segment.
     * This method checks if the segment matches any of the children nodes.
     * @param segment - The segment to match against the children of this node.
     * @returns A child node that matches the segment, or undefined if no match is found.
     */
    public matchChild(segment: string): RadixNode<T> | undefined {
        for(const child of this.children) {
            if(child.isParam || segment.startsWith(child.segment))
                return child; // param match
        }

        return undefined;
    }

    /**
     * Finds a child node that matches the segment exactly.
     * This method checks if there is a child node that matches the segment exactly.
     * @param segment - The segment to find an exact match for among the children of this node.
     * @returns A child node that matches the segment exactly, or undefined if no match is found.
     */
    public findExactChild(segment: string): RadixNode<T> | undefined {
        return this.children.find(c => c.segment === segment);
    }

    /**
     * Adds a child node to this node's children.
     * This method adds a new child node to the list of children for this node.
     * @param node - The child node to add to this node's children.
     */
    public addChild(node: RadixNode<T>): void {
        this.children.push(node);
    }
}

/**
 *
 */
export class RadixTree<T> {
    private readonly root = new RadixNode<T>("");

    /**
     * Inserts a path and its associated value into the Radix Tree.
     * This method normalizes the path and inserts it into the tree, associating it with
     * @param path - The path to insert into the tree.
     * @param value - The value to associate with the path.
     */
    public insert(path: string, value: T): void {
        const segments = this.normalize(path);
        this.insertRecursive(this.root, segments, value);
    }

    /**
     * Recursively inserts a path into the Radix Tree.
     * This method traverses the tree and inserts the segments of the path, creating new nodes
     * @param node - The node to start inserting from.
     * @param segments - The segments of the path to insert.
     * @param value - The value to associate with the path.
     */
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

    /**
     * Searches for a path in the Radix Tree.
     * This method normalizes the path and searches for it in the tree, returning the node
     * @param path - The path to search for in the Radix Tree.
     * @returns An ISearchResult containing the node and parameters if a match is found, otherwise undefined.
     */
    public search(path: string): ISearchResult<T> | undefined {
        const segments = this.normalize(path);
        return this.searchRecursive(this.root, segments, {});
    }

    /**
     * Recursively searches for a path in the Radix Tree.
     * This method traverses the tree and searches for the segments of the path, collecting parameters
     * @param node - The node to start searching from.
     * @param segments - The segments of the path to search for.
     * @param params - The parameters collected during the search.
     * @returns An ISearchResult containing the node and parameters if a match is found, otherwise undefined.
     */
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

    /**
     * Normalizes a path into an array of segments.
     * This method removes leading and trailing slashes, splits the path by slashes, and
     * @param path - The path to normalize.
     * @returns An array of normalized path segments.
     */
    private normalize(path: string): string[] {
        const segments = path
            .replace(/^\/+|\/+$/g, "")
            .split("/")
            .filter(Boolean);

        return ['', ...segments];
    }
}
