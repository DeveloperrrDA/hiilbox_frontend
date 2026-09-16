import Link from "next/link";
import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const InputShadow = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Inputs With Shadow</h4>
        <form className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email2">Your email</Label>
            </div>
            <Input
              id="email2"
              type="email"
              placeholder="name@materialm.com"
              required
              // shadow
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password2">Your password</Label>
            </div>
            <Input id="password2" type="password" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="repeat-password">Repeat password</Label>
            </div>
            <Input id="repeat-password" type="password" required />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="agree" />
            <Label htmlFor="agree" className="flex mb-0">
              I agree with the&nbsp;
              <Link
                href="#"
                className="text-priamry hover:underline dark:text-primary"
              >
                terms and conditions
              </Link>
            </Label>
          </div>
          <Button type="submit">Register new account</Button>
        </form>
      </CardBox>
    </div>
  );
};

export default InputShadow;
