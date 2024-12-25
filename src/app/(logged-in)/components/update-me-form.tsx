'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { handleErrorApi } from '@/utils/errors'
import { AccountDataResponseType, updateMeSchema, UpdateMeSchemaType } from '@/lib/schema-validations/account.schema'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUpdateMeMutation } from '@/app/(logged-in)/hooks/use-account'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export default function UpdateMeForm({ me }: { me: AccountDataResponseType }) {
  const router = useRouter()

  const updateMeMutation = useUpdateMeMutation()

  const form = useForm<UpdateMeSchemaType>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: {
      name: me.name,
    },
  })

  async function onValid(data: UpdateMeSchemaType) {
    if (updateMeMutation.isPending) return

    try {
      await updateMeMutation.mutateAsync(data)
      router.refresh()
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} noValidate className="flex w-full flex-col gap-3.5">
        {/* Email */}
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="email" autoComplete="name" placeholder="bruce@wayne.dc" value={me.email} readOnly />
        </FormControl>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" autoComplete="name" placeholder="Bruce Wayne" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Button */}
        <Button type="submit" disabled={updateMeMutation.isPending} className="mt-2 w-fit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
