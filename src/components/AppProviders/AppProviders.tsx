'use client'

import { useState } from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { App, ConfigProvider } from 'antd'
import { usePathname } from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import TopBar from '@/components/TopBar/TopBar'
import CustomEmpty from '@/components/CustomEmpty/CustomEmpty'
import { AuthProvider } from '@/lib/auth-context'

export default function AppProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideTopBar = pathname.startsWith('/login')

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'var(--color-primary)',
            colorTextBase: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
            borderRadius: 6,
          },
          cssVar: true,
        }}
        renderEmpty={() => <CustomEmpty />}
      >
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
          <App>
            <AuthProvider>
              {!hideTopBar && <TopBar />}
              {children}
            </AuthProvider>
          </App>
        </QueryClientProvider>
      </ConfigProvider>
    </AntdRegistry>
  )
}
