import React from "react";
import ExternalLink from "../../external-link";
import Icon from "../../icon";
import { SocialIconProps } from "@/types";
import { commonStyles } from "@/common";

export default function SocialIcon({ color, url, iconType }: SocialIconProps) {
  return (
    <ExternalLink url={url}>
      <Icon name={`logo-${iconType}`} size={26} color={color} style={commonStyles.icon} />
    </ExternalLink>
  );
}
