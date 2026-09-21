import CodePreview from "../../shared/CodePreview"
import PopoverTransitionCode from "./Code/PopoverTransitionCode"

const PopoverTransition = () => {
  return (
    <div>
      <CodePreview
        component={<PopoverTransitionCode />}
        filePath="src/app/components/headless-ui/Popover/Code/PopoverTransitionCode.tsx"
        title="Popover Transitions"
      />
    </div>
  )
}

export default PopoverTransition
