import React, { useContext, useState, useEffect, useRef } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { Alert, Text } from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import SelectBox from "react-native-multi-selectbox";

import {
  validateEmail,
  removeWhitespace,
  checkNickname,
} from "../../utils/common";
import { Input } from "../../components";
import { getItemFromAsync } from "../../utils/AsyncStorage";
import { ProgressContext, ReadyContext } from "../../contexts";
import majors from "../../utils/majors";

const Container = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const Title = styled.View`
  align-items: center;
  width: 100%;
`;

const Item = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const UpdateButton = styled.TouchableOpacity`
  padding-left: 10px;
  padding-top: 20px;
`;

const UpdatePost = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 40px;
`;

const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const ProfileUpdateInfo = ({ isNickname, isEmail, major, navigation }) => {
  const [profile, setProfile] = useState({});
  const [nickname, setIsNickname] = useState(isNickname);
  const [email, setIsEmail] = useState(isEmail);
  const [majorUpdate, setMajorUpdate] = useState(true);
  const [emailUpdate, setEmailUpdate] = useState(true);
  const [nicknameUpdate, setNicknameUpdate] = useState(true);
  const [selectedMajor, setSelectedMajor] = useState(major);
  const [errorMessage, setErrorMessage] = useState("");

  const theme = useContext(ThemeContext);

  const { readyDispatch } = useContext(ReadyContext);
  const { spinner } = useContext(ProgressContext);

  const didmountRef = useRef();

  const _handleMajorUpdadte = () => {
    setMajorUpdate(false);
  };

  const _handleEmailUpdadteButton = () => {
    setEmailUpdate(false);
  };

  const _handleNicknameUpdadteButton = () => {
    setNicknameUpdate(false);
  };

  const _handleNickname = (nickname) => {
    setIsNickname(removeWhitespace(nickname));
  };

  const _handleEmail = (email) => {
    setIsEmail(removeWhitespace(email));
  };

  function onChange() {
    return (el) => setSelectedMajor(el);
  }

  const _ProfileUpdadte = async () => {
    try {
      spinner.start();
      const config = {
        method: "PUT",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          nickname: nickname,
          major: selectedMajor.value,
        }),
      };
      console.log(email);
      console.log(nickname);
      console.log(selectedMajor);
      const id = await getItemFromAsync("id");
      const response = await fetch(
        `http://13.125.55.135:9800/api/students/${id}`,
        config
      );

      const json = await response.json();
      console.log(json);
      readyDispatch.notReady();
      json.success ? setProfile(json.profile) : Alert.alert(json.msg);
    } catch (e) {
    } finally {
      spinner.stop();
      navigation.navigate("Main");
    }
  };

  useEffect(() => {
    if (didmountRef.current) {
      let _errorMessage = "";
      if (!checkNickname(nickname)) {
        _errorMessage = "별명은 최대 8글자입니다 (모음,자음 불가)";
      } else if (!validateEmail(email)) {
        _errorMessage = "이메일 형식을 지켜주세요";
      } else {
        _errorMessage = "";
      }
      setErrorMessage(_errorMessage);
    } else {
      didmountRef.current = true;
    }
  }, [nickname, email]);

  return (
    <Container>
      <Title>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>프로필 수정</Text>
      </Title>
      <UpdatePost onPress={_ProfileUpdadte}>
        <AntDesign name="checkcircleo" size={30} color="black" />
      </UpdatePost>
      {nicknameUpdate ? (
        <Item>
          <Input
            label="닉네임"
            value={isNickname}
            placeholder={nickname}
            disabled
          />
          <UpdateButton onPress={_handleNicknameUpdadteButton}>
            <FontAwesome5 name="pencil-alt" size={35} color="black" />
          </UpdateButton>
        </Item>
      ) : (
        <Input
          label="닉네임"
          value={nickname}
          onChangeText={_handleNickname}
          placeholder={isNickname}
        />
      )}

      {emailUpdate ? (
        <Item>
          <Input label="이메일" value={isEmail} placeholder={email} disabled />
          <UpdateButton onPress={_handleEmailUpdadteButton}>
            <FontAwesome5 name="pencil-alt" size={35} color="black" />
          </UpdateButton>
        </Item>
      ) : (
        <Input
          label="이메일"
          value={email}
          onChangeText={_handleEmail}
          placeholder={isEmail}
        />
      )}

      {majorUpdate ? (
        <Item>
          <Input label="학과" value={major} placeholder={major} disabled />
          <UpdateButton onPress={_handleMajorUpdadte}>
            <FontAwesome5 name="pencil-alt" size={35} color="black" />
          </UpdateButton>
        </Item>
      ) : (
        <SelectBox
          label="학과"
          options={majors}
          inputPlaceholder="학과"
          value={selectedMajor}
          onChange={onChange()}
          hideInputFilter={false}
        />
      )}
      <ErrorText>{errorMessage}</ErrorText>
    </Container>
  );
};

export default ProfileUpdateInfo;
