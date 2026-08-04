import {
  type IColumnConfig,
  type ITableConfigModalProps,
} from '@/components/modal-views/table-config-modal'
import { useModalAction } from '@/components/modal-views/context'
import { type ColumnDef } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'

function getColumnId<T>(col: ColumnDef<T>): string {
  const anyCol = col as ColumnDef<T> & { accessorKey?: string; id?: string }
  return String(anyCol.accessorKey ?? anyCol.id ?? '')
}

function getColumnName<T>(col: ColumnDef<T>): string {
  return typeof col.header === 'string' ? col.header : ''
}

export function useColumnConfig<T>(tableName: string, columns: ColumnDef<T>[]) {
  const { openModal } = useModalAction()

  const getStorageKey = (name: string) => `columnConfigs_${name}`

  const getInitialConfigs = (): IColumnConfig[] => {
    const stored = localStorage.getItem(getStorageKey(tableName))
    let storedConfigs: IColumnConfig[] = []

    if (stored) {
      try {
        storedConfigs = JSON.parse(stored)
      } catch {
        storedConfigs = []
      }
    }

    // Handle schema changes: keep stored order, drop removed, append new.
    const currentColumnIds = new Set(
      columns.map(getColumnId).filter(Boolean),
    )

    const validStoredConfigs = storedConfigs
      .filter((conf) => currentColumnIds.has(conf.id))
      .map((conf) => {
        const column = columns.find((col) => getColumnId(col) === conf.id)
        return {
          ...conf,
          name: column ? getColumnName(column) || conf.name : conf.name,
        }
      })

    const missingConfigs = columns
      .filter((col) => {
        const id = getColumnId(col)
        return id && !validStoredConfigs.some((conf) => conf.id === id)
      })
      .map((col) => ({
        id: getColumnId(col),
        name: getColumnName(col),
        visible: true,
      }))

    const mergedConfigs = [...validStoredConfigs, ...missingConfigs]

    if (mergedConfigs.length !== storedConfigs.length) {
      localStorage.setItem(getStorageKey(tableName), JSON.stringify(mergedConfigs))
    }

    return mergedConfigs
  }

  const [columnConfigs, setColumnConfigs] = useState<IColumnConfig[]>(getInitialConfigs)

  const handleChangeColumnConfigs = useCallback(
    (newColumnConfigs: IColumnConfig[]) => {
      setColumnConfigs(newColumnConfigs)
      localStorage.setItem(getStorageKey(tableName), JSON.stringify(newColumnConfigs))
    },
    [tableName],
  )

  const getVisibleColumns = useCallback((): ColumnDef<T>[] => {
    const visibleIds = columnConfigs.filter((col) => col.visible).map((col) => col.id)
    return visibleIds
      .map((id) => columns.find((col) => getColumnId(col) === id))
      .filter(Boolean) as ColumnDef<T>[]
  }, [columnConfigs, columns])

  const visibleColumns = useMemo(() => {
    return getVisibleColumns()
  }, [getVisibleColumns])

  return {
    visibleColumns,
    columnConfigs,
    handleChangeColumnConfigs,
    getVisibleColumns,
    openConfigModal() {
      const withFreshNames = columnConfigs.map((conf) => {
        const column = columns.find((col) => getColumnId(col) === conf.id)
        return {
          ...conf,
          name: column ? getColumnName(column) || conf.name : conf.name,
        }
      })

      openModal('TABLE_CONFIG', {
        initialColumnConfigs: withFreshNames,
        changeColumnConfigs: handleChangeColumnConfigs,
      } satisfies ITableConfigModalProps)
    },
  }
}
