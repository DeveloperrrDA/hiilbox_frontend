import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FormValidation = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Form validation</h4>
        <div className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username3" className="text-success">
                Your name
              </Label>
            </div>
            <Input
              id="username"
              placeholder="Bonnie Green"
              required
              variant="success"
            />
            <p className="text-success">
              <span className="font-medium ">Alright!</span>
              Username available!
            </p>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username4" className="text-error">
                Your name
              </Label>
            </div>
            <Input
              id="username4"
              placeholder="Bonnie Green"
              variant="failure"
            />
            <p className="text-error">
              <span className="font-medium ">Oops!</span> Username already
              taken!
            </p>
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default FormValidation;
