import { useState, useEffect } from "react";

export default function useYScroll() {
    const [yScroll, setYScroll] = useState(null);

    useEffect(() => {
        function handleYScroll(event) {
            setYScroll(event.target.scrollingElement.scrollTop);
        }

        window.addEventListener("scroll", handleYScroll);

        return () => {
            window.removeEventListener("scroll", handleYScroll);
        };
    }, []);

    return yScroll;
}
