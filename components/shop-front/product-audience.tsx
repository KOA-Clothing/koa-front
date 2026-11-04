"use client";

import { genderLabels, ageGroupLabels } from "@/types/enum-labels";
import { AgeGroupEnum, GenderEnum } from "@/types/enums";

interface ProductAudienceProps {
  gender: GenderEnum;
  ageGroup: AgeGroupEnum;
}

export default function ProductAudience({ gender, ageGroup }: ProductAudienceProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <span>{genderLabels[gender]}</span>
      <span>•</span>
      <span>{ageGroupLabels[ageGroup]}</span>
    </div>
  );
}
