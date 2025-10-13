"use client";

import React from "react";
import Image from "next/image";
import style from "./SocialLinks.module.scss";
import { SocialLink } from "../../types/socialLinks";
import {
  InstagrammIcon,
  TgIcon,
  VkIcon,
  YandexIcon,
  MaxIconSvg,
  YoutubeIconSvg,
} from "../../assets";

export type { SocialLink };

interface SocialLinksProps {
  links: SocialLink[];
  title?: string;
  className?: string;
}

const TelegramIcon = () => (
  <Image src={TgIcon} alt="Telegram" width={24} height={24} />
);

const VKIcon = () => <Image src={VkIcon} alt="VK" width={24} height={24} />;

const YoutubeIcon = () => (
  <Image src={YoutubeIconSvg} alt="Youtube" width={24} height={24} />
);

const MaxIcon = () => (
  <Image src={MaxIconSvg} alt="Youtube" width={24} height={24} />
);

const YandexZenIcon = () => (
  <Image src={YandexIcon} alt="Youtube" width={24} height={24} />
);

const InstagramIcon = () => (
  <Image src={InstagrammIcon} alt="Youtube" width={24} height={24} />
);

const iconMap = {
  telegram: TelegramIcon,
  vk: VKIcon,
  youtube: YoutubeIcon,
  instagramm: InstagramIcon,
  max: MaxIcon,
  yandexZen: YandexZenIcon,
};

const SocialLinksComponent: React.FC<SocialLinksProps> = ({
  links,
  title,
  className,
}) => {
  const linksArray = Array.isArray(links) ? links : [];

  if (linksArray.length === 0) {
    return null;
  }

  return (
    <div className={`${style.socialLinksContainer} ${className || ""}`}>
      {title && <span className={style.title}>{title}</span>}
      <div className={style.linksWrapper}>
        {linksArray.map((link, index) => {
          const IconComponent = iconMap[link.icon as keyof typeof iconMap];

          if (!IconComponent) {
            return null;
          }

          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={style.socialLink}
              aria-label={link.ariaLabel || `Перейти в ${link.name}`}
              title={link.name}
            >
              <IconComponent />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinksComponent;
