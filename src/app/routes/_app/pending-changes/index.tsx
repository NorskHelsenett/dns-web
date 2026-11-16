import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { usePendingChanges } from '@/features/pending-changes/hooks/usePendingChanges'
import { PendingChangesTable2 } from '@/features/pending-changes/components/PendingChangesTable'

export const Route = createFileRoute('/_app/pending-changes/')({
  component: PendingChangesPage,
})

function PendingChangesPage() {

  const { t } = useTranslation()
  
  // TODO: Add loading, error state when importing correct data
  const { data } = usePendingChanges()

  const zoneChanges = data?.zoneChanges ?? []
  const recordChanges = data?.recordChanges

  return (
    <div className="page-flex-setup">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-medium">{t("navbarTitles.pendingChanges")}</h1>
      </div>
      {recordChanges && <PendingChangesTable2 zoneChanges={zoneChanges} recordChanges={recordChanges} />}
    </div>
  )

}