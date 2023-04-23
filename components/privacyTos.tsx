import Privacy from "./privacy";
import ToS from "./tos";

export default function privacyTos() {
    return (
        <>
            <p className="text-3xl font-bold">개인정보 보호방침 및 서비스 이용약관</p>
            <br />
            <Privacy />
            <br />
            <ToS />
        </>
    );
}