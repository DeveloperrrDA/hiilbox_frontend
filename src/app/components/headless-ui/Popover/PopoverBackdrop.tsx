import CodePreview from "../../shared/CodePreview"
import PopoverBgDropcode from "./Code/PopoverBgDropcode"


const PopoverBackdrops = () => {
  return (
    <div>
      <CodePreview
        component={<PopoverBgDropcode />}
        filePath="src/app/components/headless-ui/Popover/Code/PopoverBgDropcode.tsx"
        title="Popover Backdrop"
      />
    </div>
  )
}

export default PopoverBackdrops
