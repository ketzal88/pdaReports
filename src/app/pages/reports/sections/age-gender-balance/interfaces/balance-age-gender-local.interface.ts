export interface BalanceAgeGenderLocal {
  labelAgeGender?: string;
  contentAgeGender?: ContentAgeGender[];
}

export interface ContentAgeGender {
  gender?: string;
  genderName?: string;
  percentage?: number;
}
