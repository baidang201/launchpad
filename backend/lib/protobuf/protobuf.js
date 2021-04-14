import protobuf from "protobufjs"
import jsonDescriptor from "../../../proto/message.json"

const root = protobuf.Root.fromJSON(jsonDescriptor);
const Worker = root.lookupType("launchpadpackage.Worker");
const RoundInfo = root.lookupType("launchpadpackage.RoundInfo");
const Globalstatistics = root.lookupType("launchpadpackage.Globalstatistics");
const Status = root.lookupType("launchpadpackage.Status");
const CommonRequest = root.lookupType("launchpadpackage.CommonRequest");
const CommonResponse = root.lookupType("launchpadpackage.CommonResponse");

const WorkerRequest = root.lookupType("launchpadpackage.WorkerRequest");
const WorkerResponse = root.lookupType("launchpadpackage.WorkerResponse");
const GlobalStatisticsRequest = root.lookupType("launchpadpackage.GlobalStatisticsRequest");
const GlobalStatisticsResponse = root.lookupType("launchpadpackage.GlobalStatisticsResponse");
const AvgStakeRequest = root.lookupType("launchpadpackage.AvgStakeRequest");
const AvgStakeResponse = root.lookupType("launchpadpackage.AvgStakeResponse");
const StakeInfoRequest = root.lookupType("launchpadpackage.StakeInfoRequest");
const StakeInfoResponse = root.lookupType("launchpadpackage.StakeInfoResponse");

const RewardPenaltyRequest = root.lookupType("launchpadpackage.RewardPenaltyRequest");
const RewardPenaltyResponse = root.lookupType("launchpadpackage.RewardPenaltyResponse");

const AvgRewardRequest = root.lookupType("launchpadpackage.AvgRewardRequest");
const AvgRewardResponse = root.lookupType("launchpadpackage.AvgRewardResponse");

const ApyRequest = root.lookupType("launchpadpackage.ApyRequest");
const ApyResponse = root.lookupType("launchpadpackage.ApyResponse");

const CommissionRequest = root.lookupType("launchpadpackage.CommissionRequest");
const CommissionResponse = root.lookupType("launchpadpackage.CommissionResponse");

const NoticeRequest = root.lookupType("launchpadpackage.NoticeRequest");
const NoticeResponse = root.lookupType("launchpadpackage.NoticeResponse");

export default {Worker, RoundInfo, Globalstatistics, Status, 
  CommonRequest, CommonResponse,
  WorkerRequest, WorkerResponse,
  GlobalStatisticsRequest, GlobalStatisticsResponse,
  AvgStakeRequest, AvgStakeResponse,
  StakeInfoRequest, StakeInfoResponse,
  RewardPenaltyRequest, RewardPenaltyResponse,
  AvgRewardRequest, AvgRewardResponse,
  ApyRequest, ApyResponse,
  CommissionRequest, CommissionResponse,
  NoticeRequest, NoticeResponse,
};