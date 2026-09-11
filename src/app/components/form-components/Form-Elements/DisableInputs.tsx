import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DisableInputs = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Disabled inputs</h4>
        <div className="flex max-w-md flex-col gap-4 pb-20">
          <Label htmlFor="disabledInput1" className="mb-0">
            API token
          </Label>
          <Input
            type="text"
            id="disabledInput1"
            placeholder="Disabled input"
            disabled
          />
          <Label htmlFor="disabledInput2" className="mb-0">
            Personal access token
          </Label>
          <Input
            type="text"
            id="disabledInput2"
            placeholder="Disabled readonly input"
            disabled
            readOnly
          />
        </div>
      </CardBox>
    </div>
  );
};

export default DisableInputs;
