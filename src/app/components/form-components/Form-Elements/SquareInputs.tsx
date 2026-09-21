import SquareInputsCodes from "./Codes/SquareInputs";
import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const SquareInputs = () => {
  return (
    <div>
      
    

        <form className="flex  flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email1">Your email</Label>
            </div>
            <Input
              id="email1"
              type="email"
              placeholder="name@materialm.com"
              required
              className="form-rounded-md rounded-md"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password1">Your password</Label>
            </div>
            <Input
              id="password1"
              type="password"
              required
              className="form-rounded-md rounded-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox className="checkbox" id="remember1" />
            <Label htmlFor="remember1" className="mb-0">
              Remember me
            </Label>
          </div>
          <Button type="submit" className="rounded-md ">
            Submit
          </Button>
        </form>
   
    </div>
  );
};

export default SquareInputs;
