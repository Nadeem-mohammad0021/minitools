declare module 'robots-txt-parser' {
    interface RobotsParserOptions {
        userAgent?: string;
        allowOnNeutral?: boolean;
    }

    interface RobotsParser {
        useRobotsFor(url: string, options: { get: () => Promise<string> }): Promise<void>;
        canCrawl(url: string): Promise<boolean>;
        parseRobots(url: string, content: string): Promise<void>;
        isAllowed(url: string, userAgent?: string): Promise<boolean>;
    }

    function robotsParser(options?: RobotsParserOptions): RobotsParser;
    export default robotsParser;
}
