import { socials } from "../data/socials";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="p-3 space-y-2">
      <p>{t("not_found_greeting")}</p>

      <p>{t("not_found_prompt")}</p>
      <p>
        {t("not_found_check_out")}{" "}
        <a className="text-blue-600" href={socials.docs}>
          {t("docs")}
        </a>
        ,{" "}
        <a className="text-blue-600" href="mailto:drawdb@outlook.com">
          {t("not_found_email")}
        </a>{" "}
        {t("not_found_or")}{" "}
        <a className="text-blue-600" href={socials.discord}>
          {t("not_found_discord")}
        </a>
      </p>
      <br />
      <p className="opacity-70">
        {t("not_found_relationship_hint")}
      </p>
      <a
        className="text-blue-600"
        href={`${socials.docs}/create-diagram#relationships`}
      >
        {t("not_found_see_here")}
      </a>
    </div>
  );
}
