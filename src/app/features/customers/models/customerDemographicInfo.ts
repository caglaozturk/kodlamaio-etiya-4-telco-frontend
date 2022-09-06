export interface CustomerDemographicInfo {
  firstName: string;
  lastName: string;
  gender: 'Female' | 'Male' | 'Other';
  motherName: string;
  middleName: string;
  birthDate: string;
  fatherName: string;
  nationalityId: number;
}
