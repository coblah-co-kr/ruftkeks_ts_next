import { ChangeEvent, KeyboardEvent, useState } from "react";
import Seo from "@/components/seo";
import styles from "./index.module.css"
import Modal from "@/components/modal";
import { useRouter } from "next/router";
import privacyTos from "@/components/privacyTos";
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";
import { updateAccessToken } from "@/store/accessTokenUpdate";

export default function Home() {
  const [selectSignup, setSelectedSignup] = useState(false);
  const [isAgreements, setAgreements] = useState("비동의");
  const [isTerms, setTerms] = useState(false);
  const [isPopup, setIsPopup] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const dispatch = useDispatch();

  const router = useRouter();
  const modal_timer = 1500;

  const signUp = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/account/signup`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: nickname,
            name: name,
            password: password1
          })
        }
      )
      const { status } = response;
      if (status === 201 || status === 400) {
        const data = await(response).text();
        setIsPopup(data);
        setTimeout(() => {
          setIsPopup("");
        }, modal_timer);
      }
    } catch (error) {
      setIsPopup("회원가입 중 오류가 발생하였습니다.");
      setTimeout(() => {
        setIsPopup("");
      }, modal_timer);
      console.log(error);
    }
  };

  const signIn = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/account/signin`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: nickname,
            password: password1
          })
        }
      )
      const { status } = response;
      
      if (status === 200) {
        const data = await(response).json();
        dispatch(updateAccessToken(data.accessToken));
        Cookies.set("refreshToken", data.refreshToken, { expires: 1 });
        Cookies.set("accessToken", data.accessToken, { expires: 1/24 });
        router.push(`/about`, undefined, { shallow: true });
      } else if (status === 401 || status === 403) {
        const data = await(response).text();
        setIsPopup(data);
        setTimeout(() => {
          setIsPopup("");
        }, modal_timer);
      }
    } catch (error) {
      setIsPopup("로그인 중 오류가 발생하였습니다.");
      setTimeout(() => {
        setIsPopup("");
      }, modal_timer);
      console.log(error);
    }
  }


  const tabSignup = () => {
    setSelectedSignup(true);
  };
  const tabLogin = () => {
    setSelectedSignup(false);
  };
  const tabAgreements = () => {
    setTerms(!isTerms);
  };
  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value.toLowerCase());
  };
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handlePassword1Change = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword1(event.target.value);
  };
  const handlePassword2Change = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword2(event.target.value);
  };

  const handleAgreement = (event: ChangeEvent<HTMLInputElement>) => {
    if (isAgreements === "비동의") {
      setAgreements("동의")
    } else {
      setAgreements("비동의")
    }
    
  }

  const handleLoginClick = () => {
    if (nickname && password1) {
      signIn();
    }
    else {
      setIsPopup("이메일과 비밀번호를 입력해 주세요.");
      setTimeout(() => {
        setIsPopup("");
      }, modal_timer);
    }
  };

  const handleSignupClick = () => {
    if (isAgreements === "비동의") {
      setIsPopup("약관에 동의해주세요.");
      setTimeout(() => {
        setIsPopup("");
      }, modal_timer);
    }
    else if (password1 === password2) {
      if (password1 && nickname) {
        signUp();
      }
      else {
        setIsPopup("이메일과 비밀번호를 입력해 주세요.");
        setTimeout(() => {
          setIsPopup("");
        }, modal_timer);
      }
    }
    else {
      setIsPopup("두 비밀번호가 틀렸습니다.");
      setTimeout(() => {
        setIsPopup("");
      }, modal_timer);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!selectSignup) {
        handleLoginClick();
      } else {
        handleSignupClick();
      }
    }
  };

  return (
    <div>
      <Seo subtitle = "Intro"/>
      {isPopup && <div className={styles.Popup}>{isPopup}</div>}
      <div className="max-w-[90rem] mx-auto bg-white h-screen">
        <img className="h-full w-full object-contain object-top" src="intro_img.png"/>
          <Modal content={privacyTos} isOpen={isTerms} setOpen={setTerms} />
          <div className={styles.loginSignup}>
            <div className={styles.loginSignupButtons}>
              <button
                className={selectSignup ? '' : styles.active}
                onClick={tabLogin}
              >
                로그인
              </button>
              <button
                className={selectSignup ? styles.active : ''}
                onClick={tabSignup}
              >
                회원가입
              </button>
            </div>
            <div className={styles.loginSignupInputs}>
              <input
                type="text"
                style={{textTransform: "lowercase"}}
                placeholder="닉네임을 입력하세요."
                value={nickname}
                onChange={handleNicknameChange}
                onKeyDown={handleKeyPress}
              />
              {selectSignup && (
                <input
                  type="text"
                  placeholder="본명을 입력하세요."
                  value={name}
                  onChange={handleNameChange}
                  onKeyDown={handleKeyPress}
                />
              )}
              <input
                type="password"
                placeholder="비밀번호를 입력하세요."
                value={password1}
                onChange={handlePassword1Change}
                onKeyDown={handleKeyPress}
              />
              {selectSignup && (
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요."
                  value={password2}
                  onChange={handlePassword2Change}
                  onKeyDown={handleKeyPress}
                />
              )}
            </div>
            {selectSignup && (
              <div>
                <button
                  className="text-xs"
                  onClick={tabAgreements}
                >
                  개인정보보호방침 및 이용약관에 동의합니다.
                </button>
                <input
                  className="translate-x-2 translate-y-0.5 scale-150"
                  type="checkbox"
                  value={isAgreements}
                  onChange={handleAgreement}
                />
              </div>
            )}
            <div className={styles.loginSignupButtonWrapper}>
              {!selectSignup ? (
                <button onClick={handleLoginClick}>로그인</button>
              ) : (
                <button onClick={handleSignupClick}>회원가입</button>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}