import CodePreview from '@/app/components/shared/CodePreview'
import DropdownMenucheckboxes from './code/DropdownMenuCheckboxesCode'

export function DropdownMenuCheckboxes() {
  return (
    <>
      <CodePreview
        component={<DropdownMenucheckboxes />}
        filePath='src/app/components/shadcn-ui/Dropdown/code/DropdownMenuCheckboxesCode.tsx'
        title='Dropdown With Checkbox'
      />
    </>
  )
}
