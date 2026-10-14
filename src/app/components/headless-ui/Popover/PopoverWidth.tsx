import CodePreview from "../../shared/CodePreview"
import PopoverWidthCode from "./Code/PopoverWidthCode"

const PopoverWidth = () => {
  return (
    <div>
      <CodePreview
        component={<PopoverWidthCode />}
        filePath="src/app/components/headless-ui/Popover/Code/PopoverWidthCode.tsx"
        title="Popover Width"
      />
    </div>
  )
}

export default PopoverWidth
