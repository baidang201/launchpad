import protobuf from "protobufjs"
import jsonDescriptor from "../../proto/message.json"

let root = protobuf.Root.fromJSON(jsonDescriptor);
const Worker = root.lookupType("launchpadpackage.Worker");
const RoundInfo = root.lookupType("launchpadpackage.RoundInfo");
const Globalstatistics = root.lookupType("launchpadpackage.Globalstatistics");
const Status = root.lookupType("launchpadpackage.Status");
const Stakes = root.lookupType("launchpadpackage.Stakes");
const CommonRequest = root.lookupType("launchpadpackage.CommonRequest");
const CommonResponse = root.lookupType("launchpadpackage.CommonResponse");

const WorkerRequest = root.lookupType("launchpadpackage.WorkerRequest");
const WorkerResponse = root.lookupType("launchpadpackage.WorkerResponse");
const GlobalStatisticsRequest = root.lookupType("launchpadpackage.GlobalStatisticsRequest");
const GlobalStatisticsResponse = root.lookupType("launchpadpackage.GlobalStatisticsResponse");
const StakesRequest = root.lookupType("launchpadpackage.StakesRequest");
const StakesResponse = root.lookupType("launchpadpackage.StakesResponse");
const StakeInfoRequest = root.lookupType("launchpadpackage.StakeInfoRequest");

export default {Worker, RoundInfo, Globalstatistics, Status, Stakes, 
  CommonRequest, CommonResponse,
  WorkerRequest, WorkerResponse,
  GlobalStatisticsRequest, GlobalStatisticsResponse,
  StakesRequest, StakesResponse,
  StakeInfoRequest
};