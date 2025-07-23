'use client'

import { PageHeader } from "@/components/PageHeader/PageHeader";
import styles from './NewsletterPage.module.scss'
import NewsletterFilters, {
  NewsletterFilterValues,
} from "@/components/NewsletterFilters/NewsletterFilters";
import ContributionStatusChart from "@/components/ContributionStatusChart/ContributionStatusChart";
import { useState } from "react";

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
    </div>
  );
}