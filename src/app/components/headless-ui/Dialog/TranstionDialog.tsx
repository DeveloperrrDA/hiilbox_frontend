'use client'

import CodePreview from "../../shared/CodePreview"
import TransitionDialogCode from "./Code/TransitionDialogCode"



const TranstionDialog = () => {
  return (
    <div>
      {/* <CardBox className='p-0'>
        <div>
          <div className='p-6'>
            <h4 className='text-lg font-semibold mb-4'>Transitions Dialog</h4>
            <Transitiondialog />
          </div>
          <CodeDialog>{TransitiondialogCode}</CodeDialog>
        </div>
      </CardBox> */}
      <CodePreview
              component={<TransitionDialogCode />}
              filePath="src/app/components/headless-ui/Dialog/Code/TransitionDialogCode.tsx"
              title="Transitions Dialog"
            />
    </div>
  )
}

export default TranstionDialog
