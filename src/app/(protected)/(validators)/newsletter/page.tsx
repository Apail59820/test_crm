'use client'

import { PageHeader } from "@/components/PageHeader/PageHeader";
import styles from './NewsletterPage.module.scss'
import NewsletterFilters, {
  NewsletterFilterValues,
} from "@/components/NewsletterFilters/NewsletterFilters";
import ContributionStatusChart from "@/components/ContributionStatusChart/ContributionStatusChart";
import { useState } from "react";
import ContributionTable from "@/components/ContributionTable/ContributionTable";
import ParticipationStatsSection from "@/components/ParticipationStatsSection/ParticipationStatsSection";
import NewsletterBuilder from "@/components/NewsletterBuilder/NewsletterBuilder";

export default function ValidatorPage() {
  const [filters, setFilters] = useState<NewsletterFilterValues | null>(null);

  return (
    <div className={styles.container}>
      <PageHeader
        title="Newsletter"
        subtitle="Centralisez et validez les informations avant diffusion"
      />

      <NewsletterFilters onSearch={setFilters} />
      <ContributionStatusChart filters={filters} />
      <ContributionTable filters={filters} />
      <ParticipationStatsSection/>
      <NewsletterBuilder/>
    </div>
  );
}