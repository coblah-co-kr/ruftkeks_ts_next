import Cookies from "js-cookie";

export default function TokenRefresh(accessToken:string) {
    if (accessToken !== '') {
        return accessToken;
    } else {
        const cookieAccessToken = Cookies.get("accessToken");
        if (cookieAccessToken) {
            return cookieAccessToken;
        } else {
            return '';
        }
    }
}