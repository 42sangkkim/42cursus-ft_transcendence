import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as DS from "../index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { createGameRoomModalState } from "@src/recoil/atoms/modal";
import sha256 from "crypto-js/sha256";
import { gameSocket } from "@src/router/socket/gameSocket";
import { gameRoomURLState } from "@src/recoil/atoms/game";
import { useState } from "react";
import { RankGameWatingModal } from "@src/components/modal/game/rankGameWatingModal";

const GameListSideBar = () => {
  const [userData] = useRecoilState(userDataState);
  const setCreateGameRoom = useSetRecoilState(createGameRoomModalState);
  const setGameRoomURL = useSetRecoilState(gameRoomURLState);
  const [isOpenRankGameWatingModal, setIsOpenRankGameWatingModal] =
    useState<boolean>(false);

  const iconButtons: IconButtonProps[] = [
    {
      title: "방 만들기",
      iconSrc: "",
      onClick: () => {
        setCreateGameRoom(true);
        const gameRoomURL = sha256(new Date() + userData.id).toString();
        gameSocket.emit("createGameRoom", {
          user: userData,
          gameRoomURL: gameRoomURL,
        });
        gameSocket.emit("editGameRoomInfo", {
          gameRoomURL: gameRoomURL,
          infoType: "roomType",
          info: "CREATING",
        });
        setGameRoomURL(gameRoomURL);
      },
      theme: "LIGHT",
    },
    {
      title: "랭킹전 참가",
      iconSrc: "",
      onClick: () => setIsOpenRankGameWatingModal(true),
      theme: "LIGHT",
    },
  ];

  return (
    <DS.Container>
      <ButtonList buttons={iconButtons} />
      <br />
      <DS.TitleBox>내 전적</DS.TitleBox>
      <RateDoughnutChart userData={userData} />
      {/* 모달 영역 */}
      <RankGameWatingModal
        isOpen={isOpenRankGameWatingModal}
        setIsOpen={setIsOpenRankGameWatingModal}
      />
    </DS.Container>
  );
};

export default GameListSideBar;
