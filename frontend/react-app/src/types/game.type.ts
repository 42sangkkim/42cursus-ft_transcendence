// import { ParticipantType } from "./participant.type";
import { MessageType } from "./chat.type";
import { UserType } from "./user.type";

export interface OfferGameType {
  awayUser: UserType;
  myData: UserType;
  gameRoomURL: string;
  roomType: string;
}

export interface MatchHistoryType {
  id: number;
  player1Score: number;
  player2Score: number;
  createdAt: Date;
  player1: UserType;
  player2: UserType;
  player1ScoreChange: number;
  player2ScoreChange: number;
  gameMode: string;
  map: string;
}

export interface battleActionData {
  battleActionModal: boolean;
  awayUser: UserType;
  gameRoomURL: string;
}

export type GameRoomType = "PUBLIC" | "PROTECTED" | "PRIVATE" | "QUICK" | ""; // QUICK은 대전 신청 혹은 랭킹전에서 사용 (PROTECTED의 사용법과 동일하다면 향후 통합)

export interface gameType {
  id: string;
  name: string;
  type: GameRoomType;
  password: string;
  createdAt: Date;
  ownerId: string;

  // participants?: ParticipantType[];
}

export interface JoinedgameType extends gameType {
  hasNewMessages: boolean;
}

export interface GameRoomInfoType {
  roomURL: string;
  roomName: string;
  roomType: GameRoomType;
  roomPassword: string;
  roomOwner: UserType;
  numberOfParticipants: number;
  gameMode: string;
  map: string;
  homeUser: UserType;
  awayUser: UserType;
  homeReady: boolean;
  awayReady: boolean;
  chatMessages: MessageType[];
}

export interface gameAlertModalStateType {
  gameAlertModal: boolean;
  gameAlertModalMessage: string;
  shouldRedirect: boolean;
  shouldInitInfo: boolean;
}

export type GameMapType = "NORMAL" | "JUNGLE" | "DESERT";

export interface GameModalType {
  gameMap: GameMapType | null;
}

export interface ballLocationType {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  color: string;
  top: number;
  bottom: number;
  left: number;
  score: number;
  right: number;
  height: number;
  width: number;
}
