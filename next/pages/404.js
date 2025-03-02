import {useEffect} from 'react'
import {useRouter} from 'next/router'

export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return <p>Redirecting to homepage...</p>
}
