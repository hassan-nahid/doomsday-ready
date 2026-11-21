import { IMovieNode, IRewatchOrderResult } from "./movie.interface";

/**
 * Checks whether assigning `newPrerequisites` to `targetId` would introduce
 * a direct or transitive circular dependency.
 *
 * A cycle exists if `targetId` is directly in `newPrerequisites`, or if
 * following `prerequisites` edges starting from any item in `newPrerequisites`
 * can reach `targetId`.
 */
export function wouldCreateCycle(
    movieMap: Map<string, IMovieNode>,
    targetId: string,
    newPrerequisites: string[]
): boolean {
    if (newPrerequisites.includes(targetId)) {
        return true;
    }

    const visited = new Set<string>();
    const stack = [...newPrerequisites];

    while (stack.length > 0) {
        const currentId = stack.pop()!;
        if (currentId === targetId) {
            return true;
        }
        if (visited.has(currentId)) {
            continue;
        }
        visited.add(currentId);

        const currentMovie = movieMap.get(currentId);
        if (!currentMovie) {
            continue;
        }

        for (const prereqId of currentMovie.prerequisites) {
            if (!visited.has(prereqId)) {
                stack.push(prereqId);
            }
        }
    }

    return false;
}

/**
 * Computes the topological rewatch order for `targetId` using post-order DFS.
 * Returns every prerequisite movie (transitively) exactly once, ordered so
 * every movie appears after all of its prerequisites, excluding `targetId`.
 */
export function computeRewatchOrder(
    movieMap: Map<string, IMovieNode>,
    targetId: string
): IRewatchOrderResult {
    const target = movieMap.get(targetId);
    if (!target) {
        throw new Error(`Target movie ${targetId} not found`);
    }

    const visited = new Set<string>();
    const order: IMovieNode[] = [];

    function visit(movieId: string) {
        if (visited.has(movieId)) {
            return;
        }
        visited.add(movieId);

        const movie = movieMap.get(movieId);
        if (!movie) {
            return;
        }

        for (const prereqId of movie.prerequisites) {
            visit(prereqId);
        }

        order.push(movie);
    }

    for (const prereqId of target.prerequisites) {
        visit(prereqId);
    }

    let watchedCount = 0;
    let unwatchedRuntimeMinutes = 0;

    for (const movie of order) {
        if (movie.watched) {
            watchedCount += 1;
        } else {
            unwatchedRuntimeMinutes += movie.runtimeMinutes;
        }
    }

    return {
        target,
        order,
        watchedCount,
        totalCount: order.length,
        unwatchedRuntimeMinutes,
    };
}
