import Link from "next/link";
export default function NavBar(pathname:string) {
    return (
        <nav>
            <div>
                <Link href="/about" className={pathname==="/about" ? "font-bold mr-10" : "mr-10"}>
                    About
                </Link>
                <Link href="/pictures" className={pathname==="/pictures" ? "font-bold mr-10" : "mr-10"}>
                    Pictures
                </Link>
                <Link href="/financial" className={pathname==="/financial" ? "font-bold mr-10" : "mr-10"}>
                    Financial
                </Link>
                <Link href="/devlog" className={pathname==="/devlog" ? "font-bold mr-10" : "mr-10"}>
                    DevLog
                </Link>
                <Link href="/mypage" className={pathname==="/mypage" ? "font-bold" : ""}>
                    MyPage
                </Link>
            </div>
            <style jsx>{`
                nav {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding : 3%;
                }
            `}</style>
        </nav>
    );
}