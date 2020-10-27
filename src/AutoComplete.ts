import IQueryEmitter from "./IQueryEmitter";
import QueryAgent from "./QueryAgent";
import QueryAggregator from "./QueryAggregator";
import QueryNormalizer from "./QueryNormalizer";
import QueryTokenizer from "./QueryTokenizer";
import SortedView from "./SortedView";
import UniqueFilter from "./UniqueFilter";

export default class AutoComplete extends IQueryEmitter {
    protected subEmitter: IQueryEmitter;

    constructor(sources: string[], size: number) {
        super();

        const agents: IQueryEmitter[] = [];
        for (const source of sources) {
            agents.push(new QueryAgent(source));
        }

        const aggregator = new QueryAggregator(agents);
        const tokenizer = new QueryTokenizer(aggregator);
        const filter = new UniqueFilter(tokenizer);
        const sorted = new SortedView(size, filter);
        const normalizer = new QueryNormalizer(sorted);
        this.subEmitter = normalizer;

        this.subEmitter.on("data", (data) => this.emit("data", data));
        this.subEmitter.on("end", (data) => this.emit("end", data));
    }

    public async query(input: string) {
        this.subEmitter.query(input);
    }
}