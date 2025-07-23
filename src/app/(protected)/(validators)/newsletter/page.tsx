import { PageHeader } from "@/components/PageHeader/PageHeader";
import styles from './NewsletterPage.module.scss'
import NewsletterFilters from "@/components/NewsletterFilters/NewsletterFilters";
import ContributionStatusChart from "@/components/ContributionStatusChart/ContributionStatusChart";

export default function ValidatorPage() {
  return (
    <div className={styles.container}>
      <PageHeader
        title="Newsletter"
        subtitle="Centralisez et validez les informations avant diffusion"
      />

      <NewsletterFilters/>
      <ContributionStatusChart/>
    </div>
  )
}