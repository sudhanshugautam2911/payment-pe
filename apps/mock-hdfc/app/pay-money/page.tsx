'use client'

import { Card } from '@repo/ui/card'
import { TextInput } from '@repo/ui/textinput'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { verifyToken } from '../lib/actions/verifyToken'
import { Button } from '@repo/ui/button'
import { validatePayment } from '../lib/actions/validatePayment'
import { cancelPayment } from '../lib/actions/cancelPayment'

const PayMoneyContent = () => {
  const [accountNumber, setAccountNumber] = useState(123412341234)
  const [password, setPassword] = useState("testing-password")
  const [userId, setUserId] = useState("")
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    async function fetchDecodedCode() {
      if (!token) {
        setError("Token is required")
        return
      }

      setLoading(true)
      try {
        const res = await verifyToken(token)
        if (res.status === 200) {
          const decoded = res.data
          setUserId(decoded?.userId ?? "")
          setAmount(decoded?.amount ?? 0)
        } else {
          throw new Error("Invalid Token")
        }
      } catch (err) {
        setError("Invalid token")
        console.log("Error verifying token:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDecodedCode()
  }, [token])

  const handleCancel = async () => {
    setLoading(true)
    try {
      await cancelPayment(token)
      window.location.href = process.env.NEXT_PUBLIC_REDIRECT_URL || ''
    } catch (err) {
      setError("Error during cancellation")
      console.error("Cancel payment failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      await validatePayment(token)
      window.location.href = process.env.NEXT_PUBLIC_REDIRECT_URL || ''
    } catch (err) {
      setError("Error during payment validation")
      console.error("Payment validation failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='pb-10'>
        <h1 className='text-xl font-mono underline'>HDFC Netbanking</h1>
      </div>

      <div className="w-full grid grid-cols-4">
        <div className='col-start-2'>
          <h2 className='font-mono'>Hey!</h2>
          <h4 className='text-lg font-mono text-gray-700'>You are about to pay: <span className=''>₹{amount}</span></h4>
          <p className='text-sm text-gray-400 font-mono'>to Payment-Pe</p>
        </div>
        <Card title={"Payment Portal"}>
          <TextInput label={"Account number"} placeholder={"Account number"} value={accountNumber} onChange={(val) => {
            setAccountNumber(Number(val))
          }} />
          <TextInput label={"Netbanking Password"} placeholder={"Password"} value={password} onChange={(val) => {
            setPassword(val)
          }} />
          <div className='mt-5'>
            {loading ? (
              <p>Loading...</p>  // Show loading text or spinner
            ) : (
              <>
                <Button onClick={handleCancel} disabled={loading}>Cancel</Button>
                <Button onClick={handlePayment} disabled={loading}>Pay Now</Button>
              </>
            )}
            {error && <p className="text-red-500">{error}</p>} {/* Error message */}
          </div>
        </Card>
      </div>
      <div className='w-full text-center mt-12'>
        <p className='text-xs text-gray-500'>*This is not real hdfc netbanking portal</p>
        <p className='text-xs text-gray-500'>*For testing you can use pre-filled values and just click on pay now button</p>
      </div>
    </div>
  )
}

export default function PayMoney() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayMoneyContent />
    </Suspense>
  )
}
