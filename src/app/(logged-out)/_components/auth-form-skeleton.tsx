import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface Props {
  itemList: Array<{ label: string; placeholder: string }>
  buttonLabel: string
}

export default function AuthFormSkeleton({ itemList, buttonLabel }: Props) {
  return (
    <div className="flex w-full flex-col gap-3.5">
      {itemList.map(({ label, placeholder }, i) => (
        <div key={i} className="space-y-1.5">
          <Label>{label}</Label>
          <Input readOnly disabled placeholder={placeholder} />
        </div>
      ))}

      <Button className="mt-2 gap-2" disabled>
        {buttonLabel}
      </Button>
    </div>
  )
}
