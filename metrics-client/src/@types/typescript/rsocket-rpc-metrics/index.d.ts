declare module 'rsocket-rpc-metrics' {

  import { Single, Flowable } from 'rsocket-flowable';
  import * as jspb from "google-protobuf";
  import * as rsocket_flowable from 'rsocket-flowable';
  import {ReactiveSocket, Responder, Payload, ISubscriber, ISubscription} from 'rsocket-types';
  import {Empty} from "google-protobuf/google/protobuf/empty_pb";

  class MeterTag extends jspb.Message {
    getKey(): string;
    setKey(value: string): void;

    getValue(): string;
    setValue(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MeterTag.AsObject;
    static toObject(includeInstance: boolean, msg: MeterTag): MeterTag.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: MeterTag, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MeterTag;
    static deserializeBinaryFromReader(message: MeterTag, reader: jspb.BinaryReader): MeterTag;
  }

  namespace MeterTag {
    export type AsObject = {
      key: string,
      value: string,
    }
  }

  class MeterId extends jspb.Message {
    getName(): string;
    setName(value: string): void;

    clearTagList(): void;
    getTagList(): Array<MeterTag>;
    setTagList(value: Array<MeterTag>): void;
    addTag(value?: MeterTag, index?: number): MeterTag;

    getType(): MeterType;
    setType(value: MeterType): void;

    getDescription(): string;
    setDescription(value: string): void;

    getBaseunit(): string;
    setBaseunit(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MeterId.AsObject;
    static toObject(includeInstance: boolean, msg: MeterId): MeterId.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: MeterId, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MeterId;
    static deserializeBinaryFromReader(message: MeterId, reader: jspb.BinaryReader): MeterId;
  }

  namespace MeterId {
    export type AsObject = {
      name: string,
      tagList: Array<MeterTag.AsObject>,
      type: MeterType,
      description: string,
      baseunit: string,
    }
  }

  class MeterMeasurement extends jspb.Message {
    getValue(): number;
    setValue(value: number): void;

    getStatistic(): MeterStatistic;
    setStatistic(value: MeterStatistic): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MeterMeasurement.AsObject;
    static toObject(includeInstance: boolean, msg: MeterMeasurement): MeterMeasurement.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: MeterMeasurement, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MeterMeasurement;
    static deserializeBinaryFromReader(message: MeterMeasurement, reader: jspb.BinaryReader): MeterMeasurement;
  }

  namespace MeterMeasurement {
    export type AsObject = {
      value: number,
      statistic: MeterStatistic,
    }
  }

  class Meter extends jspb.Message {
    hasId(): boolean;
    clearId(): void;
    getId(): MeterId | undefined;
    setId(value?: MeterId): void;

    clearMeasureList(): void;
    getMeasureList(): Array<MeterMeasurement>;
    setMeasureList(value: Array<MeterMeasurement>): void;
    addMeasure(value?: MeterMeasurement, index?: number): MeterMeasurement;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Meter.AsObject;
    static toObject(includeInstance: boolean, msg: Meter): Meter.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: Meter, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Meter;
    static deserializeBinaryFromReader(message: Meter, reader: jspb.BinaryReader): Meter;
  }

  namespace Meter {
    export type AsObject = {
      id?: MeterId.AsObject,
      measureList: Array<MeterMeasurement.AsObject>,
    }
  }

  class MetricsSnapshot extends jspb.Message {
    getTagsMap(): jspb.Map<string, string>;
    clearTagsMap(): void;
    clearMetersList(): void;
    getMetersList(): Array<Meter>;
    setMetersList(value: Array<Meter>): void;
    addMeters(value?: Meter, index?: number): Meter;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MetricsSnapshot.AsObject;
    static toObject(includeInstance: boolean, msg: MetricsSnapshot): MetricsSnapshot.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: MetricsSnapshot, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MetricsSnapshot;
    static deserializeBinaryFromReader(message: MetricsSnapshot, reader: jspb.BinaryReader): MetricsSnapshot;
  }

  namespace MetricsSnapshot {
    export type AsObject = {
      tagsMap: Array<[string, string]>,
      metersList: Array<Meter.AsObject>,
    }
  }

  class Skew extends jspb.Message {
    getTimestamp(): number;
    setTimestamp(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Skew.AsObject;
    static toObject(includeInstance: boolean, msg: Skew): Skew.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: Skew, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Skew;
    static deserializeBinaryFromReader(message: Skew, reader: jspb.BinaryReader): Skew;
  }

  namespace Skew {
    export type AsObject = {
      timestamp: number,
    }
  }

   enum MeterType {
    COUNTER = 0,
    GAUGE = 1,
    LONG_TASK_TIMER = 2,
    TIMER = 3,
    DISTRIBUTION_SUMMARY = 4,
    OTHER = 5,
  }

   enum MeterStatistic {
    TOTAL = 0,
    TOTAL_TIME = 1,
    COUNT = 2,
    MAX = 3,
    VALUE = 4,
    UNKNOWN = 5,
    ACTIVE_TASKS = 6,
    DURATION = 7,
  }

   interface MetricsSnapshotHandler {
    streamMetrics(message: rsocket_flowable.Flowable<MetricsSnapshot>): rsocket_flowable.Flowable<Skew>;
    streamMetrics(message: rsocket_flowable.Flowable<MetricsSnapshot>, metadata: Buffer): rsocket_flowable.Flowable<Skew>;
  }

   class MetricsSnapshotHandlerClient implements MetricsSnapshotHandler {
    constructor(rs: ReactiveSocket<any, any>);
    constructor(rs: ReactiveSocket<any, any>, tracer: any);
    constructor(rs: ReactiveSocket<any, any>, tracer: any, meterRegistry: any);

    streamMetrics(message: rsocket_flowable.Flowable<MetricsSnapshot>): rsocket_flowable.Flowable<Skew>;
    streamMetrics(message: rsocket_flowable.Flowable<MetricsSnapshot>, metadata: Buffer): rsocket_flowable.Flowable<Skew>;
  }

   class MetricsSnapshotHandlerServer implements Responder<any, any> {
    constructor(service: MetricsSnapshotHandler);
    constructor(service: MetricsSnapshotHandler, tracer: any);
    constructor(service: MetricsSnapshotHandler, tracer: any, meterRegistry: any);

    fireAndForget(payload: Payload<any, any>): void;

    requestResponse(payload: Payload<any, any>): rsocket_flowable.Single<Payload<any, any>>;

    requestStream(payload: Payload<any, any>): rsocket_flowable.Flowable<Payload<any, any>>;

    requestChannel(payloads: rsocket_flowable.Flowable<Payload<any, any>>): rsocket_flowable.Flowable<Payload<any, any>>;

    metadataPush(payload: Payload<any, any>): rsocket_flowable.Single<void>;
  }


  class BinaryHeap<T> {

    constructor(scoreFunction: (t: T) => number);

    clone(): void;

    push(element: T): void

    peek(): T;

    pop(): T;

    remove(node: T): boolean;

    size(): number;

    bubbleUp(n: number): void;

    sinkDown(n: number): void;
  }

  class ExponentiallyDecayingSample<T> extends Sample<T> {
    constructor(size: number, alpha: number);

    // This is a relatively expensive operation
    getValues(): T[];

    size(): number;

    newHeap(): BinaryHeap<T>;

    now(): number;

    tick(): number;

    clear(): void;

    /*
    * timestamp in milliseconds
    */
    update(val: T, timestamp?: number): void;

    weight(time: number): number;

    // now: parameter primarily used for testing rescales
    rescale(now: number): void;
  }
  class EWMA {
    alpha: number;
    interval: number;
    initialized: boolean;
    currentRate: number;
    uncounted: number;
    tickInterval: any;

    constructor(alpha: number, interval: number);

    static createM1EWMA(): EWMA;
    static createM5EWMA(): EWMA;
    static createM15EWMA(): EWMA;

    update(n: number): void;

    /*
     * Update our rate measurements every interval
     */
    tick(): void;

    /*
     * Return the rate per second
     */
    rate(): number;

    stop(): void;
  }
  interface ISample<T> {
    init(): void;
    update(val: T, timestamp?: number): void;
    clear(): void;
    size(): number;
    getValues(): T[];
    print(): void;
  }
  class Sample<T> implements ISample<T> {

    constructor();

    init(): void;
    update(val: T, timestamp?: number): void;
    clear(): void;
    size(): number;
    getValues(): T[];
    print(): void;
  }
  class UniformSample<T> extends Sample<T> {
    limit: number;
    count: number;

    constructor(size: number);

    update(val: T, timestamp?: number): void;
  }
  class BaseMeter implements IMeter {
    m1Rate: EWMA;
    m5Rate: EWMA;
    m15Rate: EWMA;
    count: number;
    tags: RawMeterTag[];
    startTime: number;
    type: string;
    name: string;
    description: string | undefined;
    statistic: string;
    units: string;

    constructor(name: string, description?: string, tags?: RawMeterTag[]);

    convert(converter: (t: IMeter) => Meter[]): Meter[];

    // Mark the occurence of n events
    mark(n: number): number;

    rates(): any;

    // Rates are per second
    fifteenMinuteRate(): any;

    fiveMinuteRate(): any;

    oneMinuteRate(): any;

    meanRate(): any;

    tick(): any;

    toObject(): any;
  }
  class Counter extends BaseMeter {
    constructor(
      name: string,
      description: string | undefined,
      units: string,
      tags?: RawMeterTag[],
    );

    inc(val: number): void;

    dec(val: number): void;

    clear(): void;
  }
  class Gauge extends BaseMeter {
    m1Rate: EWMA;
    m5Rate: EWMA;
    m15Rate: EWMA;

    constructor(
      name: string,
      description: string | undefined,
      units: string,
      tags?: RawMeterTag[],
    );

    // Mark the occurence of n events
    mark(n: number): any;

    rates(): any;

    // Rates are per second
    fifteenMinuteRate(): any;

    fiveMinuteRate(): any;

    oneMinuteRate(): any;

    meanRate(): any;

    toObject(): any;

    tick(): void;
  }

  const DEFAULT_PERCENTILES: number[];

  /*
  * A histogram tracks the distribution of items, given a sample type 
  */
  class Histogram {
    sample: ISample<any>;
    min: number;
    max: number;
    sum: number;
    varianceM: number;
    varianceS: number;
    count: number;
    type: string;

    constructor(sample: ISample<any>);

    static createExponentialDecayHistogram(
      size: number,
      alpha: number,
    ): Histogram;

    static createUniformHistogram(size: number): Histogram;

    clear(): void;

    // timestamp param primarily used for testing
    update(val: number, timestamp?: number): void;

    updateVariance(val: number): void;

    // Pass an array of percentiles, e.g. [0.5, 0.75, 0.9, 0.99]
    percentiles(percentiles?: number[]): Object;
  }
  interface IMeter {
    name: string;
    description: string | undefined;
    statistic: string;
    type: string;
    tags: RawMeterTag[];
    units: string | undefined;
    rates(): any;
    convert(converter: (t: IMeter) => Meter[]): Meter[];
  }
  interface IMeterRegistry {
    registerMeter(meter: IMeter): void;
    registerMeters(meters: IMeter[]): void;
    meters(): IMeter[];
  }
  class MeterRegistry {
    meterMap: Object;

    constructor();

    registerMeter(meter: IMeter): void;
  }
  class Metrics {
    private constructor();

    static timed<T>(
      registry: IMeterRegistry | undefined,
      name: string,
      ...tags: Object[]
    ): <T>(f: Flowable<T>) => Flowable<T>;

    static timedSingle<T>(
      registry: IMeterRegistry | undefined,
      name: string,
      ...tags: Object[]
    ): <T>(f: Single<T>) => Single<T>;
  }
  class MetricsExporter {
    handler: MetricsSnapshotHandlerClient;
    registry: IMeterRegistry;
    exportPeriodSeconds: number;
    batchSize: number;
    intervalHandle: any;
    remoteSubscriber: ISubscriber<MetricsSnapshot> | undefined;
    remoteCancel: () => void;

    constructor(
      handler: MetricsSnapshotHandlerClient,
      registry: IMeterRegistry,
      exportPeriodSeconds: number,
      batchSize: number,
    );

    start(): void;

    stop(): void;
  }
  function embedMetricsSingleSubscriber<T>(
    single: Single<T>,
    next: Counter,
    complete: Counter,
    error: Counter,
    cancelled: Counter,
    timer: Timer,
  ): Single<T>;
  class MetricsSubscriber<T>
    implements ISubscription, ISubscriber<T> {
    constructor(
      actual: ISubscriber<T>,
      next: Counter,
      complete: Counter,
      error: Counter,
      cancelled: Counter,
      timer: Timer,
    );

    onSubscribe(s: ISubscription): void

    onNext(t: T): void

    onError(t: Error): void

    onComplete(): void

    request(n: number): void

    cancel(): void;
  }
  class RawMeterTag {
    key: string;
    value: string;

    constructor(key: string, value: string);
  }
  class SimpleMeterRegistry implements IMeterRegistry {
    meterMap: Object;

    constructor();

    registerMeter(meter: IMeter): void;

    registerMeters(meters: IMeter[]): void;

    meters(): IMeter[];
  }
  class Timer extends BaseMeter {
    histogram: Histogram;

    constructor(name: string, description?: string, tags?: RawMeterTag[]);

    update(duration: number): void;

    // delegate these to histogram
    clear(): void;
    totalCount(): number | undefined;
    min(): number | undefined;
    max(): number | undefined;
    mean(): number | undefined;
    stdDev(): number | undefined;
    percentiles(percentiles?: number[]): any;
    values(): any;

    toObject(): any;
  }

  export {
    BaseMeter,
    Counter,
    Timer,
    RawMeterTag,
    Histogram,
    ExponentiallyDecayingSample,
    EWMA as ExponentiallyWeightedMovingAverage,
    EWMA,
    Sample,
    UniformSample,
    ISample,
    DEFAULT_PERCENTILES,
    IMeter,
    IMeterRegistry,
    SimpleMeterRegistry,
    Metrics,
    MetricsExporter,
    MeterTag,
    MeterId,
    MeterMeasurement,
    MetricsSnapshot,
    Skew,
    MeterType,
    MeterStatistic,
    MetricsSnapshotHandlerServer,
    MetricsSnapshotHandlerClient,
  };

}
