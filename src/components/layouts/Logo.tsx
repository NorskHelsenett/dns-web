import { routes } from "@/config/routes";
import { Link } from "@tanstack/react-router";
import { t } from "i18next";

export default function Logo() {
    return (
        <Link className="flex items-center gap-3" to={routes.home}>
            <img src="/symbol-light-green.svg" alt="Logo" width={64} />
            <h1 className="text-2xl">{t("app.title")}</h1>
        </Link>
    )
}