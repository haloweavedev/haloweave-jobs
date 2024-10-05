'use client';

import { useEffect } from 'react'
import { initSmoothScroll } from '../utils/smoothScroll'
import { initAnimations } from '../utils/animations'

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initSmoothScroll()
    initAnimations()
  }, [])

  return <div>{children}</div>
}