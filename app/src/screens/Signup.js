import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components/native';
import { ProgressContext, UserContext } from '../contexts';
import { Button, Input } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, removeWhitespace, checkNickname, checkStudent, checkPassword, checkName} from '../utils/common';
import { Alert } from 'react-native';
import { signup } from '../utils/firebase';
import SelectBox from 'react-native-multi-selectbox';



const major = [
    {
        item: '비서학과',
        value: '1',
    },
    {
        item: '관광서비스경영학과',
        value: '2',
    },
    {
        item: '휴먼사회복지학과',
        value: '3',
    },
    {
        item: '비지니스영어과',
        value: '4',
    },
    {
        item: '비즈니스중국어과',
        value: '5',
    },
    {
        item: '비지니스일본어과',
        value: '6',
    },
    {
        item: '세무회계학과',
        value: '7',
    },
    {
        item: '글로벌항공서비스학과',
        value: '8',
    },
    {
        item: '건축학과',
        value: '9',
    },
    {
        item: '토목공학과',
        value: '10',
    },
    {
        item: '실내건축과',
        value: '11',
    },
    {
        item: '디지털산업디자인학과',
        value: '12',
    },
    {
        item: '시각디자인과',
        value: '13',
    },
    {
        item: '주얼리디자인학과',
        value: '14',
    },
    {
        item: '멀티미디어디자인학과',
        value: '15',
    },
    {
        item: '정보통신공학과',
        value: '16',
    },
    {
        item: '리빙세라믹디자인학과',
        value: '17',
    },
    {
        item: '게임/vr디자인학과',
        value: '18',
    },
    {
        item: '방송영상미디어학과',
        value: '19',
    },
    {
        item: '방송뷰티학과',
        value: '20',
    },
    {
        item: '기계자동화학과',
        value: '21',
    },
    {
        item: '컴퓨터전자공학과',
        value: '22',
    },
    {
        item: '산업경영공학과',
        value: '23',
    },
    {
        item: '컴퓨터소프트웨어학과',
        value: '24',
    },
    {
        item: '메카트로닉스공학과',
        value: '25',
    },
    {
        item: '융합기계공학과',
        value: '26',
    },
]

const Container = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding: 40px 20px;
`;

const Containers = styled.SafeAreaView`
    background-color: ${({ theme }) => theme.background};
    padding: 40px 20px;
`;

const ErrorText = styled.Text`
    align-items: flex-start;
    width: 100%;
    height: 20px;
    margin-bottom: 10px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
`;

function Signup() {
    const { spinner } = useContext(ProgressContext);
    const { dispatch } = useContext(UserContext);

    const [selectedMajor, setSelectedMajor] = useState({})
    const [student, setStudent] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState('');

    const nicknameRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const didmountRef = useRef();
    

    useEffect(() => {
        // 오류메시지가 바로뜨는걸 막는다.
        if(didmountRef.current) {
            let _errorMessage = '';
            if (!checkStudent(student)) {
                _errorMessage = "학번을 제대로 입력하세요";
            } else if (!checkName(name)) {
                _errorMessage = "공백없이 한글로만 입력해주세요";
            } else if (!checkNickname(nickname)) {
                _errorMessage = "별명은 최대 8글자입니다 (모음,자음 불가)";
            } else if (!validateEmail(email)) {
                _errorMessage = "이메일 형식을 지켜주세요";
            } else if (!checkPassword(password)) {
                _errorMessage = "비밀번호는 영문,특수문자,숫자가 포함된 9자 이상이여야 합니다."
            } else if (password !== passwordConfirm) {
                _errorMessage = "비밀번호가 일치하지 않습니다."
            } else {
                _errorMessage = '';
            }
            setErrorMessage(_errorMessage);
        } else {
            didmountRef.current = true;
        }
    }, [student, name, nickname, email, password, passwordConfirm])

    useEffect(() => {
        setDisabled(!(student && name && nickname && email && password && !errorMessage));
    }, [student, name, nickname, email, password, passwordConfirm, errorMessage]);

    const _handleSignupButtonPress = async () => {
        try {
            spinner.start();
            const user = await signup({ student, nickname, email, password, name});
            dispatch(user);
            Alert.alert('회원가입 성공');
        } catch(e) {
            Alert.alert('회원가입 실패', e.message);
        } finally {
            spinner.stop();
        }
    };

    function onChange() {
        console.log(selectedMajor)
        return (el) => setSelectedMajor(el)
    }

    return (
        // 셀렉트박스는 스크롤뷰, 리스트에 중첩되어 들어가면 안되기때문에 
        //키보드웨어스크롤뷰 밖으로 빼줬다.
        <Containers>
            <SelectBox
            label="학과"
            options={major}
            inputPlaceholder="학과"
            value={selectedMajor}
            onChange={onChange()}
            hideInputFilter={false}
            />
            <KeyboardAwareScrollView  
                extraScrollHeight={20}
            >
                <Container>
                    <Input
                        label="학번"
                        value={student}
                        onChangeText={text => setStudent(removeWhitespace(text))}
                        onSubmitEditing={() => nameRef.current.focus()}
                        placeholder="학번"
                        returnKeyType="next"
                    />
                    <Input
                        label="이름"
                        value={name}
                        onChangeText={text => setName(removeWhitespace(text))}
                        onSubmitEditing={() =>  nicknameRef.current.focus()}
                        placeholder="이름"
                        returnKeyType="next"
                    />
                    <Input
                        label="별명"
                        value={nickname}
                        onChangeText={text => setNickname(removeWhitespace(text))}
                        onSubmitEditing={() => emailRef.current.focus()}
                        placeholder="별명"
                        returnKeyType="next"
                    />
                    <Input
                        label="이메일"
                        value={email}
                        onChangeText={text => setEmail(removeWhitespace(text))}
                        onSubmitEditing={() => passwordRef.current.focus()}
                        placeholder="이메일"
                        returnKeyType="next"
                    />
                    <Input
                        ref={passwordRef}
                        label="비밀번호"
                        value={password}
                        onChangeText={text => setPassword(removeWhitespace(text))}
                        onSubmitEditing={() => passwordConfirmRef.current.focus()}
                        placeholder="비밀번호"
                        returnKeyType="done"
                        isPassword
                    />
                    <Input
                        ref={passwordRef}
                        label="비밀번호확인"
                        value={passwordConfirm}
                        onChangeText={text => setPasswordConfirm(removeWhitespace(text))}
                        onSubmitEditing={_handleSignupButtonPress}
                        placeholder="비밀번호확인"
                        returnKeyType="done"
                        isPassword
                    />
                    <ErrorText>{errorMessage}</ErrorText>
                    <Button
                            title="회원가입"
                            onPress={_handleSignupButtonPress}
                            disabled={disabled}
                        />
                </Container>
            </KeyboardAwareScrollView>
        </Containers>
    )
}


export default Signup
