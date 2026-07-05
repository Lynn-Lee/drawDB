import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SideSheet } from "@douyinfe/semi-ui";
import { IconMenu } from "@douyinfe/semi-icons";
import { socials } from "../data/socials";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="py-4 px-12 sm:px-4 flex justify-between items-center">
        <div className="flex items-center justify-between w-full">
          <Link to="/">
            <BrandLogo />
          </Link>
          <div className="md:hidden flex gap-12">
            <Link
              className="text-lg font-semibold text-zinc-800 hover:text-sky-800 transition-colors duration-300"
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("navbar_features")}
            </Link>
            <Link
              to="/editor"
              className="text-lg font-semibold text-zinc-800 hover:text-sky-800 transition-colors duration-300"
            >
              {t("navbar_editor")}
            </Link>
            <Link
              to="/templates"
              className="text-lg font-semibold text-zinc-800 hover:text-sky-800 transition-colors duration-300"
            >
              {t("templates")}
            </Link>
          </div>
          <div className="md:hidden block space-x-3 ms-12">
            <a
              title={t("jump_to_github")}
              className="px-2 py-2 hover:opacity-60 transition-all duration-300 rounded-full text-2xl"
              href={socials.github}
              target="_blank"
              rel="noreferrer"
            >
              <i className="opacity-70 bi bi-github" />
            </a>
          </div>
        </div>
        <button
          aria-label={t("open_navigation_menu")}
          onClick={() => setOpenMenu((prev) => !prev)}
          className="hidden md:inline-block h-[24px]"
        >
          <IconMenu size="extra-large" />
        </button>
      </div>
      <hr />
      <SideSheet
        title={
          <BrandLogo />
        }
        visible={openMenu}
        onCancel={() => setOpenMenu(false)}
        width={window.innerWidth}
      >
        <Link
          className="hover:bg-zinc-100 block p-3 text-base font-semibold"
          onClick={() => {
            document
              .getElementById("features")
              .scrollIntoView({ behavior: "smooth" });
            setOpenMenu(false);
          }}
        >
          {t("navbar_features")}
        </Link>
        <hr />
        <Link
          to="/editor"
          className="hover:bg-zinc-100 block p-3 text-base font-semibold"
        >
          {t("navbar_editor")}
        </Link>
        <hr />
        <Link
          to="/templates"
          className="hover:bg-zinc-100 block p-3 text-base font-semibold"
        >
          {t("templates")}
        </Link>
        <hr />
        <a
          href={socials.github}
          target="_blank"
          rel="noreferrer"
          className="hover:bg-zinc-100 block p-3 text-base font-semibold"
        >
          GitHub
        </a>
      </SideSheet>
    </>
  );
}
