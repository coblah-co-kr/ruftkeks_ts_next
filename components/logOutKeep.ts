import { updateAccessToken } from "@/store/accessTokenUpdate";
import Cookies from "js-cookie";
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import goToHome from "./goToHome";

enum TokenType {
    OK="유효한 토큰입니다.",
    WRONG="잘못된 JWT 서명입니다.",
    EXPIRED="만료된 JWT 토큰입니다.",
    NOT_SUPPORT="지원되지않는 JWT 토큰입니다.",
    ILLEGAL="JWT 토큰이 잘못되었습니다.",
}


export default function logOutOrKeep( accessToken: string, dispatch: Function) {

    const logOut = async () => {
        Cookies.remove("refreshToken");
        dispatch(updateAccessToken(''));
    }

    const renewToken = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/account/token/renew`,
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        "refreshToken": Cookies.get("refreshToken"),
                    })
                }
            )
            if (response.status==201) {
                const data = await(response).json();
                Cookies.set("refreshToken", data.refreshToken, { expires: 1 });
                dispatch(updateAccessToken(data.accessToken));
            } else {
                logOut();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const checkTokenType = async () => {
        try {
            // 403 리턴받으면 이 함수 실행. 토큰 유형 체크하고, 만약 만료됬으면 재발급 시도, 재발급 실패하거나(refreshToken 만료), 잘못된 유형이면 로그아웃
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/account/token/validate`,
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                }
            )
            if (response.status === 200) {
                const data = await(response).text();
                if (data === TokenType.EXPIRED) {
                    renewToken();
                } else if (data === TokenType.OK) {
                    console.log("치명적인 오류입니다. 제작진에 문의해주세요.");
                } else {
                    logOut();
                }
            } else {
                console.log("개발자에게 문의바랍니다.");
            }
        } catch (error) {
            console.log(error);
        }
    }
    checkTokenType();
}