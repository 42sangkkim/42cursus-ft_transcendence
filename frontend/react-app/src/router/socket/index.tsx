import {
  ChannelType,
  ChatType,
  OfferGameType,
  UserStatus,
  UserType,
} from "@type";
import { chatSocket } from "./chatSocket";
import * as cookies from "react-cookies";
import { gameSocket } from "./gameSocket";
import { userDataState } from "@src/recoil/atoms/common";
import {
  battleActionModalState,
  channelInviteAcceptModalState,
} from "@src/recoil/atoms/modal";
import { allUserListState } from "@src/recoil/atoms/common";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  allChannelListState,
  channelState,
  joinedChannelListState,
  messageListState,
  participantListState,
} from "@src/recoil/atoms/channel";
import {
  dmListState,
  dmOtherState,
  joinedDmOtherListState,
} from "@src/recoil/atoms/directMessage";
import { useEffect } from "react";
import { RefreshChannelType } from "@src/types/channel.type";
import { useNavigate } from "react-router-dom";

const Socket = ({ children }: { children: React.ReactNode }) => {
  const [user] = useRecoilState(userDataState);
  const [, setBattleActionModal] = useRecoilState(battleActionModalState);
  const setAllUserList = useSetRecoilState(allUserListState);
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const setMessageList = useSetRecoilState(messageListState);
  const [curChannel, setChannel] = useRecoilState(channelState);
  const setJoinedDmOtherList = useSetRecoilState(joinedDmOtherListState);
  const setDmList = useSetRecoilState(dmListState);
  const dmOther = useRecoilValue(dmOtherState);
  const setAllChannelList = useSetRecoilState(allChannelListState);
  const setParticipantList = useSetRecoilState(participantListState);
  const setInvite = useSetRecoilState(channelInviteAcceptModalState);
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = cookies.load("jwt");
    if (jwt) {
      chatSocket.io.opts.extraHeaders = {
        Authorization: `Bearer ${jwt}`,
      };
      gameSocket.io.opts.extraHeaders = {
        Authorization: `Bearer ${jwt}`,
      };
      chatSocket.connect();
      gameSocket.connect();
    } else {
      chatSocket.disconnect();
      gameSocket.disconnect();
    }
  }, []);

  // Init chat socket events
  useEffect(() => {
    chatSocket.off("refresh_users");
    chatSocket.on("refresh_users", (userList: UserType[]) => {
      setAllUserList(userList);
    });

    chatSocket.off("get_message");
    chatSocket.on("get_message", (chat: ChatType) => {
      if (chat.message.channelId === curChannel?.id) {
        setMessageList((prev) => [...prev, chat.message]);
      } else {
        setJoinedChannelList((prev) =>
          prev.map((joinedChannel) =>
            chat.message.channelId === joinedChannel.id
              ? { ...joinedChannel, hasNewMessages: true }
              : joinedChannel,
          ),
        );
      }
    });

    chatSocket.off("get_dm");
    chatSocket.on("get_dm", ({ message, user }) => {
      console.log("dm", message, user);
      if (dmOther?.id === user.id) {
        setDmList((prev) => [...prev, message]);
      } else {
        setJoinedDmOtherList((prev) => {
          const filtered = prev.filter((other) => other.id !== user.id);
          return [{ ...user, hasNewMessages: true }, ...filtered];
        });
      }
    });

    chatSocket.off("refresh_channel");
    chatSocket.on(
      "refresh_channel",
      ({ channel, participants }: RefreshChannelType) => {
        console.log("refresh_channel", channel, participants);
        setJoinedChannelList((prev) =>
          prev.map((prevChannel) =>
            prevChannel.id === channel.id
              ? { ...channel, hasNewMessages: prevChannel.hasNewMessages }
              : prevChannel,
          ),
        );
        if (curChannel?.id === channel.id) {
          setChannel(channel);
          setParticipantList(participants);
        }
      },
    );

    chatSocket.off("refresh_all_channels");
    chatSocket.on("refresh_all_channels", (channelList: ChannelType[]) => {
      setAllChannelList(channelList);
    });

    chatSocket.off("kicked");
    chatSocket.on("kicked", (channelId: string) => {
      setJoinedChannelList((prev) =>
        prev.filter((joinedChannel) => joinedChannel.id !== channelId),
      );
      if (curChannel?.id === channelId) {
        navigate("/channel-list");
        alert("채널에서 추방되었습니다.");
      }
    });

    chatSocket.off("channel_deleted");
    chatSocket.on("channel_deleted", (channelId: string) => {
      setJoinedChannelList((prev) =>
        prev.filter((joinedChannel) => joinedChannel.id !== channelId),
      );
      if (curChannel?.id === channelId) {
        navigate("/channel-list");
        alert("채널이 삭제되었습니다.");
      }
    });

    chatSocket.off("get_invite");
    chatSocket.on("get_invite", (user: UserType, channel: ChannelType) => {
      if (user.status === UserStatus.ONLINE) {
        setInvite({ user, channel });
      }
    });
  }, [
    curChannel?.id,
    dmOther?.id,
    navigate,
    setAllChannelList,
    setAllUserList,
    setChannel,
    setDmList,
    setInvite,
    setJoinedChannelList,
    setJoinedDmOtherList,
    setMessageList,
    setParticipantList,
  ]);

  useEffect(() => {
    gameSocket.off("offerGame");
    gameSocket.on("offerGame", (data: OfferGameType) => {
      console.log("대전 신청 소켓 통신 확인: ", data, data.user_id);
      console.log("user.id", user.id);
      setBattleActionModal({
        battleActionModal: user.id === data.user_id,
        awayUser: data.awayUser,
      });
    });
  }, [setBattleActionModal, user.id]);

  return children;
};

export default Socket;
