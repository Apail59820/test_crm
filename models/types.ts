/** * Generated TypeScript types for Directus Schema * Generated on: 2025-07-21T16:17:10.136Z */
export interface ContactQualif {
  id: string;
  label: string;
}

export interface Contact {
  id: string;
  sort: number;
  user_created: string | DirectusUser;
  date_created: 'datetime';
  user_updated: string | DirectusUser;
  date_updated: 'datetime';
  organization: string | Organization;
  first_name: string;
  last_name: string;
  position: string;
  email: string;
  phone: string;
  region: string;
  is_primary: boolean;
}

export interface Contribution {
  id: string;
  sort: number;
  user_created: string | DirectusUser;
  date_created: 'datetime';
  user_updated: string | DirectusUser;
  date_updated: 'datetime';
  organization: string | Organization;
  meeting_date: 'datetime';
  contact: string | Contact;
  notes_raw: string;
  project_timeframe_months: number;
  reminder_date: 'datetime';
  is_public: boolean;
  notes_redacted: string;
  validator: string | DirectusUser;
  validated_at: 'datetime';
  contact_function: string;
  contact_email: string;
  contact_phone: string;
  sector_activity: string | Sector;
  contact_qualification: string | ContactQualif;
  contact_origin: string | Origin;
  project_qualification: string | ProjectQualif;
  status: string | ContributionsStatus;
}

export interface ContributionsStatus {
  id: string;
  label: string;
}

export interface Organization {
  id: string;
  sort: number;
  user_created: string | DirectusUser;
  date_created: 'datetime';
  user_updated: string | DirectusUser;
  date_updated: 'datetime';
  name: string;
  siren: string;
  vat_number: string;
  country: string;
  org_type: string;
  org_subtype: string;
  address: string;
  phone: string;
  email: string;
  notes_raw: string;
  project_qualification: string;
  project_timeframe_months: number;
  reminder_date: 'datetime';
  is_public: boolean;
  note_redacted: string;
  validator: string | DirectusUser;
  validated_at: 'datetime';
}

export interface Origin {
  id: string;
  label: string;
}

export interface ProjectQualif {
  id: string;
  label: string;
}

export interface Sector {
  id: string;
  label: string;
}

export interface DirectusUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  location: string;
  title: string;
  description: string;
  tags: string;
  avatar: string;
  language: string;
  tfa_secret: boolean;
  status: string;
  role: string;
  token: string;
  last_access: string;
  last_page: string;
  provider: string;
  external_identifier: string;
  auth_data: string;
  email_notifications: boolean;
  appearance: string;
  theme_dark: string;
  theme_light: string;
  theme_light_overrides: string;
  theme_dark_overrides: string;
  policies: string;
  region: string;
  entity: string;
}

export interface DirectusFile {
  id: string;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: string;
  uploaded_by: string;
  uploaded_on: string;
  modified_by: string;
  modified_on: string;
  charset: string;
  filesize: number;
  width: number;
  height: number;
  duration: number;
  embed: string;
  description: string;
  location: string;
  tags: string;
  metadata: string;
  created_on: string;
  focal_point_x: string;
  focal_point_y: string;
  tus_id: string;
  tus_data: string;
}

export interface DirectusFolder {
  id: string;
  name: string;
  parent: string;
}

export interface DirectusRole {
  id: string;
  name: string;
  icon: string;
  description: string;
  admin_access: boolean;
  app_access: boolean;
  children: string;
  users: string;
  parent: string;
  policies: string;
}

export interface ApiCollections {
  contact_qualifs: ContactQualif[];
  contacts: Contact[];
  contributions: Contribution[];
  contributions_status: ContributionsStatus[];
  organizations: Organization[];
  origins: Origin[];
  project_qualifs: ProjectQualif[];
  sectors: Sector[];
  directus_users: DirectusUser[];
}

